/**
 * `PlaybackTracker` — percentage-first, source-independent playback scrobbler.
 *
 * Create one per watched movie or episode via `client.trackPlayback(item)`.
 * Report player lifecycle events ([start], [update], [pause], [resume], [seek],
 * [stop] / [finish]); the tracker owns the 30-second heartbeat throttle, strict
 * serial FIFO ordering, episode handoff (`after`), once-only terminal teardown
 * protection, pause/resume deduplication, and graceful 429 / transient retry.
 *
 * Percentage (`0–100`) is the primary unit everywhere and the tracker never
 * caches a fixed `duration` across calls (different media sources can have
 * different runtimes, and streams may switch mid-watch). Callers holding a
 * `(position, duration)` pair for the *current* stream may use the two-argument
 * overloads; calls with `duration <= 0` or non-finite values are safely ignored
 * instead of overwriting resume position with `0%`.
 */

package api.discovr

import api.discovr.auth.DiscovrError
import api.discovr.auth.RateLimitedError
import api.discovr.models.EpisodeRef
import api.discovr.models.ScrobbleResponse
import kotlin.concurrent.atomics.AtomicInt
import kotlin.concurrent.atomics.ExperimentalAtomicApi
import kotlin.time.Clock
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.currentCoroutineContext
import kotlinx.coroutines.delay
import kotlinx.coroutines.ensureActive
import kotlinx.coroutines.launch

