import { DiscovrClient } from "../DiscovrClient";
import { NotSignedInError, RateLimitedError } from "../errors";
import type { MediaItem, PlaybackItem, ScrobbleResponse } from "../models/index";
import { PlaybackTracker } from "../PlaybackTracker";
import { ResponseError } from "../runtime";

function okResponse(progress: number, completed = progress >= 80): ScrobbleResponse {
	return { status: "ok", progress, completed };
}

describe("PlaybackTracker", () => {
	it("throttles update() heartbeats to 30s and resets timer on seek()", async () => {
		let clock = 1_000;
		const sent: Array<{ id: string; progress: number; tv?: { season: number; episode: number } }> =
			[];

		const tracker = new PlaybackTracker(
			"MV_550@ctx",
			{},
			{
				send: async (id, progress, tv) => {
					sent.push({ id, progress, tv });
					return okResponse(progress);
				},
				now: () => clock,
				sleep: async () => {},
			},
		);

		tracker.start(0);
		clock += 10_000;
		tracker.update(5); // throttled
		clock += 19_999;
		tracker.update(10); // 29.999s -> still throttled
		clock += 1;
		tracker.update(12); // 30s -> sent!

		clock += 15_000;
		tracker.seek(50); // immediate + resets heartbeat timer!
		clock += 20_000;
		tracker.update(55); // only 20s since seek -> throttled
		clock += 10_000;
		tracker.update(60); // 30s since seek -> sent!

		await tracker.flush();
		expect(sent.map((s) => s.progress)).toEqual([0, 12, 50, 60]);
		expect(sent.every((s) => s.id === "MV_550@ctx")).toBe(true);
	});

	it("clamps percentages to 0..100 and ignores NaN / Infinity", async () => {
		let clock = 0;
		const sent: number[] = [];

		const tracker = new PlaybackTracker(
			"MV_550",
			{},
			{
				send: async (_id, progress) => {
					sent.push(progress);
					return okResponse(progress);
				},
				now: () => clock,
			},
		);

		tracker.start(Number.NaN);
		tracker.start(Number.POSITIVE_INFINITY);
		tracker.start(Number.NEGATIVE_INFINITY);
		tracker.start(-15); // clamped to 0
		clock += 30_000;
		tracker.update(Number.NaN);
		tracker.update(125); // clamped to 100

		await tracker.flush();
		expect(sent).toEqual([0, 100]);
	});

	it("supports per-call { position, duration } without caching duration and ignores duration <= 0", async () => {
		let clock = 0;
		const sent: number[] = [];

		const tracker = new PlaybackTracker(
			"MV_550",
			{},
			{
				send: async (_id, progress) => {
					sent.push(progress);
					return okResponse(progress);
				},
				now: () => clock,
			},
		);

		// Unknown / zero / negative / non-finite durations are safely ignored
		tracker.start({ position: 0, duration: 0 });
		tracker.start({ position: 10, duration: -100 });
		tracker.start({ position: 10, duration: Number.NaN });
		tracker.start({ position: Number.POSITIVE_INFINITY, duration: 100 });

		// Stream A: 1000s total -> 250s = 25%
		tracker.start({ position: 250, duration: 1000 });
		// Switch to Stream B (shorter cut: 500s total) -> 250s = 50% (never uses old 1000s!)
		clock += 30_000;
		tracker.update({ position: 250, duration: 500 });

		// Teardown with duration == 0 must NOT send 0%
		const stopRes = await tracker.stop({ position: 0, duration: 0 });
		expect(stopRes).toBeNull();
		expect(sent).toEqual([25, 50]);
	});

	it("deduplicates pause() and resume() and suppresses updates while paused", async () => {
		let clock = 0;
		const sent: number[] = [];

		const tracker = new PlaybackTracker(
			"MV_550",
			{},
			{
				send: async (_id, progress) => {
					sent.push(progress);
					return okResponse(progress);
				},
				now: () => clock,
			},
		);

		tracker.start(10);
		tracker.resume(10); // redundant resume while playing -> ignored
		tracker.pause(20);
		tracker.pause(20); // duplicate pause -> ignored
		clock += 60_000;
		tracker.update(21); // update while paused -> ignored
		tracker.resume(20); // genuine resume -> sent
		tracker.resume(22); // redundant resume after buffering stall -> ignored

		await tracker.flush();
		expect(sent).toEqual([10, 20, 20]);
	});

	it("preserves strict serial FIFO ordering and coalesces queued heartbeats", async () => {
		let clock = 0;
		let inFlight = 0;
		let maxConcurrent = 0;
		const sent: number[] = [];
		const resolvers: Array<() => void> = [];

		const tracker = new PlaybackTracker(
			"MV_550",
			{},
			{
				send: async (_id, progress) => {
					inFlight++;
					maxConcurrent = Math.max(maxConcurrent, inFlight);
					sent.push(progress);
					await new Promise<void>((resolve) => resolvers.push(resolve));
					inFlight--;
					return okResponse(progress);
				},
				now: () => clock,
			},
		);

		tracker.start(0); // immediately in-flight (resolvers[0])
		clock += 30_000;
		tracker.update(10); // queued heartbeat
		clock += 30_000;
		tracker.update(20); // coalesces with queued heartbeat (10 -> 20)
		clock += 30_000;
		tracker.update(30); // coalesces again (20 -> 30)
		tracker.pause(35); // transition is never dropped!

		// Release sends one by one
		while (resolvers.length > 0 || sent.length < 3) {
			const next = resolvers.shift();
			if (next) next();
			await Promise.resolve();
			await Promise.resolve();
		}
		await tracker.flush();

		expect(maxConcurrent).toBe(1);
		expect(sent).toEqual([0, 30, 35]);
	});

	it("chains episode handoff via after: so Ep 1 finish() lands before Ep 2 start()", async () => {
		const order: string[] = [];
		let resolveEp1Finish: () => void;

		const ep1 = new PlaybackTracker(
			"TV_1396@row1",
			{ tv: { season: 1, episode: 1 } },
			{
				send: async (_id, progress, tv) => {
					order.push(`start:S${tv?.season}E${tv?.episode}@${progress}`);
					if (progress === 100) {
						await new Promise<void>((r) => (resolveEp1Finish = r));
					}
					order.push(`done:S${tv?.season}E${tv?.episode}@${progress}`);
					return okResponse(progress);
				},
			},
		);

		const finishPromise = ep1.finish();
		const ep2 = new PlaybackTracker(
			"TV_1396@row1",
			{ tv: { season: 1, episode: 2 }, after: ep1 },
			{
				send: async (_id, progress, tv) => {
					order.push(`start:S${tv?.season}E${tv?.episode}@${progress}`);
					order.push(`done:S${tv?.season}E${tv?.episode}@${progress}`);
					return okResponse(progress);
				},
			},
		);

		ep2.start(0);
		await Promise.resolve();
		await Promise.resolve();
		// Ep 2 must NOT have started yet while Ep 1 finish is still in flight
		expect(order).toEqual(["start:S1E1@100"]);

		resolveEp1Finish!();
		await finishPromise;
		await ep2.flush();

		expect(order).toEqual(["start:S1E1@100", "done:S1E1@100", "start:S1E2@0", "done:S1E2@0"]);
	});

	it("guards stop() and finish() as once-only and ignores subsequent events (prevents A7)", async () => {
		const sent: number[] = [];
		const tracker = new PlaybackTracker(
			"MV_550",
			{},
			{
				send: async (_id, progress) => {
					sent.push(progress);
					return okResponse(progress);
				},
			},
		);

		tracker.start(40);
		const first = await tracker.finish();
		// Duplicate teardown reporting 0% must be a complete no-op returning first result
		const second = await tracker.stop(0);
		const third = await tracker.finish();
		tracker.update(0);
		tracker.pause(0);
		tracker.seek(0);

		expect(first?.progress).toBe(100);
		expect(second).toEqual(first);
		expect(third).toEqual(first);
		expect(sent).toEqual([40, 100]);
	});

	it("backs off heartbeats on 429 and retries terminal stop()/finish() with capped wait", async () => {
		let clock = 0;
		const sleeps: number[] = [];
		const errors: unknown[] = [];
		let attempt = 0;
		const sent: number[] = [];

		const tracker = new PlaybackTracker(
			"MV_550",
			{ onError: (e) => errors.push(e) },
			{
				send: async (_id, progress) => {
					sent.push(progress);
					attempt++;
					if (attempt === 1) {
						// First heartbeat hits 429 with 45s retry
						throw new RateLimitedError("slow down", 45);
					}
					if (attempt === 2) {
						// Terminal finish hits 429 with 120s (capped to 60s)
						throw new RateLimitedError("slow down", 120);
					}
					return okResponse(progress, true);
				},
				now: () => clock,
				sleep: async (ms) => {
					sleeps.push(ms);
					clock += ms;
				},
			},
		);

		tracker.update(20); // attempt 1 -> 429 (45s backoff)
		await tracker.flush();
		expect(errors).toHaveLength(1);

		clock += 30_000;
		tracker.update(25); // still inside 45s backoff -> suppressed!
		await tracker.flush();
		expect(sent).toEqual([20]);

		const res = await tracker.finish(); // attempt 2 -> 429, waits 60s (capped), attempt 3 -> succeeds!
		expect(res).toEqual(okResponse(100, true));
		expect(sleeps).toEqual([60_000]);
		expect(sent).toEqual([20, 100, 100]);
	});

	it("retries transient 5xx on terminal stop() but never retries permanent 4xx errors", async () => {
		const sleeps: number[] = [];
		let calls = 0;
		const tracker = new PlaybackTracker(
			"MV_550",
			{},
			{
				send: async (_id, progress) => {
					calls++;
					if (calls === 1) {
						throw new ResponseError(new Response("boom", { status: 503 }), "Service Unavailable");
					}
					return okResponse(progress);
				},
				sleep: async (ms) => {
					sleeps.push(ms);
				},
			},
		);

		const res = await tracker.stop(72);
		expect(res?.progress).toBe(72);
		expect(calls).toBe(2);
		expect(sleeps).toEqual([1_000]);

		// Permanent auth error is not retried
		const permErrors: unknown[] = [];
		let permCalls = 0;
		const tracker2 = new PlaybackTracker(
			"MV_550",
			{ onError: (e) => permErrors.push(e) },
			{
				send: async () => {
					permCalls++;
					throw new NotSignedInError();
				},
				sleep: async () => {
					throw new Error("should not sleep on 4xx");
				},
			},
		);

		const res2 = await tracker2.finish();
		expect(res2).toBeNull();
		expect(permCalls).toBe(1);
		expect(permErrors).toHaveLength(1);
		expect(permErrors[0]).toBeInstanceOf(NotSignedInError);
	});

	it("fires onCompleted at most once when response.completed is true", async () => {
		let clock = 0;
		const completions: ScrobbleResponse[] = [];

		const tracker = new PlaybackTracker(
			"MV_550",
			{ onCompleted: (r) => completions.push(r) },
			{
				send: async (_id, progress) => okResponse(progress, progress >= 80),
				now: () => clock,
			},
		);

		tracker.start(75);
		clock += 30_000;
		tracker.update(82); // crosses 80% -> fires onCompleted
		await tracker.flush();
		clock += 30_000;
		tracker.update(90); // already notified -> does not fire again
		await tracker.finish();

		expect(completions).toHaveLength(1);
		expect(completions[0].progress).toBe(82);
	});

	it("resolves concurrent terminal callers to the first terminal response with a single send", async () => {
		let resolveSend: (r: ScrobbleResponse) => void;
		const sent: number[] = [];

		const tracker = new PlaybackTracker(
			"MV_550",
			{},
			{
				send: (_id, progress) => {
					sent.push(progress);
					return new Promise<ScrobbleResponse>((resolve) => {
						resolveSend = resolve;
					});
				},
			},
		);

		const firstCall = tracker.stop(80);
		const secondCall = tracker.finish();
		await new Promise((resolve) => setImmediate(resolve));

		const expected = okResponse(80, true);
		resolveSend!(expected);

		const [r1, r2] = await Promise.all([firstCall, secondCall]);
		expect(r1).toEqual(expected);
		expect(r2).toEqual(expected);
		expect(sent).toEqual([80]);
	});

	it("client.trackPlayback extracts refOrId and defaults tv only from PlaybackItem", async () => {
		const client = new DiscovrClient("test-client", { cache: false });
		const calls: Array<{
			mediaId: string;
			progress: number;
			tv?: { season: number; episode: number };
		}> = [];
		jest
			.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(client)), "scrobble")
			.mockImplementation(
				async (
					mediaId: string,
					progress: number,
					options?: { tv?: { season: number; episode: number } },
				) => {
					calls.push({ mediaId, progress, tv: options?.tv });
					return okResponse(progress);
				},
			);

		const mediaItem = {
			id: "MV_550",
			ref: "MV_550@hero",
			title: "Fight Club",
			overview: "",
			mediaType: "movie",
			type: "media",
		} as unknown as MediaItem;

		const movieTracker = client.trackPlayback(mediaItem);
		await movieTracker.stop(42);

		const playbackItem: PlaybackItem = {
			id: "TV_1396",
			ref: "TV_1396@cw",
			mediaType: "tv",
			title: "Breaking Bad",
			posterPath: {},
			backdropPath: {},
			season: 2,
			episode: 5,
			createdAt: new Date(0),
		};

		const tvTracker = client.trackPlayback(playbackItem);
		await tvTracker.stop(65);

		// Explicit tv overrides PlaybackItem's season/episode
		const overrideTracker = client.trackPlayback(playbackItem, { tv: { season: 2, episode: 6 } });
		await overrideTracker.finish();

		// TitleListItem from watch history carries `watchlist` + last-watched season/episode,
		// so it must NOT auto-populate `tv` (parity with Kotlin and Swift).
		const historyTitleItem = {
			id: "TV_1396",
			ref: "TV_1396@history",
			mediaType: "tv",
			title: "Breaking Bad",
			posterPath: {},
			backdropPath: {},
			watchlist: false,
			updatedAt: new Date(0),
			season: 2,
			episode: 5,
		};
		const historyTracker = client.trackPlayback(historyTitleItem);
		await historyTracker.stop(15);

		client.close();

		expect(calls).toEqual([
			{ mediaId: "MV_550@hero", progress: 42, tv: undefined },
			{ mediaId: "TV_1396@cw", progress: 65, tv: { season: 2, episode: 5 } },
			{ mediaId: "TV_1396@cw", progress: 100, tv: { season: 2, episode: 6 } },
			{ mediaId: "TV_1396@history", progress: 15, tv: undefined },
		]);
	});
});
