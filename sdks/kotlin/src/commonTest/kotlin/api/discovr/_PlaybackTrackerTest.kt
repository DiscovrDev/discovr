package api.discovr

import api.discovr.auth.NotSignedInError
import api.discovr.auth.RateLimitedError
import api.discovr.models.EpisodeRef
import api.discovr.models.ScrobbleResponse
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitCancellation
import kotlinx.coroutines.cancel
import kotlinx.coroutines.supervisorScope
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.yield
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertIs
import kotlin.test.assertNull
import kotlin.test.assertTrue

class PlaybackTrackerTest {

    private fun okResponse(progress: Double, completed: Boolean = progress >= 80.0) =
        ScrobbleResponse(status = "ok", progress = progress, completed = completed)

    @Test
    fun throttlesHeartbeatsTo30sAndResetsTimerOnSeek() = runTest {
        var clock = 1_000L
        val sent = mutableListOf<Pair<String, Double>>()

        val tracker = PlaybackTracker(
            mediaRefOrId = "MV_550@ctx",
            send = { id, progress, _ ->
                sent.add(id to progress)
                okResponse(progress)
            },
            now = { clock },
            sleep = {},
            scope = backgroundScope,
        )

        tracker.start(0.0)
        clock += 10_000L
        tracker.update(5.0) // throttled
        clock += 19_999L
        tracker.update(10.0) // 29.999s -> still throttled
        clock += 1L
        tracker.update(12.0) // 30s -> sent

        clock += 15_000L
        tracker.seek(50.0) // immediate + resets timer
        clock += 20_000L
        tracker.update(55.0) // 20s since seek -> throttled
        clock += 10_000L
        tracker.update(60.0) // 30s since seek -> sent

        tracker.flush()
        assertEquals(listOf(0.0, 12.0, 50.0, 60.0), sent.map { it.second })
        assertEquals(listOf("MV_550@ctx", "MV_550@ctx", "MV_550@ctx", "MV_550@ctx"), sent.map { it.first })
    }

    @Test
    fun clampsPercentagesAndIgnoresNonFiniteValues() = runTest {
        var clock = 0L
        val sent = mutableListOf<Double>()

        val tracker = PlaybackTracker(
            mediaRefOrId = "MV_550",
            send = { _, progress, _ ->
                sent.add(progress)
                okResponse(progress)
            },
            now = { clock },
            sleep = {},
            scope = backgroundScope,
        )

        tracker.start(Double.NaN)
        tracker.start(Double.POSITIVE_INFINITY)
        tracker.start(Double.NEGATIVE_INFINITY)
        tracker.start(-15.0) // clamped to 0
        clock += 30_000L
        tracker.update(Double.NaN)
        tracker.update(125.0) // clamped to 100

        tracker.flush()
        assertEquals(listOf(0.0, 100.0), sent)
    }

    @Test
    fun perCallPositionDurationDoesNotCacheDurationAndIgnoresZeroDuration() = runTest {
        var clock = 0L
        val sent = mutableListOf<Double>()

        val tracker = PlaybackTracker(
            mediaRefOrId = "MV_550",
            send = { _, progress, _ ->
                sent.add(progress)
                okResponse(progress)
            },
            now = { clock },
            sleep = {},
            scope = backgroundScope,
        )

        tracker.start(position = 0.0, duration = 0.0)
        tracker.start(position = 10.0, duration = -100.0)
        tracker.start(position = 10.0, duration = Double.NaN)

        // Stream A: 1000s total -> 250s = 25%
        tracker.start(position = 250.0, duration = 1000.0)
        // Stream B: 500s total -> 250s = 50% (never caches Stream A's duration)
        clock += 30_000L
        tracker.update(position = 250.0, duration = 500.0)

        val stopRes = tracker.stop(position = 0.0, duration = 0.0)
        assertNull(stopRes)
        assertEquals(listOf(25.0, 50.0), sent)
    }