class PlaybackTracker internal constructor(
    private val mediaRefOrId: String,
    private val tv: EpisodeRef? = null,
    private val after: PlaybackTracker? = null,
    private val onError: ((Throwable) -> Unit)? = null,
    private val onCompleted: ((ScrobbleResponse) -> Unit)? = null,
    private val heartbeatIntervalMs: Long = DEFAULT_HEARTBEAT_INTERVAL_MS,
    private val send: suspend (mediaRefOrId: String, progress: Double, tv: EpisodeRef?) -> ScrobbleResponse,
    private val now: () -> Long = { Clock.System.now().toEpochMilliseconds() },
    private val sleep: suspend (Long) -> Unit = { delay(it) },
    private val scope: CoroutineScope = CoroutineScope(SupervisorJob() + Dispatchers.Default),
) {
    companion object {
        const val DEFAULT_HEARTBEAT_INTERVAL_MS: Long = 30_000L
        private const val MAX_TERMINAL_RETRIES = 2
        private const val MAX_TERMINAL_RETRY_WAIT_SECONDS = 60
        private const val MAX_BACKOFF_SECONDS = 300
        private const val TRANSIENT_BASE_DELAY_MS = 1_000L

        internal fun sanitizeProgress(progress: Double): Double? {
            if (!progress.isFinite()) return null
            return progress.coerceIn(0.0, 100.0)
        }

        internal fun progressFromTime(position: Double, duration: Double): Double? {
            if (!position.isFinite() || !duration.isFinite() || duration <= 0.0) return null
            return sanitizeProgress((position / duration) * 100.0)
        }

        private fun isTransientError(err: Throwable): Boolean {
            if (err is CancellationException) return false
            if (err is RateLimitedError) return false
            if (err is DiscovrError) return false
            if (err is DiscovrException) {
                return err.statusCode >= 500 || err.statusCode == 408
            }
            // Network / IO exceptions from Ktor
            return true
        }
    }

    private sealed class Command {
        data class Start(val progress: Double, val timestampMs: Long) : Command()
        data class Update(val progress: Double, val timestampMs: Long) : Command()
        data class Pause(val progress: Double, val timestampMs: Long) : Command()
        data class Resume(val progress: Double, val timestampMs: Long) : Command()
        data class Seek(val progress: Double, val timestampMs: Long) : Command()
        data class Terminal(val progress: Double?, val result: CompletableDeferred<ScrobbleResponse?>) : Command()
        data class Flush(val done: CompletableDeferred<Unit>) : Command()
    }

    private enum class EventKind { HEARTBEAT, TRANSITION, TERMINAL }

    private data class QueuedEvent(
        val kind: EventKind,
        var progress: Double,
        val terminalDeferred: CompletableDeferred<ScrobbleResponse?>? = null,
    )

    private val commands = Channel<Command>(Channel.UNLIMITED)
    private val terminalCompleted = CompletableDeferred<ScrobbleResponse?>()

    /**
     * Work-in-progress counter coordinating lazy worker launches across KMP
     * targets without holding an idle coroutine open. Transitioning `0 -> 1`
     * launches a single worker coroutine; draining back to `0` lets it exit.
     */
    @OptIn(ExperimentalAtomicApi::class)
    private val wip = AtomicInt(0)

    // Worker-owned state — mutated exclusively by the single active `runWorker()`
    // coroutine, with happens-before visibility guaranteed by `wip`.
    private var started = false
    private var ended = false
    private var paused = false
    private var completedNotified = false
    private var lastScrobbleAt = Long.MIN_VALUE
    private var backoffUntil = Long.MIN_VALUE
    private var awaitedPredecessor = false
    private var hasTerminalResult = false
    private var terminalResult: ScrobbleResponse? = null
    private var activeTerminalDeferred: CompletableDeferred<ScrobbleResponse?>? = null
    private val pending = ArrayDeque<QueuedEvent>()
    private val flushWaiters = mutableListOf<CompletableDeferred<Unit>>()
    private val extraTerminalWaiters = mutableListOf<CompletableDeferred<ScrobbleResponse?>>()

    // ── Primary percentage API (0–100) ───────────────────────────────────────

    /** Report playback start at a percentage (`0–100`). */
    fun start(progress: Double) {
        val p = sanitizeProgress(progress) ?: return
        submit(Command.Start(p, now()))
    }

    /**
     * Report ongoing playback progress (`0–100`). Safe to call every second —
     * throttled to 30 seconds by default, coalesced when queued, and paused
     * during 429 backoff.
     */
    fun update(progress: Double) {
        val p = sanitizeProgress(progress) ?: return
        submit(Command.Update(p, now()))
    }

    /** Report playback pause at a percentage (`0–100`). Deduplicated; sends immediately. */
    fun pause(progress: Double) {
        val p = sanitizeProgress(progress) ?: return
        submit(Command.Pause(p, now()))
    }

    /** Report playback resume at a percentage (`0–100`). Deduplicated; sends immediately. */
    fun resume(progress: Double) {
        val p = sanitizeProgress(progress) ?: return
        submit(Command.Resume(p, now()))
    }

    /** Report a seek to a percentage (`0–100`). Sends immediately and resets heartbeat timer. */
    fun seek(progress: Double) {
        val p = sanitizeProgress(progress) ?: return
        submit(Command.Seek(p, now()))
    }

    /**
     * Report playback stop at the viewer's final percentage (`0–100`).
     * Idempotent once-only: subsequent calls to [stop] or [finish] do not send
     * again and return the first terminal result.
     */
    suspend fun stop(progress: Double): ScrobbleResponse? =
        submitTerminal(sanitizeProgress(progress))

    /**
     * Report that the movie or episode played to completion (`100%`).
     * Idempotent once-only: subsequent calls to [finish] or [stop] do not send
     * again and return the first terminal result.
     */
    suspend fun finish(): ScrobbleResponse? =
        submitTerminal(100.0)

    // ── Per-call (position, duration) convenience overloads ──────────────────

    /** Report playback start from current stream `(position, duration)`. No-ops if `duration <= 0` or non-finite. */
    fun start(position: Double, duration: Double) {
        progressFromTime(position, duration)?.let(::start)
    }

    /** Report ongoing playback from current stream `(position, duration)`. No-ops if `duration <= 0` or non-finite. */
    fun update(position: Double, duration: Double) {
        progressFromTime(position, duration)?.let(::update)
    }

    /** Report playback pause from current stream `(position, duration)`. No-ops if `duration <= 0` or non-finite. */
    fun pause(position: Double, duration: Double) {
        progressFromTime(position, duration)?.let(::pause)
    }

    /** Report playback resume from current stream `(position, duration)`. No-ops if `duration <= 0` or non-finite. */
    fun resume(position: Double, duration: Double) {
        progressFromTime(position, duration)?.let(::resume)
    }

    /** Report a seek from current stream `(position, duration)`. No-ops if `duration <= 0` or non-finite. */
    fun seek(position: Double, duration: Double) {
        progressFromTime(position, duration)?.let(::seek)
    }

    /**
     * Report playback stop from current stream `(position, duration)`.
     * Safely skips sending (still marks ended and drains queue) if `duration <= 0` or non-finite.
     */
    suspend fun stop(position: Double, duration: Double): ScrobbleResponse? =
        submitTerminal(progressFromTime(position, duration))

    /** Wait until all currently queued scrobbles on this tracker have completed. */
    suspend fun flush() {
        if (terminalCompleted.isCompleted) {
            terminalCompleted.await()
            return
        }
        val done = CompletableDeferred<Unit>()
        submit(Command.Flush(done))
        done.await()
    }

    private suspend fun submitTerminal(progress: Double?): ScrobbleResponse? {
        if (terminalCompleted.isCompleted) {
            return terminalCompleted.await()
        }
        val result = CompletableDeferred<ScrobbleResponse?>()
        submit(Command.Terminal(progress, result))
        return result.await()
    }

    @OptIn(ExperimentalAtomicApi::class)
    private fun submit(cmd: Command) {
        commands.trySend(cmd)
        if (wip.fetchAndAdd(1) == 0) {
            val job = scope.launch { runWorker() }
            job.invokeOnCompletion { cause ->
                if (cause != null) {
                    cleanupCancelled(
                        cause as? CancellationException
                            ?: CancellationException("PlaybackTracker worker terminated", cause),
                    )
                }
            }
        }
    }

    private fun enqueueEvent(event: QueuedEvent) {
        if (event.kind == EventKind.HEARTBEAT && pending.isNotEmpty() && pending.last().kind == EventKind.HEARTBEAT) {
            pending.last().progress = event.progress
            return
        }
        pending.addLast(event)
    }

    private fun applyCommand(cmd: Command) {
        when (cmd) {
            is Command.Start -> {
                if (ended) return
                started = true
                paused = false
                lastScrobbleAt = cmd.timestampMs
                enqueueEvent(QueuedEvent(EventKind.TRANSITION, cmd.progress))
            }
            is Command.Update -> {
                if (ended || paused) return
                if (cmd.timestampMs < backoffUntil) return
                if (started && lastScrobbleAt != Long.MIN_VALUE && (cmd.timestampMs - lastScrobbleAt) < heartbeatIntervalMs) {
                    return
                }
                started = true
                lastScrobbleAt = cmd.timestampMs
                enqueueEvent(QueuedEvent(EventKind.HEARTBEAT, cmd.progress))
            }
            is Command.Pause -> {
                if (ended || paused) return
                started = true
                paused = true
                lastScrobbleAt = cmd.timestampMs
                enqueueEvent(QueuedEvent(EventKind.TRANSITION, cmd.progress))
            }
            is Command.Resume -> {
                if (ended || (started && !paused)) return
                started = true
                paused = false
                lastScrobbleAt = cmd.timestampMs
                enqueueEvent(QueuedEvent(EventKind.TRANSITION, cmd.progress))
            }
            is Command.Seek -> {
                if (ended) return
                started = true
                lastScrobbleAt = cmd.timestampMs
                enqueueEvent(QueuedEvent(EventKind.TRANSITION, cmd.progress))
            }
            is Command.Terminal -> {
                if (ended) {
                    if (hasTerminalResult) {
                        cmd.result.complete(terminalResult)
                    } else {
                        extraTerminalWaiters.add(cmd.result)
                    }
                    return
                }
                ended = true
                paused = true
                if (cmd.progress != null) {
                    // Drop unstarted heartbeats superseded by the terminal position.
                    pending.removeAll { it.kind == EventKind.HEARTBEAT }
                    enqueueEvent(QueuedEvent(EventKind.TERMINAL, cmd.progress, cmd.result))
                } else {
                    // Invalid/zero duration on stop: drain queued events without sending 0%.
                    extraTerminalWaiters.add(cmd.result)
                }
            }
            is Command.Flush -> {
                flushWaiters.add(cmd.done)
            }
        }
    }

    private fun drainAvailableCommands() {
        while (true) {
            val next = commands.tryReceive().getOrNull() ?: break
            applyCommand(next)
        }
    }

    private suspend fun awaitPredecessorIfNeeded() {
        if (awaitedPredecessor) return
        awaitedPredecessor = true
        val predecessor = after ?: return
        try {
            predecessor.flush()
        } catch (err: CancellationException) {
            currentCoroutineContext().ensureActive()
            // Predecessor's own scope was cancelled while our scope is still
            // active; proceed with this episode's scrobbles.
        } catch (_: Throwable) {
            // Predecessor error shouldn't block the next episode.
        }
    }

    private suspend fun processEvent(event: QueuedEvent) {
        if (event.kind == EventKind.TERMINAL) {
            activeTerminalDeferred = event.terminalDeferred
        }
        val maxAttempts = if (event.kind == EventKind.TERMINAL) MAX_TERMINAL_RETRIES + 1 else 1
        var delivered: ScrobbleResponse? = null

        for (attempt in 0 until maxAttempts) {
            try {
                val response = send(mediaRefOrId, event.progress, tv)
                if (response.completed && !completedNotified) {
                    completedNotified = true
                    safeOnCompleted(response)
                }
                delivered = response
                break
            } catch (err: CancellationException) {
                throw err
            } catch (err: Throwable) {
                if (err is RateLimitedError) {
                    val retrySec = err.retryInSeconds.coerceIn(1, MAX_BACKOFF_SECONDS)
                    backoffUntil = now() + retrySec * 1_000L
                    if (event.kind == EventKind.TERMINAL && attempt + 1 < maxAttempts) {
                        val waitSec = retrySec.coerceAtMost(MAX_TERMINAL_RETRY_WAIT_SECONDS)
                        sleep(waitSec * 1_000L)
                        continue
                    }
                    safeOnError(err)
                    break
                }
                if (event.kind == EventKind.TERMINAL && isTransientError(err) && attempt + 1 < maxAttempts) {
                    sleep(TRANSIENT_BASE_DELAY_MS * (1L shl attempt))
                    continue
                }
                safeOnError(err)
                break
            }
        }

        if (event.kind == EventKind.TERMINAL) {
            hasTerminalResult = true
            terminalResult = delivered
            if (!terminalCompleted.isCompleted) {
                terminalCompleted.complete(delivered)
            }
            event.terminalDeferred?.complete(delivered)
            activeTerminalDeferred = null
            for (w in extraTerminalWaiters) w.complete(delivered)
            extraTerminalWaiters.clear()
        }
    }

    @OptIn(ExperimentalAtomicApi::class)
    private suspend fun runWorker() {
        var missed = 1
        while (true) {
            drainAvailableCommands()
            while (pending.isNotEmpty()) {
                if (!awaitedPredecessor) {
                    awaitPredecessorIfNeeded()
                    // Re-drain commands that arrived while waiting on predecessor so
                    // heartbeats can coalesce before we send.
                    drainAvailableCommands()
                    if (pending.isEmpty()) break
                }
                val event = pending.removeFirst()
                processEvent(event)
                drainAvailableCommands()
            }

            if (ended) {
                awaitPredecessorIfNeeded()
                if (!hasTerminalResult) {
                    hasTerminalResult = true
                    terminalResult = null
                    if (!terminalCompleted.isCompleted) {
                        terminalCompleted.complete(null)
                    }
                }
                val finalResult = terminalResult
                for (w in extraTerminalWaiters) w.complete(finalResult)
                extraTerminalWaiters.clear()
                for (f in flushWaiters) f.complete(Unit)
                flushWaiters.clear()
            } else if (flushWaiters.isNotEmpty()) {
                for (f in flushWaiters) f.complete(Unit)
                flushWaiters.clear()
            }

            missed = wip.addAndFetch(-missed)
            if (missed == 0) return
        }
    }

    @OptIn(ExperimentalAtomicApi::class)
    private fun cleanupCancelled(ce: CancellationException) {
        if (!terminalCompleted.isCompleted) {
            terminalCompleted.cancel(ce)
        }
        activeTerminalDeferred?.cancel(ce)
        activeTerminalDeferred = null
        for (event in pending) {
            event.terminalDeferred?.cancel(ce)
        }
        pending.clear()
        for (w in extraTerminalWaiters) w.cancel(ce)
        extraTerminalWaiters.clear()
        for (f in flushWaiters) f.cancel(ce)
        flushWaiters.clear()
        wip.store(0)
        while (true) {
            val leftover = commands.tryReceive().getOrNull() ?: break
            when (leftover) {
                is Command.Terminal -> leftover.result.cancel(ce)
                is Command.Flush -> leftover.done.cancel(ce)
                else -> Unit
            }
        }
    }

    private fun safeOnError(err: Throwable) {
        try {
            onError?.invoke(err)
        } catch (ce: CancellationException) {
            throw ce
        } catch (_: Throwable) {
            // Never let a user callback break the playback queue.
        }
    }

    private fun safeOnCompleted(response: ScrobbleResponse) {
        try {
            onCompleted?.invoke(response)
        } catch (ce: CancellationException) {
            throw ce
        } catch (_: Throwable) {
            // Never let a user callback break the playback queue.
        }
    }
}
