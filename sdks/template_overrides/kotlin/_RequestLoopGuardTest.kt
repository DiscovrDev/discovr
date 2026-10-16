package api.discovr.auth

import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue

/**
 * Tests for the client-side runaway-loop breaker.
 *
 * The behaviour that matters most is that it fails **closed**: a tripped guard
 * must prevent the request from being sent, not merely complain about it. A
 * guard that logged and let the call through would leave the actual problem —
 * traffic reaching the server — completely unaddressed.
 */
class RequestLoopGuardTest {

    @Test
    fun allowsNormalRequestVolume() = runTest {
        val guard = _RequestLoopGuard(LoopGuardConfig(maxRequests = 10, windowMs = 1_000))
        repeat(10) { guard.check("GET /pages") }
    }

    @Test
    fun throwsOnceThresholdExceeded() = runTest {
        val guard = _RequestLoopGuard(LoopGuardConfig(maxRequests = 5, windowMs = 1_000))
        repeat(5) { guard.check("GET /pages") }

        assertFailsWith<RequestLoopError> { guard.check("GET /pages") }
    }

    @Test
    fun namesOffendingRequestAndSaysItWasNotSent() = runTest {
        val guard = _RequestLoopGuard(LoopGuardConfig(maxRequests = 1, windowMs = 1_000))
        guard.check("POST /profile/watchlist")

        val error = assertFailsWith<RequestLoopError> { guard.check("POST /profile/watchlist") }
        assertTrue(error.message!!.contains("POST /profile/watchlist"))
        assertTrue(error.message!!.contains("NOT"))
        assertTrue(error.retryInSeconds > 0)
    }

    @Test
    fun staysOpenForCooldown_doesNotResetOnNextCall() = runTest {
        val guard = _RequestLoopGuard(
            LoopGuardConfig(maxRequests = 2, windowMs = 1_000, cooldownMs = 60_000),
        )
        guard.check("GET /pages")
        guard.check("GET /pages")

        assertFailsWith<RequestLoopError> { guard.check("GET /pages") }
        // Still blocked: this is the fail-closed property. A guard that let the
        // very next request through would not actually stop a loop.
        assertFailsWith<RequestLoopError> { guard.check("GET /pages") }
        assertFailsWith<RequestLoopError> { guard.check("GET /pages") }
    }

    @Test
    fun canBeDisabledForHighVolumeIntegrations() = runTest {
        val guard = _RequestLoopGuard(
            LoopGuardConfig(maxRequests = 1, windowMs = 1_000, enabled = false),
        )
        repeat(500) { guard.check("GET /pages") }
    }

    @Test
    fun resetClearsTrippedBreaker() = runTest {
        val guard = _RequestLoopGuard(LoopGuardConfig(maxRequests = 1, windowMs = 1_000))
        guard.check("GET /pages")
        assertFailsWith<RequestLoopError> { guard.check("GET /pages") }

        guard.reset()

        guard.check("GET /pages")
    }

    @Test
    fun reportsRetryWindowMatchingConfiguredCooldown() = runTest {
        val guard = _RequestLoopGuard(
            LoopGuardConfig(maxRequests = 1, windowMs = 1_000, cooldownMs = 30_000),
        )
        guard.check("GET /pages")

        val error = assertFailsWith<RequestLoopError> { guard.check("GET /pages") }
        assertEquals(30, error.retryInSeconds)
    }
}