    @Test
    fun deduplicatesPauseAndResumeAndSuppressesUpdatesWhilePaused() = runTest {
        var clock = 0L
        val sent = mutableListOf<Double>()

        val tracker = PlaybackTracker(
            mediaRefOrId = "MV_550",
            send = { _, progress, _ ->
                sent.add(progress)
                okResponse(progress)
            },
            now = { clock },
            sleep = {},
            scope = backgroundScope,
        )

        tracker.start(10.0)
        tracker.resume(10.0) // redundant resume while playing
        tracker.pause(20.0)
        tracker.pause(20.0) // duplicate pause
        clock += 60_000L
        tracker.update(21.0) // update while paused -> ignored
        tracker.resume(20.0) // genuine resume
        tracker.resume(22.0) // redundant resume after stall

        tracker.flush()
        assertEquals(listOf(10.0, 20.0, 20.0), sent)
    }

    @Test
    fun serialFifoOrderingAndHeartbeatCoalescing() = runTest {
        var clock = 0L
        var inFlight = 0
        var maxConcurrent = 0
        val sent = mutableListOf<Double>()
        val firstGate = CompletableDeferred<Unit>()

        val tracker = PlaybackTracker(
            mediaRefOrId = "MV_550",
            send = { _, progress, _ ->
                inFlight++
                if (inFlight > maxConcurrent) maxConcurrent = inFlight
                sent.add(progress)
                if (progress == 0.0) firstGate.await()
                inFlight--
                okResponse(progress)
            },
            now = { clock },
            sleep = {},
            scope = backgroundScope,
        )

        tracker.start(0.0)
        yield() // let start(0.0) begin and suspend on firstGate
        clock += 30_000L
        tracker.update(10.0)
        clock += 30_000L
        tracker.update(20.0) // coalesces with 10.0
        clock += 30_000L
        tracker.update(30.0) // coalesces with 20.0
        tracker.pause(35.0) // transition never dropped

        firstGate.complete(Unit)
        tracker.flush()

        assertEquals(1, maxConcurrent)
        assertEquals(listOf(0.0, 30.0, 35.0), sent)
    }

    @Test
    fun chainsEpisodeHandoffViaAfter() = runTest {
        val order = mutableListOf<String>()
        val ep1Gate = CompletableDeferred<Unit>()

        val ep1 = PlaybackTracker(
            mediaRefOrId = "TV_1396@row1",
            tv = EpisodeRef(season = 1, episode = 1),
            send = { _, progress, tv ->
                order.add("start:S${tv?.season}E${tv?.episode}@$progress")
                if (progress == 100.0) ep1Gate.await()
                order.add("done:S${tv?.season}E${tv?.episode}@$progress")
                okResponse(progress)
            },
            sleep = {},
            scope = backgroundScope,
        )

        val finishJob = async { ep1.finish() }
        yield()

        val ep2 = PlaybackTracker(
            mediaRefOrId = "TV_1396@row1",
            tv = EpisodeRef(season = 1, episode = 2),
            after = ep1,
            send = { _, progress, tv ->
                order.add("start:S${tv?.season}E${tv?.episode}@$progress")
                order.add("done:S${tv?.season}E${tv?.episode}@$progress")
                okResponse(progress)
            },
            sleep = {},
            scope = backgroundScope,
        )

        ep2.start(0.0)
        yield()
        assertEquals(listOf("start:S1E1@100.0"), order)

        ep1Gate.complete(Unit)
        finishJob.await()
        ep2.flush()

        assertEquals(
            listOf("start:S1E1@100.0", "done:S1E1@100.0", "start:S1E2@0.0", "done:S1E2@0.0"),
            order,
        )
    }

    @Test
    fun onceOnlyTerminalGuardPreventsDoubleTeardown() = runTest {
        val sent = mutableListOf<Double>()

        val tracker = PlaybackTracker(
            mediaRefOrId = "MV_550",
            send = { _, progress, _ ->
                sent.add(progress)
                okResponse(progress)
            },
            sleep = {},
            scope = backgroundScope,
        )

        tracker.start(40.0)
        val first = tracker.finish()
        val second = tracker.stop(0.0)
        val third = tracker.finish()
        tracker.update(0.0)
        tracker.pause(0.0)
        tracker.seek(0.0)

        assertEquals(100.0, first?.progress)
        assertEquals(first, second)
        assertEquals(first, third)
        assertEquals(listOf(40.0, 100.0), sent)
    }

