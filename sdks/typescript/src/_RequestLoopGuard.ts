/**
 * `_RequestLoopGuard` — client-side circuit breaker for runaway request loops.
 *
 * ## What this is for
 *
 * The overwhelmingly common cause of a client hammering an API is not abuse,
 * it's a bug: an effect with a missing dependency, a retry without backoff, a
 * render loop that refetches. Without a guard the developer discovers this as a
 * wall of `429`s — long after thousands of requests have already been sent, and
 * with nothing pointing at the line of code responsible.
 *
 * This guard turns that into an immediate, obvious failure at the call site.
 *
 * ## It fails CLOSED, deliberately
 *
 * When the threshold trips, the request is **not sent** — the guard throws
 * before dispatch and keeps refusing for a cooldown. It does not warn and
 * proceed. A guard that logged but still made the call would leave the actual
 * problem (traffic hitting the server) completely unsolved.
 *
 * ## What this is NOT
 *
 * Not a security control, and not a substitute for server-side rate limiting.
 * It lives in the caller's own process and any client can simply not use the
 * SDK. Server-side limits remain the real boundary; this is a developer-
 * experience safety net on top of them.
 */

import { RequestLoopError } from "./errors";

export interface LoopGuardConfig {
	/**
	 * Requests allowed within {@link windowMs} before the breaker trips.
	 * Default 100 — far above any sane UI burst (a screen might fire a dozen
	 * calls on mount), far below what a runaway loop reaches in a second.
	 */
	maxRequests?: number;
	/** Sliding window width in ms. Default 10 000. */
	windowMs?: number;
	/**
	 * How long the breaker stays open once tripped, in ms. Default 30 000.
	 * A cooldown rather than a permanent stop, so a genuine burst doesn't
	 * disable the client for the rest of its life.
	 */
	cooldownMs?: number;
	/**
	 * Set `false` to disable entirely. For legitimately high-throughput
	 * integrations (bulk backfills, server-side batch jobs) where the default
	 * threshold would be a false positive.
	 */
	enabled?: boolean;
}

const DEFAULT_MAX_REQUESTS = 100;
const DEFAULT_WINDOW_MS = 10_000;
const DEFAULT_COOLDOWN_MS = 30_000;

export class _RequestLoopGuard {
	private readonly maxRequests: number;
	private readonly windowMs: number;
	private readonly cooldownMs: number;
	private readonly enabled: boolean;

	/** Timestamps of recent requests, oldest first. */
	private timestamps: number[] = [];
	/** When the breaker closes again, or null while it is closed. */
	private openUntil: number | null = null;

	constructor(config: LoopGuardConfig = {}) {
		this.maxRequests = config.maxRequests ?? DEFAULT_MAX_REQUESTS;
		this.windowMs = config.windowMs ?? DEFAULT_WINDOW_MS;
		this.cooldownMs = config.cooldownMs ?? DEFAULT_COOLDOWN_MS;
		this.enabled = config.enabled ?? true;
	}

	/**
	 * Record an outbound request and throw if it looks like a loop.
	 *
	 * Call **before** dispatching. `description` is echoed in the error so the
	 * developer sees which call was being repeated.
	 */
	public check(description: string): void {
		if (!this.enabled) return;

		const now = Date.now();

		if (this.openUntil !== null) {
			if (now < this.openUntil) {
				throw this.buildError(description, Math.ceil((this.openUntil - now) / 1000));
			}
			// Cooldown elapsed — close the breaker and start counting fresh, so
			// the caller gets a clean window rather than instantly re-tripping on
			// stale timestamps.
			this.openUntil = null;
			this.timestamps = [];
		}

		const cutoff = now - this.windowMs;
		// Timestamps are appended in order, so dropping the expired prefix is
		// enough — no need to scan the whole array.
		let firstLive = 0;
		while (firstLive < this.timestamps.length && this.timestamps[firstLive] <= cutoff) {
			firstLive += 1;
		}
		if (firstLive > 0) this.timestamps = this.timestamps.slice(firstLive);

		this.timestamps.push(now);

		if (this.timestamps.length > this.maxRequests) {
			this.openUntil = now + this.cooldownMs;
			throw this.buildError(description, Math.ceil(this.cooldownMs / 1000));
		}
	}

	/** Clear all state. Intended for tests and for an explicit caller reset. */
	public reset(): void {
		this.timestamps = [];
		this.openUntil = null;
	}

	private buildError(description: string, retryInSeconds: number): RequestLoopError {
		return new RequestLoopError(
			`Blocked "${description}": more than ${this.maxRequests} requests in ${
				this.windowMs / 1000
			}s. This almost always means an unintentional request loop — check for an effect ` +
				`with a missing dependency, or a retry without backoff. The request was NOT sent. ` +
				`Requests resume in ~${retryInSeconds}s. If this is legitimate high-volume traffic, ` +
				`raise or disable the limit via the "loopGuard" client option.`,
			retryInSeconds,
		);
	}
}
