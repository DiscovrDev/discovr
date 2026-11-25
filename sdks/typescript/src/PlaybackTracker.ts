/**
 * `PlaybackTracker` — percentage-first, source-independent playback scrobbler.
 *
 * Create one per watched movie or episode via `client.trackPlayback(item)`.
 * Report player lifecycle events (`start`, `update`, `pause`, `resume`, `seek`,
 * `stop` / `finish`); the tracker owns the 30-second heartbeat throttle, strict
 * serial FIFO ordering, episode handoff (`after`), once-only terminal teardown
 * protection, pause/resume deduplication, and graceful 429 / transient retry.
 *
 * Percentage (`0–100`) is the primary unit everywhere and the tracker never
 * caches a fixed `duration` across calls (different media sources can have
 * different runtimes, and streams may switch mid-watch). Callers holding a
 * `(position, duration)` pair for the *current* stream may pass
 * `{ position, duration }` on any method; calls with `duration <= 0` or
 * non-finite values are safely ignored instead of overwriting resume position
 * with `0%`.
 */

import { DiscovrError, RateLimitedError } from "./errors";
import type { EpisodeRef, ScrobbleResponse } from "./models/index";
import { FetchError, ResponseError } from "./runtime";

/** Current stream time and total duration in the same unit (e.g. seconds or ms). */
export interface PlaybackTime {
	readonly position: number;
	readonly duration: number;
}

/**
 * Either a direct relative percentage (`0–100`) or a per-call `{ position, duration }`
 * pair from the current stream. Using distinct shapes prevents mixing seconds
 * and percentage at compile time.
 */
export type PlaybackProgressInput = number | PlaybackTime;

export interface TrackPlaybackOptions {
	/**
	 * Episode coordinates for TV shows. Automatically populated when passing a
	 * `PlaybackItem` with `season` and `episode` unless explicitly overridden.
	 */
	tv?: EpisodeRef;
	/**
	 * Previous episode's tracker so its final `stop()`/`finish()` lands before
	 * this tracker's `start()` is sent.
	 */
	after?: PlaybackTracker;
	/** Called when a scrobble fails (after retries/backoff) instead of throwing into the player loop. */
	onError?: (error: unknown) => void;
	/** Called once when a scrobble response first reports `completed === true`. */
	onCompleted?: (response: ScrobbleResponse) => void;
	/** Heartbeat throttle interval in milliseconds. Defaults to 30,000 ms (30s). */
	heartbeatIntervalMs?: number;
}

/** @internal Injectable dependencies for deterministic unit tests. */
export interface _PlaybackTrackerDeps {
	send: (mediaRefOrId: string, progress: number, tv?: EpisodeRef) => Promise<ScrobbleResponse>;
	now?: () => number;
	sleep?: (ms: number) => Promise<void>;
}

type EventKind = "heartbeat" | "transition" | "terminal";

interface QueuedEvent {
	kind: EventKind;
	progress: number;
	resolveTerminal?: (response: ScrobbleResponse | null) => void;
}

const DEFAULT_HEARTBEAT_INTERVAL_MS = 30_000;
const MAX_TERMINAL_RETRIES = 2;
const MAX_TERMINAL_RETRY_WAIT_SECONDS = 60;
const MAX_BACKOFF_SECONDS = 300;
const TRANSIENT_BASE_DELAY_MS = 1_000;

function sanitizeProgress(input: PlaybackProgressInput): number | null {
	let raw: number;
	if (typeof input === "number") {
		raw = input;
	} else {
		if (
			!Number.isFinite(input.position) ||
			!Number.isFinite(input.duration) ||
			input.duration <= 0
		) {
			return null;
		}
		raw = (input.position / input.duration) * 100;
	}
	if (!Number.isFinite(raw)) return null;
	return Math.min(100, Math.max(0, raw));
}

function isTransientError(err: unknown): boolean {
	if (err instanceof RateLimitedError) return false; // handled separately
	if (err instanceof DiscovrError) return false; // auth / 403 / 409 / loop guard
	if (err instanceof ResponseError) {
		return err.response.status >= 500 || err.response.status === 408;
	}
	if (err instanceof FetchError) return true;
	// Generic network / TypeError from fetch
	if (err instanceof TypeError) return true;
	return false;
}

