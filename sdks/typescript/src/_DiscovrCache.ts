/**
 * `_DiscovrCache` — in-memory, session-level response cache for the generated
 * SDK base.
 *
 * Which operations flow through {@link wrap} (and with what TTL) is decided
 * entirely by the OpenAPI spec's `x-cache-policy`/`x-cache-invalidates`
 * extensions, parsed by `public/scripts/facade/parse-openapi.ts` and baked into
 * the generated `_DiscovrClientBase` at build time.
 *
 * One instance per `DiscovrClient`; never shared or persisted across clients,
 * tabs, or devices. It only sees calls made through *this* client instance, so
 * it can't detect a write made by another device or SDK instance sharing the
 * same profile — the same limitation the auth layer already has for local
 * session state.
 *
 * Do not import this class directly — it's wired up automatically by
 * [`DiscovrClient`](./DiscovrClient.ts).
 */

const MAX_ENTRIES = 200;

/** Fetches that hang longer than this are treated as failed, freeing the key for retry. */
const DEFAULT_FETCH_TIMEOUT_MS = 30_000;

/**
 * Thrown when a {@link _DiscovrCache.clear} (profile switch, sign-out, session
 * refresh) lands while this call's fetch was in flight — its result belongs
 * to a superseded generation and may be the wrong profile's data. Callers
 * that still need the data should retry, which will run under the new
 * generation and hit whatever cache state is current now.
 */
