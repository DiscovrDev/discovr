import { _DiscovrCache, DiscovrCacheStaleGenerationError } from "../_DiscovrCache";

function countingFetcher<T>(value: T): { fetcher: () => Promise<T>; calls: () => number } {
	let calls = 0;
	return {
		fetcher: async () => {
			calls++;
			return value;
		},
		calls: () => calls,
	};
}

describe("_DiscovrCache", () => {
	it("caches a session-policy call by params — repeat calls with the same params don't refetch", async () => {
		const cache = new _DiscovrCache();
		const { fetcher, calls } = countingFetcher({ id: "page_1" });

		const first = await cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, fetcher);
		const second = await cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, fetcher);

		expect(first).toEqual({ id: "page_1" });
		expect(second).toEqual({ id: "page_1" });
		expect(calls()).toBe(1);
	});

	it("treats different params as different cache entries", async () => {
		const cache = new _DiscovrCache();
		const { fetcher, calls } = countingFetcher({ ok: true });

		await cache.wrap("getPage", { pageId: "a" }, undefined, undefined, fetcher);
		await cache.wrap("getPage", { pageId: "b" }, undefined, undefined, fetcher);

		expect(calls()).toBe(2);
	});

	it("dedupes concurrent in-flight calls for the same key — an accidental loop costs one network call", async () => {
		const cache = new _DiscovrCache();
		let calls = 0;
		const fetcher = () =>
			new Promise<{ ok: true }>((resolve) => {
				calls++;
				setTimeout(() => resolve({ ok: true }), 10);
			});

		const results = await Promise.all(
			Array.from({ length: 5 }, () =>
				cache.wrap("getPage", { pageId: "x" }, undefined, undefined, fetcher),
			),
		);

		expect(calls).toBe(1);
		expect(results).toHaveLength(5);
	});

	it("expires ttl-policy entries after the given duration", async () => {
		const cache = new _DiscovrCache();
		const { fetcher, calls } = countingFetcher({ ok: true });

		await cache.wrap("searchMedia", { q: "avatar" }, 10, undefined, fetcher);
		expect(calls()).toBe(1);

		await cache.wrap("searchMedia", { q: "avatar" }, 10, undefined, fetcher);
		expect(calls()).toBe(1);

		await new Promise((resolve) => setTimeout(resolve, 20));
		await cache.wrap("searchMedia", { q: "avatar" }, 10, undefined, fetcher);
		expect(calls()).toBe(2);
	});

	it("bypass skips the cached read but still refreshes the stored entry", async () => {
		const cache = new _DiscovrCache();
		let calls = 0;
		const fetcher = async () => {
			calls++;
			return { call: calls };
		};

		const first = await cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, fetcher);
		const bypassed = await cache.wrap("getPage", { pageId: "abc" }, undefined, true, fetcher);
		const third = await cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, fetcher);

		expect(first).toEqual({ call: 1 });
		expect(bypassed).toEqual({ call: 2 });
		// Third call reads the entry the bypass call just refreshed — no extra fetch.
		expect(third).toEqual({ call: 2 });
		expect(calls).toBe(2);
	});

	it("invalidate purges only the given operationIds, across all their param variants", async () => {
		const cache = new _DiscovrCache();
		const profiles = countingFetcher({ profiles: [] });
		const media = countingFetcher({ id: "MV_1" });

		await cache.wrap("getProfiles", {}, undefined, undefined, profiles.fetcher);
		await cache.wrap("getProfile", { profileId: "p1" }, undefined, undefined, profiles.fetcher);
		await cache.wrap("getMedia", { mediaId: "MV_1" }, undefined, undefined, media.fetcher);

		cache.invalidate(["getProfiles", "getProfile"]);

		await cache.wrap("getProfiles", {}, undefined, undefined, profiles.fetcher);
		await cache.wrap("getProfile", { profileId: "p1" }, undefined, undefined, profiles.fetcher);
		await cache.wrap("getMedia", { mediaId: "MV_1" }, undefined, undefined, media.fetcher);

		expect(profiles.calls()).toBe(4); // getProfiles + getProfile, each refetched once after invalidation
		expect(media.calls()).toBe(1); // untouched
	});

	it("clear wipes every entry regardless of operationId", async () => {
		const cache = new _DiscovrCache();
		const { fetcher, calls } = countingFetcher({ ok: true });

		await cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, fetcher);
		cache.clear();
		await cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, fetcher);

		expect(calls()).toBe(2);
	});

	it("when disabled, always calls the fetcher and never caches", async () => {
		const cache = new _DiscovrCache({ enabled: false });
		const { fetcher, calls } = countingFetcher({ ok: true });

		await cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, fetcher);
		await cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, fetcher);

		expect(calls()).toBe(2);
	});

	it("discards a fetch's result if clear() lands before it resolves, instead of repopulating the cache", async () => {
		// Reproduces the TOCTOU the review flagged: a profile switch (clear())
		// racing an in-flight fetch from the old profile must not let that
		// fetch's result resurrect itself into the new, post-clear cache.
		const cache = new _DiscovrCache();
		let resolveFetch: (value: { owner: string }) => void;
		const slowFetcher = () =>
			new Promise<{ owner: string }>((resolve) => {
				resolveFetch = resolve;
			});

		const pending = cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, slowFetcher);
		cache.clear(); // profile switch lands while the fetch above is still in flight
		resolveFetch!({ owner: "profileA" });
		// The stale-generation fetch must reject, not resolve — otherwise any
		// follower deduped onto this same promise would get profileA's data.
		await expect(pending).rejects.toThrow(DiscovrCacheStaleGenerationError);

		const { fetcher: freshFetcher, calls } = countingFetcher({ owner: "profileB" });
		const result = await cache.wrap(
			"getPage",
			{ pageId: "abc" },
			undefined,
			undefined,
			freshFetcher,
		);

		expect(result).toEqual({ owner: "profileB" });
		expect(calls()).toBe(1); // not served from the stale profileA entry
	});

	it("doesn't let a pre-clear fetch's cleanup delete a post-clear caller's in-flight registration", async () => {
		// A finally-block that unconditionally deletes inFlight[key] would let an
		// old (pre-clear) fetch's cleanup remove a *new* caller's registration
		// for the same key, defeating dedup for anyone racing that new caller.
		const cache = new _DiscovrCache();
		let resolveOld: (value: { gen: string }) => void;
		const oldFetcher = () => new Promise<{ gen: string }>((resolve) => (resolveOld = resolve));

		const oldPending = cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, oldFetcher);
		cache.clear(); // wipes inFlight — oldFetcher's own closure keeps running regardless

		let resolveNew: (value: { gen: string }) => void;
		let newCalls = 0;
		const newFetcher = () =>
			new Promise<{ gen: string }>((resolve) => {
				newCalls++;
				resolveNew = resolve;
			});

		const newPending = cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, newFetcher);

		// Resolve the old (pre-clear) fetch first — its cleanup must not touch
		// the new caller's still-pending in-flight registration. It rejects
		// (stale generation) rather than resolving; only its cleanup behavior
		// matters here.
		resolveOld!({ gen: "old" });
		await expect(oldPending).rejects.toThrow(DiscovrCacheStaleGenerationError);

		// A third call while the new fetch is still pending should dedupe onto
		// it, not start a fourth fetch — only possible if the old fetch's
		// cleanup left the new registration alone.
		const thirdPending = cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, newFetcher);
		resolveNew!({ gen: "new" });

		const [newResult, thirdResult] = await Promise.all([newPending, thirdPending]);
		expect(newResult).toEqual({ gen: "new" });
		expect(thirdResult).toEqual({ gen: "new" });
		expect(newCalls).toBe(1); // deduped, not a fresh fourth fetch
	});

	it("doesn't hand a follower deduped onto an in-flight fetch stale data if clear() lands first", async () => {
		// The P0 the review flagged: a follower awaiting the *same* in-flight
		// promise as a leader must not get handed the leader's result once a
		// clear() has superseded it — even though the follower itself never
		// touched `entries` or `inFlight` directly.
		const cache = new _DiscovrCache();
		let resolveFetch: (value: { owner: string }) => void;
		const slowFetcher = () =>
			new Promise<{ owner: string }>((resolve) => {
				resolveFetch = resolve;
			});

		const leader = cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, slowFetcher);
		const follower = cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, slowFetcher);

		cache.clear(); // profile switch lands while both are still in flight
		resolveFetch!({ owner: "profileA" });

		await expect(leader).rejects.toThrow(DiscovrCacheStaleGenerationError);
		await expect(follower).rejects.toThrow(DiscovrCacheStaleGenerationError);

		const { fetcher: freshFetcher, calls } = countingFetcher({ owner: "profileB" });
		const result = await cache.wrap(
			"getPage",
			{ pageId: "abc" },
			undefined,
			undefined,
			freshFetcher,
		);
		expect(result).toEqual({ owner: "profileB" });
		expect(calls()).toBe(1); // not served from the stale profileA entry
	});

	it("rejects and frees the key for retry when a fetcher exceeds the configured timeout", async () => {
		const cache = new _DiscovrCache({ timeoutMs: 10 });
		const hungFetcher = () => new Promise<never>(() => {});

		await expect(
			cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, hungFetcher),
		).rejects.toThrow(/timed out/);

		const { fetcher, calls } = countingFetcher({ ok: true });
		const result = await cache.wrap("getPage", { pageId: "abc" }, undefined, undefined, fetcher);
		expect(result).toEqual({ ok: true });
		expect(calls()).toBe(1); // the timed-out key wasn't left permanently stuck
	});

	it("keys nested object params by value, not by property insertion order", async () => {
		const cache = new _DiscovrCache();
		const { fetcher, calls } = countingFetcher({ id: "page_1" });

		await cache.wrap(
			"createPage",
			{ pageFilters: { genres: [1], name: "x" } },
			undefined,
			undefined,
			fetcher,
		);
		await cache.wrap(
			"createPage",
			{ pageFilters: { name: "x", genres: [1] } },
			undefined,
			undefined,
			fetcher,
		);

		expect(calls()).toBe(1); // same filters, different key order — still one cache entry
	});

	it("throws a clear error instead of stack-overflowing on a circular param object", async () => {
		const cache = new _DiscovrCache();
		const circular: Record<string, unknown> = { name: "x" };
		circular.self = circular;

		await expect(
			cache.wrap("createPage", { pageFilters: circular }, undefined, undefined, async () => ({})),
		).rejects.toThrow(/circular reference/);
	});

	it("doesn't mistake the same object referenced twice (a DAG, not a cycle) for circular", async () => {
		const cache = new _DiscovrCache();
		const shared = { genres: [1, 2] };
		const { fetcher, calls } = countingFetcher({ ok: true });

		await cache.wrap("createPage", { a: shared, b: shared }, undefined, undefined, fetcher);

		expect(calls()).toBe(1);
	});

	it("evicts the oldest entry once the bound is exceeded (FIFO)", async () => {
		const cache = new _DiscovrCache();
		const MAX_ENTRIES = 200;

		for (let i = 0; i < MAX_ENTRIES; i++) {
			await cache.wrap("getMedia", { mediaId: `MV_${i}` }, undefined, undefined, async () => ({
				i,
			}));
		}

		// Cache is full at the bound; the oldest entry (MV_0) is still present.
		const oldest = countingFetcher({ evicted: false });
		await cache.wrap("getMedia", { mediaId: "MV_0" }, undefined, undefined, oldest.fetcher);
		expect(oldest.calls()).toBe(0); // still cached, no fetch needed

		// One more insert pushes past the bound and evicts MV_0 (the oldest).
		await cache.wrap("getMedia", { mediaId: "MV_200" }, undefined, undefined, async () => ({
			i: 200,
		}));

		const afterEviction = countingFetcher({ evicted: true });
		await cache.wrap("getMedia", { mediaId: "MV_0" }, undefined, undefined, afterEviction.fetcher);
		expect(afterEviction.calls()).toBe(1); // no longer cached, had to refetch
	});

	describe("transparent retry on mid-flight snapshot turnover (A5)", () => {
		it("retries once transparently when clear() lands mid-flight on the same profile", async () => {
			let calls = 0;
			let resolveFirst: (value: { snap: string }) => void;
			const cache = new _DiscovrCache({ retryScope: () => "profileA" });

			const fetcher = () => {
				calls++;
				if (calls === 1) {
					return new Promise<{ snap: string }>((resolve) => {
						resolveFirst = resolve;
					});
				}
				return Promise.resolve({ snap: "snap2" });
			};

			const pending = cache.wrap("getPage", { pageId: "home" }, undefined, undefined, fetcher);
			cache.clearForSnapshot("snap2", true); // same-profile snapshot turnover while fetch is in flight
			resolveFirst!({ snap: "snap1" });

			const result = await pending;
			expect(result).toEqual({ snap: "snap2" });
			expect(calls).toBe(2);

			// Subsequent call hits the fresh snap2 entry (snap1 was never cached).
			const cached = await cache.wrap("getPage", { pageId: "home" }, undefined, undefined, fetcher);
			expect(cached).toEqual({ snap: "snap2" });
			expect(calls).toBe(2);
		});

		it("dedupes leader and follower onto a single retry fetch after mid-flight clear()", async () => {
			let calls = 0;
			let resolveFirst: (value: { snap: string }) => void;
			let resolveSecond: (value: { snap: string }) => void;
			const cache = new _DiscovrCache({ retryScope: () => "profileA" });

			const fetcher = () => {
				calls++;
				if (calls === 1) {
					return new Promise<{ snap: string }>((resolve) => {
						resolveFirst = resolve;
					});
				}
				return new Promise<{ snap: string }>((resolve) => {
					resolveSecond = resolve;
				});
			};

			const leader = cache.wrap("getPage", { pageId: "home" }, undefined, undefined, fetcher);
			const follower = cache.wrap("getPage", { pageId: "home" }, undefined, undefined, fetcher);

			cache.clear();
			resolveFirst!({ snap: "stale" });
			// Allow async retry to enter the second fetch before resolving it
			await new Promise((resolve) => setImmediate(resolve));
			resolveSecond!({ snap: "fresh" });

			const [r1, r2] = await Promise.all([leader, follower]);
			expect(r1).toEqual({ snap: "fresh" });
			expect(r2).toEqual({ snap: "fresh" });
			expect(calls).toBe(2); // 1 stale + 1 deduped retry
		});

		it("does not retry across a profile switch, even if a snapshot turnover follows", async () => {
			let activeProfile: string | null = "profileA";
			let calls = 0;
			let resolveFirst: (value: { profile: string }) => void;
			const cache = new _DiscovrCache({ retryScope: () => activeProfile });

			const pending = cache.wrap("getPage", { pageId: "home" }, undefined, undefined, () => {
				calls++;
				if (calls === 1) {
					return new Promise<{ profile: string }>((resolve) => {
						resolveFirst = resolve;
					});
				}
				return Promise.resolve({ profile: "profileB" });
			});

			// Switch to Profile B (non-retryable clear), then a later retryable
			// snapshot turnover lands before Profile A's slow fetch finishes.
			activeProfile = "profileB";
			cache.clearAndMarkSnapshot("snapB1", false);
			cache.clearForSnapshot("snapB2", true);
			resolveFirst!({ profile: "profileA" });

			await expect(pending).rejects.toThrow(DiscovrCacheStaleGenerationError);
			expect(calls).toBe(1);
		});

		it("does not retry when clear(false) signals sign-out or explicit profile re-select", async () => {
			let calls = 0;
			let resolveFirst: (value: { snap: string }) => void;
			const cache = new _DiscovrCache({ retryScope: () => "profileA" });

			const pending = cache.wrap("getPage", { pageId: "home" }, undefined, undefined, () => {
				calls++;
				return new Promise<{ snap: string }>((resolve) => {
					resolveFirst = resolve;
				});
			});
			cache.clear(false);
			// Even if a retryable clear follows before the slow fetch returns,
			// monotonic nonRetryableGeneration keeps retry disabled.
			cache.clear(true);
			resolveFirst!({ snap: "stale" });

			await expect(pending).rejects.toThrow(DiscovrCacheStaleGenerationError);
			expect(calls).toBe(1);
		});

		it("does not retry when retryScope becomes null (signed out)", async () => {
			let scope: string | null = "profileA";
			let calls = 0;
			let resolveFirst: (value: { snap: string }) => void;
			const cache = new _DiscovrCache({ retryScope: () => scope });

			const pending = cache.wrap("getPage", { pageId: "home" }, undefined, undefined, () => {
				calls++;
				return new Promise<{ snap: string }>((resolve) => {
					resolveFirst = resolve;
				});
			});
			scope = null;
			cache.clear();
			resolveFirst!({ snap: "stale" });

			await expect(pending).rejects.toThrow(DiscovrCacheStaleGenerationError);
			expect(calls).toBe(1);
		});

		it("throws on a second consecutive generation bump instead of retrying forever", async () => {
			let calls = 0;
			const resolvers: Array<(value: { n: number }) => void> = [];
			const cache = new _DiscovrCache({ retryScope: () => "profileA" });

			const pending = cache.wrap("getPage", { pageId: "home" }, undefined, undefined, () => {
				calls++;
				return new Promise<{ n: number }>((resolve) => {
					resolvers.push(resolve);
				});
			});

			cache.clear();
			resolvers[0]({ n: 1 });
			await new Promise((resolve) => setImmediate(resolve));

			cache.clear();
			resolvers[1]({ n: 2 });

			await expect(pending).rejects.toThrow(DiscovrCacheStaleGenerationError);
			expect(calls).toBe(2);
		});

		it("clearForSnapshot skips duplicate clear for an already-marked snapshot", async () => {
			const cache = new _DiscovrCache();
			let calls = 0;
			const fetcher = async () => `v${++calls}`;

			cache.clearAndMarkSnapshot("snap1", false);
			expect(await cache.wrap("getPage", { pageId: "home" }, undefined, undefined, fetcher)).toBe(
				"v1",
			);

			// Redundant clear for snap1 is a no-op; cached entry survives.
			cache.clearForSnapshot("snap1", false);
			expect(await cache.wrap("getPage", { pageId: "home" }, undefined, undefined, fetcher)).toBe(
				"v1",
			);
			expect(calls).toBe(1);

			// Moving to snap2 clears the cache.
			cache.clearForSnapshot("snap2", true);
			expect(await cache.wrap("getPage", { pageId: "home" }, undefined, undefined, fetcher)).toBe(
				"v2",
			);
			expect(calls).toBe(2);
		});
	});
});
