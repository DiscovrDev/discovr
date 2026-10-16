@testable import Discovr
import XCTest

/// Tests for the client-side runaway-loop breaker.
///
/// The behaviour that matters most is that it fails **closed**: a tripped
/// guard must prevent the request from being sent, not merely complain about
/// it. A guard that logged and let the call through would leave the actual
/// problem — traffic reaching the server — completely unaddressed.
///
/// No fake-clock coverage here (unlike the TypeScript suite): the guard reads
/// the real wall clock (`Date()`), same as the Kotlin port, so cooldown-
/// elapsed/sliding-window-expiry cases aren't exercised without a real sleep.
final class RequestLoopGuardTest: XCTestCase {
    func testAllowsNormalRequestVolume() async throws {
        let guard_ = _RequestLoopGuard(config: LoopGuardConfig(maxRequests: 10, windowMs: 1_000))
        for _ in 0..<10 {
            try await guard_.check("GET /pages")
        }
    }

    func testThrowsOnceThresholdExceeded() async throws {
        let guard_ = _RequestLoopGuard(config: LoopGuardConfig(maxRequests: 5, windowMs: 1_000))
        for _ in 0..<5 {
            try await guard_.check("GET /pages")
        }

        do {
            try await guard_.check("GET /pages")
            XCTFail("expected the guard to throw")
        } catch is RequestLoopError {
            // expected
        }
    }

    func testNamesOffendingRequestAndSaysItWasNotSent() async throws {
        let guard_ = _RequestLoopGuard(config: LoopGuardConfig(maxRequests: 1, windowMs: 1_000))
        try await guard_.check("POST /profile/watchlist")

        do {
            try await guard_.check("POST /profile/watchlist")
            XCTFail("expected the guard to throw")
        } catch let error as RequestLoopError {
            XCTAssertTrue(error.message.contains("POST /profile/watchlist"))
            XCTAssertTrue(error.message.contains("NOT"))
            XCTAssertTrue(error.retryInSeconds > 0)
        }
    }

    func testStaysOpenForCooldownDoesNotResetOnNextCall() async throws {
        let guard_ = _RequestLoopGuard(
            config: LoopGuardConfig(maxRequests: 2, windowMs: 1_000, cooldownMs: 60_000)
        )
        try await guard_.check("GET /pages")
        try await guard_.check("GET /pages")

        for _ in 0..<3 {
            do {
                try await guard_.check("GET /pages")
                XCTFail("expected the guard to throw")
            } catch is RequestLoopError {
                // Still blocked: this is the fail-closed property. A guard that
                // let the very next request through would not actually stop a loop.
            }
        }
    }

    func testCanBeDisabledForHighVolumeIntegrations() async throws {
        let guard_ = _RequestLoopGuard(
            config: LoopGuardConfig(maxRequests: 1, windowMs: 1_000, enabled: false)
        )
        for _ in 0..<500 {
            try await guard_.check("GET /pages")
        }
    }

    func testResetClearsTrippedBreaker() async throws {
        let guard_ = _RequestLoopGuard(config: LoopGuardConfig(maxRequests: 1, windowMs: 1_000))
        try await guard_.check("GET /pages")

        do {
            try await guard_.check("GET /pages")
            XCTFail("expected the guard to throw")
        } catch is RequestLoopError {
            // expected
        }

        await guard_.reset()

        try await guard_.check("GET /pages")
    }

    func testReportsRetryWindowMatchingConfiguredCooldown() async throws {
        let guard_ = _RequestLoopGuard(
            config: LoopGuardConfig(maxRequests: 1, windowMs: 1_000, cooldownMs: 30_000)
        )
        try await guard_.check("GET /pages")

        do {
            try await guard_.check("GET /pages")
            XCTFail("expected the guard to throw")
        } catch let error as RequestLoopError {
            XCTAssertEqual(error.retryInSeconds, 30)
        }
    }
}