export class PlaybackTracker {
	static readonly DEFAULT_HEARTBEAT_INTERVAL_MS = DEFAULT_HEARTBEAT_INTERVAL_MS;

	private readonly mediaRefOrId: string;
	private readonly tv?: EpisodeRef;
	private readonly after?: PlaybackTracker;
	private readonly onError?: (error: unknown) => void;
	private readonly onCompleted?: (response: ScrobbleResponse) => void;
	private readonly heartbeatIntervalMs: number;
	private readonly send: (
		mediaRefOrId: string,
		progress: number,
		tv?: EpisodeRef,
	) => Promise<ScrobbleResponse>;
	private readonly now: () => number;
	private readonly sleep: (ms: number) => Promise<void>;

	private started = false;
	private ended = false;
	private paused = false;
	private completedNotified = false;
	private lastScrobbleAt = -Infinity;
	private backoffUntil = -Infinity;
	private awaitedPredecessor = false;

	private readonly queue: QueuedEvent[] = [];
	private draining: Promise<void> | null = null;
	private terminalPromise: Promise<ScrobbleResponse | null> | null = null;

	/** @internal Construct via `client.trackPlayback(...)`. */
	constructor(mediaRefOrId: string, options: TrackPlaybackOptions, deps: _PlaybackTrackerDeps) {
		this.mediaRefOrId = mediaRefOrId;
		this.tv = options.tv;
		this.after = options.after;
		this.onError = options.onError;
		this.onCompleted = options.onCompleted;
		this.heartbeatIntervalMs = options.heartbeatIntervalMs ?? DEFAULT_HEARTBEAT_INTERVAL_MS;
		this.send = deps.send;
		this.now = deps.now ?? (() => Date.now());
		this.sleep = deps.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
	}

	/** Report playback start at a percentage (`0–100`) or `{ position, duration }`. */
	start(progress: PlaybackProgressInput): void {
		if (this.ended) return;
		const p = sanitizeProgress(progress);
		if (p === null) return;
		this.started = true;
		this.paused = false;
		this.lastScrobbleAt = this.now();
		this.enqueue({ kind: "transition", progress: p });
	}

	/**
	 * Report ongoing playback progress. Safe to call every second or on every
	 * `timeupdate` event — throttled to 30 seconds by default, coalesced when
	 * queued behind an in-flight call, and automatically paused during 429 backoff.
	 */
	update(progress: PlaybackProgressInput): void {
		if (this.ended || this.paused) return;
		const p = sanitizeProgress(progress);
		if (p === null) return;
		const now = this.now();
		if (now < this.backoffUntil) return;
		if (this.started && now - this.lastScrobbleAt < this.heartbeatIntervalMs) return;
		this.started = true;
		this.lastScrobbleAt = now;
		this.enqueue({ kind: "heartbeat", progress: p });
	}

	/** Report playback pause (deduplicated; sends immediately). */
	pause(progress: PlaybackProgressInput): void {
		if (this.ended || this.paused) return;
		const p = sanitizeProgress(progress);
		if (p === null) return;
		this.started = true;
		this.paused = true;
		this.lastScrobbleAt = this.now();
		this.enqueue({ kind: "transition", progress: p });
	}

	/** Report playback resume (deduplicated after buffering/stalls; sends immediately). */
	resume(progress: PlaybackProgressInput): void {
		if (this.ended || (this.started && !this.paused)) return;
		const p = sanitizeProgress(progress);
		if (p === null) return;
		this.started = true;
		this.paused = false;
		this.lastScrobbleAt = this.now();
		this.enqueue({ kind: "transition", progress: p });
	}

	/** Report a seek to a new position (sends immediately and resets the heartbeat timer). */
	seek(progress: PlaybackProgressInput): void {
		if (this.ended) return;
		const p = sanitizeProgress(progress);
		if (p === null) return;
		this.started = true;
		this.lastScrobbleAt = this.now();
		this.enqueue({ kind: "transition", progress: p });
	}

	/**
	 * Report playback stop at the viewer's final position. Idempotent once-only:
	 * subsequent calls to `stop()` or `finish()` do not send again and resolve to
	 * the first terminal result. Waits until the final scrobble has landed.
	 */
	stop(progress: PlaybackProgressInput): Promise<ScrobbleResponse | null> {
		if (this.terminalPromise) return this.terminalPromise;
		this.ended = true;
		this.paused = true;

		const p = sanitizeProgress(progress);
		if (p === null) {
			this.terminalPromise = this.flush().then(() => null);
			return this.terminalPromise;
		}

		return this.enqueueTerminal(p);
	}

