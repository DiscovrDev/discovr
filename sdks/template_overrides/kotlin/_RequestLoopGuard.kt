/**
 * `_RequestLoopGuard` — client-side circuit breaker for runaway request loops.
 *
 * ## What this is for
 *
 * The overwhelmingly common cause of a client hammering an API is not abuse,
 * it's a bug: a recomposition loop, a retry without backoff, a `LaunchedEffect`
 * with an unstable key. Without a guard the developer discovers this as a wall
 * of `429`s — long after thousands of requests have already been sent, and with
 * nothing pointing at the line of code responsible.
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

package api.discovr.auth

import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlin.time.Clock

/**
 * Tuning for [_RequestLoopGuard]. Defaults are sized so that no realistic UI
 * burst trips the breaker while a genuine loop trips it almost immediately.
 */
data class LoopGuardConfig(
    /**
     * Requests allowed within [windowMs] before the breaker trips. Far above
     * any sane burst (a screen might fire a dozen calls on load), far below
     * what a runaway loop reaches in a second.
     */
    val maxRequests: Int = 100,
    /** Sliding window width, ms. */
    val windowMs: Long = 10_000,
    /**
     * How long the breaker stays open once tripped, ms. A cooldown rather than
     * a permanent stop, so a genuine burst doesn't disable the client for the
     * rest of its life.
     */
    val cooldownMs: Long = 30_000,
    /**
     * Set `false` to disable entirely. For legitimately high-throughput
     * integrations (bulk backfills, server-side batch jobs) where the default
     * threshold would be a false positive.
     */
    val enabled: Boolean = true,
)

internal class _RequestLoopGuard(private val config: LoopGuardConfig = LoopGuardConfig()) {

    /** Timestamps of recent requests, oldest first. */
    private val timestamps = ArrayDeque<Long>()

    /** When the breaker closes again, or null while it is closed. */
    private var openUntil: Long? = null

    /**
     * All state is mutated under this lock.
     *
     * Unlike the TypeScript guard — which runs on a single-threaded event loop
     * and needs no synchronisation — a Kotlin client fans requests out across
     * coroutines on a multi-threaded dispatcher. Concurrent `check` calls would
     * otherwise race on the deque and undercount, which for a *loop* guard is
     * exactly the situation it exists to catch.
     *
     * A coroutines [Mutex] rather than `synchronized`, which is JVM-only and
     * unavailable in `commonMain`. That is what makes [check] `suspend` — the
     * cost is nil in practice, since every dispatch path calling it is already
     * a suspend function.
     */
    private val mutex = Mutex()

    /**
     * Record an outbound request and throw if it looks like a loop.
     *
     * Call **before** dispatching. [description] is echoed in the error so the
     * developer sees which call was being repeated.
     */
    suspend fun check(description: String) {
        if (!config.enabled) return

        val now = Clock.System.now().toEpochMilliseconds()

        val retryInSeconds = mutex.withLock {
            val open = openUntil
            if (open != null) {
                if (now < open) {
                    return@withLock ((open - now + 999) / 1000).toInt()
                }
                // Cooldown elapsed — close the breaker and start counting fresh,
                // so the caller gets a clean window rather than instantly
                // re-tripping on stale timestamps.
                openUntil = null
                timestamps.clear()
            }

            val cutoff = now - config.windowMs
            while (timestamps.isNotEmpty() && timestamps.first() <= cutoff) {
                timestamps.removeFirst()
            }

            timestamps.addLast(now)

            if (timestamps.size > config.maxRequests) {
                openUntil = now + config.cooldownMs
                ((config.cooldownMs + 999) / 1000).toInt()
            } else {
                null
            }
        } ?: return

        throw RequestLoopError(buildMessage(description, retryInSeconds), retryInSeconds)
    }

    /** Clear all state. Intended for tests and for an explicit caller reset. */
    suspend fun reset() {
        mutex.withLock {
            timestamps.clear()
            openUntil = null
        }
    }

    private fun buildMessage(description: String, retryInSeconds: Int): String =
        "Blocked \"$description\": more than ${config.maxRequests} requests in " +
            "${config.windowMs / 1000}s. This almost always means an unintentional request " +
            "loop — check for a recomposition or retry without backoff. The request was NOT " +
            "sent. Requests resume in ~${retryInSeconds}s. If this is legitimate high-volume " +
            "traffic, raise or disable the limit via the \"loopGuard\" client option."
}