export class DiscovrCacheStaleGenerationError extends Error {
	constructor(message = "_DiscovrCache: cache cleared while fetch was in flight") {
		super(message);
		this.name = "DiscovrCacheStaleGenerationError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

interface CacheEntry {
	value: unknown;
	/** `null` = no TTL — live until explicitly invalidated or the cache is cleared. */
	expiresAt: number | null;
}

export interface DiscovrCacheConfig {
	/** Master on/off switch. Defaults to enabled. */
	enabled?: boolean;
	/** Max time to wait on a fetcher before treating it as failed. Defaults to 30s. */
	timeoutMs?: number;
}

export class _DiscovrCache {
	private readonly enabled: boolean;
	private readonly timeoutMs: number;
	private readonly entries = new Map<string, CacheEntry>();
	private readonly inFlight = new Map<string, { promise: Promise<unknown>; token: number }>();
	/**
	 * Tags each in-flight registration so its own cleanup can tell whether
	 * it's still the current occupant of `inFlight.get(key)` before removing
	 * it — see the identity check in {@link wrap}'s cleanup path.
	 */
	private inFlightToken = 0;
	/**
	 * Bumped on every {@link clear}. A fetch started before a clear() (profile
	 * switch, sign-out, session refresh) must not write its result into the
	 * cache after the clear lands — that would resurrect stale, wrong-session
	 * data. Each in-flight fetch captures the generation it started under and
	 * only commits to `entries` if the generation hasn't moved on.
	 */
	private generation = 0;

	constructor(config: DiscovrCacheConfig = {}) {
		this.enabled = config.enabled ?? true;
		this.timeoutMs = config.timeoutMs ?? DEFAULT_FETCH_TIMEOUT_MS;
	}

	/**
	 * Cache-or-fetch a single operation call, deduping concurrent identical
	 * in-flight requests along the way (so a tight accidental loop over the
	 * same params costs one network call, not N).
	 *
	 * @param ttlMs `undefined` means cache for the life of the session (until
	 *   invalidated or {@link clear}ed); a number caches for that many ms.
	 * @param bypass Skip the cache read (and any in-flight dedup) for this
	 *   call, but still refresh the stored entry with the result — a "force
	 *   refresh" that also warms the cache for the next normal call.
	 */
	async wrap<T>(
		operationId: string,
		keyParams: Record<string, unknown>,
		ttlMs: number | undefined,
		bypass: boolean | undefined,
		fetcher: () => Promise<T>,
	): Promise<T> {
		if (!this.enabled) return fetcher();

		const key = buildKey(operationId, keyParams);
		const now = Date.now();

		if (!bypass) {
			const cached = this.entries.get(key);
			if (cached && (cached.expiresAt === null || cached.expiresAt > now)) {
				return cached.value as T;
			}
			const pending = this.inFlight.get(key);
			if (pending) return pending.promise as Promise<T>;
		}

		const generation = this.generation;
		const token = ++this.inFlightToken;
		const promise = (async () => {
			try {
				const value = await this.withTimeout(fetcher);
				// If a clear() (profile switch, sign-out, session refresh) landed
				// while this fetch was in flight, this result belongs to a
				// superseded generation — possibly the wrong profile's data.
				// Reject rather than resolve so any follower deduped onto this
				// same promise doesn't get handed stale data; it'll fall through
				// to a fresh fetch under the new generation on its next call.
				if (this.generation !== generation) {
					throw new DiscovrCacheStaleGenerationError();
				}
				this.entries.set(key, { value, expiresAt: ttlMs !== undefined ? now + ttlMs : null });
				this.evictIfNeeded();
				return value;
			} finally {
				// Only remove if `inFlight.get(key)` is still *this* registration —
				// a clear() may have wiped the map and a new caller may have
				// already registered its own entry under the same key in the
				// meantime. Deleting unconditionally would drop that entry.
				if (this.inFlight.get(key)?.token === token) this.inFlight.delete(key);
			}
		})();

		if (!bypass) this.inFlight.set(key, { promise, token });
		return promise;
	}

	/** Purge every cached entry for the given operationIds (all param variants). */
	invalidate(operationIds: readonly string[]): void {
		if (operationIds.length === 0) return;
		const prefixes = operationIds.map((id) => `${id}::`);
		for (const key of this.entries.keys()) {
			if (prefixes.some((p) => key.startsWith(p))) this.entries.delete(key);
		}
	}

	/** Full wipe — called on profile switch, sign-out, and session rotation. */
	clear(): void {
		this.generation++;
		this.entries.clear();
		this.inFlight.clear();
	}

	private async withTimeout<T>(fetcher: () => Promise<T>): Promise<T> {
		if (!this.timeoutMs || this.timeoutMs <= 0) return fetcher();
		let timer: ReturnType<typeof setTimeout>;
		const timeout = new Promise<never>((_, reject) => {
			timer = setTimeout(
				() => reject(new Error(`_DiscovrCache: fetch timed out after ${this.timeoutMs}ms`)),
				this.timeoutMs,
			);
		});
		try {
			return await Promise.race([fetcher(), timeout]);
		} finally {
			clearTimeout(timer!);
		}
	}

	private evictIfNeeded(): void {
		while (this.entries.size > MAX_ENTRIES) {
			const oldestKey = this.entries.keys().next().value;
			if (oldestKey === undefined) break;
			this.entries.delete(oldestKey);
		}
	}
}

function buildKey(operationId: string, keyParams: Record<string, unknown>): string {
	return `${operationId}::${stableStringify(keyParams)}`;
}

/**
 * Deterministic serialization for use as a cache key — recursively sorts
 * object keys so two semantically-identical params (e.g. a `FilterSpec` built
 * with fields in a different order) produce the same key.
 *
 * `seen` tracks objects on the *current recursion path* (not every object
 * visited overall), so a value referenced twice in a non-circular DAG is
 * fine — only an object that contains itself transitively throws.
 */
function stableStringify(value: unknown, seen: Set<object> = new Set()): string {
	if (value === null || typeof value !== "object") return JSON.stringify(value);
	if (seen.has(value)) {
		throw new Error("_DiscovrCache: circular reference in cache key params");
	}
	seen.add(value);
	try {
		if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v, seen)).join(",")}]`;
		const obj = value as Record<string, unknown>;
		const keys = Object.keys(obj).sort();
		return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k], seen)}`).join(",")}}`;
	} finally {
		seen.delete(value);
	}
}