    @Test
    fun backsOffHeartbeatsOn429AndRetriesTerminalSendWithCappedWait() = runTest {
        var clock = 0L
        val sleeps = mutableListOf<Long>()
        val errors = mutableListOf<Throwable>()
        val sent = mutableListOf<Double>()
        var attempt = 0

        val tracker = PlaybackTracker(
            mediaRefOrId = "MV_550",
            onError = { errors.add(it) },
            send = { _, progress, _ ->
                sent.add(progress)
                attempt++
                when (attempt) {
                    1 -> throw RateLimitedError("slow down", 45)
                    2 -> throw RateLimitedError("slow down", 120) // capped to 60s
                    else -> okResponse(progress, completed = true)
                }
            },
            now = { clock },
            sleep = { ms ->
                sleeps.add(ms)
                clock += ms
            },
            scope = backgroundScope,
        )

        tracker.update(20.0)
        tracker.flush()
        assertEquals(1, errors.size)

        clock += 30_000L
        tracker.update(25.0) // inside 45s backoff -> suppressed
        tracker.flush()
        assertEquals(listOf(20.0), sent)

        val res = tracker.finish()
        assertEquals(okResponse(100.0, completed = true), res)
        assertEquals(listOf(60_000L), sleeps)
        assertEquals(listOf(20.0, 100.0, 100.0), sent)
    }

    @Test
    fun retriesTransient5xxOnTerminalStopAndDoesNotRetry4xx() = runTest {
        val sleeps = mutableListOf<Long>()
        var calls = 0

        val tracker = PlaybackTracker(
            mediaRefOrId = "MV_550",
            send = { _, progress, _ ->
                calls++
                if (calls == 1) throw DiscovrException(503, "Service Unavailable")
                okResponse(progress)
            },
            sleep = { sleeps.add(it) },
            scope = backgroundScope,
        )

        val res = tracker.stop(72.0)
        assertEquals(72.0, res?.progress)
        assertEquals(2, calls)
        assertEquals(listOf(1_000L), sleeps)

        // Permanent auth error is not retried
        val permErrors = mutableListOf<Throwable>()
        var permCalls = 0
        val tracker2 = PlaybackTracker(
            mediaRefOrId = "MV_550",
            onError = { permErrors.add(it) },
            send = { _, _, _ ->
                permCalls++
                throw NotSignedInError()
            },
            sleep = { error("should not sleep on 4xx") },
            scope = backgroundScope,
        )

        assertNull(tracker2.finish())
        assertEquals(1, permCalls)
        assertEquals(1, permErrors.size)
        assertIs<NotSignedInError>(permErrors.first())
    }

    @Test
    fun firesOnCompletedAtMostOnce() = runTest {
        var clock = 0L
        val completions = mutableListOf<ScrobbleResponse>()

        val tracker = PlaybackTracker(
            mediaRefOrId = "MV_550",
            onCompleted = { completions.add(it) },
            send = { _, progress, _ -> okResponse(progress, completed = progress >= 80.0) },
            now = { clock },
            sleep = {},
            scope = backgroundScope,
        )

        tracker.start(75.0)
        clock += 30_000L
        tracker.update(82.0) // crosses 80% -> notifies once
        tracker.flush()
        clock += 30_000L
        tracker.update(90.0) // already notified
        tracker.finish()

        assertEquals(1, completions.size)
        assertEquals(82.0, completions.first().progress)
    }