	/**
	 * Report that the movie or episode played to completion (`100%`). Idempotent
	 * once-only: subsequent calls to `finish()` or `stop()` do not send again and
	 * resolve to the first terminal result.
	 */
	finish(): Promise<ScrobbleResponse | null> {
		if (this.terminalPromise) return this.terminalPromise;
		this.ended = true;
		this.paused = true;
		return this.enqueueTerminal(100);
	}

	/** Wait until all currently queued scrobbles on this tracker have completed. */
	async flush(): Promise<void> {
		if (!this.awaitedPredecessor && this.after) {
			await this.after.flush();
		}
		while (this.draining) {
			await this.draining;
		}
	}

	private enqueueTerminal(progress: number): Promise<ScrobbleResponse | null> {
		// Drop unstarted heartbeats superseded by the terminal position; keep transitions.
		for (let i = this.queue.length - 1; i >= 0; i--) {
			if (this.queue[i].kind === "heartbeat") {
				this.queue.splice(i, 1);
			}
		}

		this.terminalPromise = new Promise<ScrobbleResponse | null>((resolve) => {
			this.enqueue({ kind: "terminal", progress, resolveTerminal: resolve });
		});
		return this.terminalPromise;
	}

	private enqueue(event: QueuedEvent): void {
		if (event.kind === "heartbeat" && this.queue.length > 0) {
			const tail = this.queue[this.queue.length - 1];
			if (tail.kind === "heartbeat") {
				tail.progress = event.progress;
				return;
			}
		}
		this.queue.push(event);
		if (!this.draining) {
			this.draining = this.runDrainLoop();
		}
	}

	private async runDrainLoop(): Promise<void> {
		try {
			await this.drain();
		} finally {
			if (this.queue.length > 0) {
				this.draining = this.runDrainLoop();
			} else {
				this.draining = null;
			}
		}
	}

	private async drain(): Promise<void> {
		if (!this.awaitedPredecessor) {
			this.awaitedPredecessor = true;
			if (this.after) {
				try {
					await this.after.flush();
				} catch {
					// Predecessor errors are already reported on the predecessor tracker.
				}
			}
		}

		while (this.queue.length > 0) {
			const next = this.queue.shift()!;
			const response = await this.deliver(next);
			if (next.resolveTerminal) {
				next.resolveTerminal(response);
			}
		}
	}

	private async deliver(event: QueuedEvent): Promise<ScrobbleResponse | null> {
		const maxAttempts = event.kind === "terminal" ? MAX_TERMINAL_RETRIES + 1 : 1;

		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			try {
				const response = await this.send(this.mediaRefOrId, event.progress, this.tv);
				if (response.completed && !this.completedNotified) {
					this.completedNotified = true;
					this.safeOnCompleted(response);
				}
				return response;
			} catch (err) {
				if (err instanceof RateLimitedError) {
					const retrySec = Math.min(
						MAX_BACKOFF_SECONDS,
						Math.max(1, Math.floor(err.retryInSeconds || 1)),
					);
					this.backoffUntil = this.now() + retrySec * 1_000;

					if (event.kind === "terminal" && attempt + 1 < maxAttempts) {
						const waitSec = Math.min(retrySec, MAX_TERMINAL_RETRY_WAIT_SECONDS);
						await this.sleep(waitSec * 1_000);
						continue;
					}
					this.safeOnError(err);
					return null;
				}

				if (event.kind === "terminal" && isTransientError(err) && attempt + 1 < maxAttempts) {
					await this.sleep(TRANSIENT_BASE_DELAY_MS * (1 << attempt));
					continue;
				}

				this.safeOnError(err);
				return null;
			}
		}
		return null;
	}

	private safeOnError(err: unknown): void {
		if (!this.onError) return;
		try {
			this.onError(err);
		} catch {
			// Never let a user callback break the playback queue.
		}
	}

	private safeOnCompleted(response: ScrobbleResponse): void {
		if (!this.onCompleted) return;
		try {
			this.onCompleted(response);
		} catch {
			// Never let a user callback break the playback queue.
		}
	}
}