    @Test
    fun concurrentTerminalCallersResolveToFirstResponseWithSingleSend() = runTest {
        val gate = CompletableDeferred<Unit>()
        val entered = CompletableDeferred<Unit>()
        val sent = mutableListOf<Double>()

        val tracker = PlaybackTracker(
            mediaRefOrId = "MV_550",
            send = { _, progress, _ ->
                sent.add(progress)
                entered.complete(Unit)
                gate.await()
                okResponse(progress, completed = true)
            },
            sleep = {},
            scope = backgroundScope,
        )

        val first = async { tracker.stop(80.0) }
        entered.await()
        val second = async { tracker.finish() }
        yield()

        gate.complete(Unit)
        val r1 = first.await()
        val r2 = second.await()

        assertEquals(okResponse(80.0, completed = true), r1)
        assertEquals(r1, r2)
        assertEquals(listOf(80.0), sent)
    }

    @Test
    fun scopeCancellationPropagatesAndUnblocksExternalWaiters() = runTest {
        val trackerJob = SupervisorJob()
        val trackerScope = CoroutineScope(coroutineContext + trackerJob)
        val entered = CompletableDeferred<Unit>()
        val errors = mutableListOf<Throwable>()
        var attempts = 0

        val tracker = PlaybackTracker(
            mediaRefOrId = "MV_550",
            onError = { errors.add(it) },
            send = { _, _, _ ->
                attempts++
                entered.complete(Unit)
                awaitCancellation()
            },
            sleep = { error("CancellationException must not trigger retries") },
            scope = trackerScope,
        )

        supervisorScope {
            val stopWaiter = async { tracker.stop(50.0) }
            entered.await()
            val flushWaiter = async { tracker.flush() }
            yield()

            trackerScope.cancel()

            assertFailsWith<CancellationException> { stopWaiter.await() }
            assertFailsWith<CancellationException> { flushWaiter.await() }
            // Subsequent stop/flush on the cancelled tracker also fail fast without deadlocking.
            assertFailsWith<CancellationException> { tracker.finish() }
            assertFailsWith<CancellationException> { tracker.flush() }
        }

        assertEquals(1, attempts)
        assertTrue(errors.isEmpty(), "CancellationException must not be reported to onError")
    }

    @Test
    fun abandonedTrackerLeaksNoIdleWorkerAndEmptyFlushPreservesAfterHandoff() = runTest {
        val trackerJob = Job()
        val trackerScope = CoroutineScope(coroutineContext + trackerJob)
        val ep1Gate = CompletableDeferred<Unit>()
        val order = mutableListOf<String>()

        val ep1 = PlaybackTracker(
            mediaRefOrId = "TV_1396",
            tv = EpisodeRef(season = 1, episode = 1),
            send = { _, progress, _ ->
                order.add("ep1:$progress")
                if (progress == 100.0) ep1Gate.await()
                okResponse(progress)
            },
            sleep = {},
            scope = trackerScope,
        )

        // Creating a tracker does not spawn an eager background coroutine.
        assertTrue(trackerJob.children.toList().isEmpty())

        ep1.start(10.0)
        ep1.flush()
        // Worker exited once the queue drained — zero idle coroutines left behind.
        assertTrue(trackerJob.children.toList().isEmpty())

        val ep2 = PlaybackTracker(
            mediaRefOrId = "TV_1396",
            tv = EpisodeRef(season = 1, episode = 2),
            after = ep1,
            send = { _, progress, _ ->
                order.add("ep2:$progress")
                okResponse(progress)
            },
            sleep = {},
            scope = trackerScope,
        )

        // Empty flush on ep2 must complete without prematurely consuming `after`.
        ep2.flush()
        assertTrue(trackerJob.children.toList().isEmpty())

        val ep1Finish = async { ep1.finish() }
        yield()
        ep2.start(0.0)
        yield()
        // ep2 is still waiting on ep1.finish() because empty flush did not skip handoff.
        assertEquals(listOf("ep1:10.0", "ep1:100.0"), order)

        ep1Gate.complete(Unit)
        ep1Finish.await()
        ep2.flush()

        assertEquals(listOf("ep1:10.0", "ep1:100.0", "ep2:0.0"), order)
        assertTrue(trackerJob.children.toList().isEmpty())
        trackerJob.cancel()
    }
}
