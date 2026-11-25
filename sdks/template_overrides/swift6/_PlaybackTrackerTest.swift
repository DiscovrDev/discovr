@testable import Discovr
import XCTest

private final class FakeClock: @unchecked Sendable {
    private let lock = NSLock()
    private var _now: TimeInterval
    init(_ start: TimeInterval = 0) { self._now = start }
    var now: TimeInterval {
        lock.lock(); defer { lock.unlock() }
        return _now
    }
    func advance(by seconds: TimeInterval) {
        lock.lock(); defer { lock.unlock() }
        _now += seconds
    }
}

private actor EventLog<T: Sendable> {
    private(set) var items: [T] = []
    func append(_ item: T) { items.append(item) }
}

private final class SyncLog<T: Sendable>: @unchecked Sendable {
    private let lock = NSLock()
    private var _items: [T] = []
    var items: [T] {
        lock.lock(); defer { lock.unlock() }
        return _items
    }
    func append(_ item: T) {
        lock.lock(); defer { lock.unlock() }
        _items.append(item)
    }
}

private actor PlaybackGate {
    private var continuation: CheckedContinuation<Void, Never>?
    private var entered = false
    private var enteredWaiter: CheckedContinuation<Void, Never>?
    private var released = false

    func wait() async {
        if released { return }
        await withCheckedContinuation { cont in
            continuation = cont
            entered = true
            enteredWaiter?.resume()
            enteredWaiter = nil
        }
    }

    func waitUntilEntered() async {
        if entered { return }
        await withCheckedContinuation { cont in
            enteredWaiter = cont
        }
    }

    func release() {
        released = true
        continuation?.resume()
        continuation = nil
    }
}

private actor AttemptCounter {
    private(set) var value = 0
    func next() -> Int {
        value += 1
        return value
    }
}

private actor ConcurrencyTracker {
    private var active = 0
    private(set) var maxObserved = 0
    func enter() {
        active += 1
        if active > maxObserved { maxObserved = active }
    }
    func leave() { active -= 1 }
}

final class PlaybackTrackerTest: XCTestCase {
    private func okResponse(_ progress: Double, completed: Bool? = nil) -> ScrobbleResponse {
        ScrobbleResponse(status: "ok", progress: progress, completed: completed ?? (progress >= 80))
    }

    func testThrottlesHeartbeatsTo30sAndResetsTimerOnSeek() async {
        let clock = FakeClock(100)
        let log = EventLog<(String, Double)>()

        let tracker = PlaybackTracker(
            mediaRefOrId: "MV_550@ctx",
            send: { id, progress, _ in
                await log.append((id, progress))
                return ScrobbleResponse(status: "ok", progress: progress, completed: progress >= 80)
            },
            now: { clock.now },
            sleep: { _ in }
        )

        tracker.start(progress: 0)
        clock.advance(by: 10)
        tracker.update(progress: 5) // throttled
        clock.advance(by: 19.9)
        tracker.update(progress: 10) // 29.9s -> throttled
        clock.advance(by: 0.1)
        tracker.update(progress: 12) // 30s -> sent

        clock.advance(by: 15)
        tracker.seek(progress: 50) // immediate + resets timer
        clock.advance(by: 20)
        tracker.update(progress: 55) // 20s since seek -> throttled
        clock.advance(by: 10)
        tracker.update(progress: 60) // 30s since seek -> sent

        await tracker.flush()
        let items = await log.items
        XCTAssertEqual(items.map(\.1), [0, 12, 50, 60])
        XCTAssertTrue(items.allSatisfy { $0.0 == "MV_550@ctx" })
    }

    func testClampsPercentagesAndIgnoresNonFiniteValues() async {
        let clock = FakeClock(0)
        let log = EventLog<Double>()

        let tracker = PlaybackTracker(
            mediaRefOrId: "MV_550",
            send: { _, progress, _ in
                await log.append(progress)
                return ScrobbleResponse(status: "ok", progress: progress, completed: progress >= 80)
            },
            now: { clock.now },
            sleep: { _ in }
        )

        tracker.start(progress: .nan)
        tracker.start(progress: .infinity)
        tracker.start(progress: -.infinity)
        tracker.start(progress: -15) // clamped to 0
        clock.advance(by: 30)
        tracker.update(progress: .nan)
        tracker.update(progress: 125) // clamped to 100

        await tracker.flush()
        let items = await log.items
        XCTAssertEqual(items, [0, 100])
    }

    func testPerCallPositionDurationDoesNotCacheDurationAndIgnoresZeroDuration() async {
        let clock = FakeClock(0)
        let log = EventLog<Double>()

        let tracker = PlaybackTracker(
            mediaRefOrId: "MV_550",
            send: { _, progress, _ in
                await log.append(progress)
                return ScrobbleResponse(status: "ok", progress: progress, completed: progress >= 80)
            },
            now: { clock.now },
            sleep: { _ in }
        )

        tracker.start(position: 0, duration: 0)
        tracker.start(position: 10, duration: -100)
        tracker.start(position: 10, duration: .nan)

        // Stream A: 1000s total -> 250s = 25%
        tracker.start(position: 250, duration: 1000)
        // Stream B: 500s total -> 250s = 50% (never uses old 1000s)
        clock.advance(by: 30)
        tracker.update(position: 250, duration: 500)

        let stopRes = await tracker.stop(position: 0, duration: 0)
        XCTAssertNil(stopRes)
        let items = await log.items
        XCTAssertEqual(items, [25, 50])
    }

    func testDeduplicatesPauseAndResumeAndSuppressesUpdatesWhilePaused() async {
        let clock = FakeClock(0)
        let log = EventLog<Double>()

        let tracker = PlaybackTracker(
            mediaRefOrId: "MV_550",
            send: { _, progress, _ in
                await log.append(progress)
                return ScrobbleResponse(status: "ok", progress: progress, completed: progress >= 80)
            },
            now: { clock.now },
            sleep: { _ in }
        )

        tracker.start(progress: 10)
        tracker.resume(progress: 10) // redundant while playing
        tracker.pause(progress: 20)
        tracker.pause(progress: 20) // duplicate pause
        clock.advance(by: 60)
        tracker.update(progress: 21) // paused -> ignored
        tracker.resume(progress: 20) // genuine resume
        tracker.resume(progress: 22) // redundant after stall

        await tracker.flush()
        let items = await log.items
        XCTAssertEqual(items, [10, 20, 20])
    }

    func testSerialFifoOrderingAndHeartbeatCoalescing() async {
        let clock = FakeClock(0)
        let log = EventLog<Double>()
        let concurrency = ConcurrencyTracker()
        let firstGate = PlaybackGate()

        let tracker = PlaybackTracker(
            mediaRefOrId: "MV_550",
            send: { _, progress, _ in
                await concurrency.enter()
                await log.append(progress)
                if progress == 0 {
                    await firstGate.wait()
                }
                await concurrency.leave()
                return ScrobbleResponse(status: "ok", progress: progress, completed: progress >= 80)
            },
            now: { clock.now },
            sleep: { _ in }
        )

        tracker.start(progress: 0)
        await firstGate.waitUntilEntered()

        clock.advance(by: 30)
        tracker.update(progress: 10)
        clock.advance(by: 30)
        tracker.update(progress: 20) // coalesces with 10
        clock.advance(by: 30)
        tracker.update(progress: 30) // coalesces with 20
        tracker.pause(progress: 35) // transition never dropped

        await firstGate.release()
        await tracker.flush()

        let maxObserved = await concurrency.maxObserved
        let items = await log.items
        XCTAssertEqual(maxObserved, 1)
        XCTAssertEqual(items, [0, 30, 35])
    }

    func testChainsEpisodeHandoffViaAfter() async {
        let order = EventLog<String>()
        let ep1Gate = PlaybackGate()

        let ep1 = PlaybackTracker(
            mediaRefOrId: "TV_1396@row1",
            tv: EpisodeRef(season: 1, episode: 1),
            send: { _, progress, tv in
                await order.append("start:S\(tv?.season ?? 0)E\(tv?.episode ?? 0)@\(Int(progress))")
                if progress == 100 { await ep1Gate.wait() }
                await order.append("done:S\(tv?.season ?? 0)E\(tv?.episode ?? 0)@\(Int(progress))")
                return ScrobbleResponse(status: "ok", progress: progress, completed: progress >= 80)
            },
            sleep: { _ in }
        )

        let finishTask = Task { await ep1.finish() }
        await ep1Gate.waitUntilEntered()

        let ep2 = PlaybackTracker(
            mediaRefOrId: "TV_1396@row1",
            tv: EpisodeRef(season: 1, episode: 2),
            after: ep1,
            send: { _, progress, tv in
                await order.append("start:S\(tv?.season ?? 0)E\(tv?.episode ?? 0)@\(Int(progress))")
                await order.append("done:S\(tv?.season ?? 0)E\(tv?.episode ?? 0)@\(Int(progress))")
                return ScrobbleResponse(status: "ok", progress: progress, completed: progress >= 80)
            },
            sleep: { _ in }
        )

        ep2.start(progress: 0)
        try? await Task.sleep(nanoseconds: 10_000_000)
        let beforeRelease = await order.items
        XCTAssertEqual(beforeRelease, ["start:S1E1@100"])

        await ep1Gate.release()
        _ = await finishTask.value
        await ep2.flush()

        let finalOrder = await order.items
        XCTAssertEqual(finalOrder, ["start:S1E1@100", "done:S1E1@100", "start:S1E2@0", "done:S1E2@0"])
    }

    func testOnceOnlyTerminalGuardPreventsDoubleTeardown() async {
        let log = EventLog<Double>()

        let tracker = PlaybackTracker(
            mediaRefOrId: "MV_550",
            send: { _, progress, _ in
                await log.append(progress)
                return ScrobbleResponse(status: "ok", progress: progress, completed: progress >= 80)
            },
            sleep: { _ in }
        )

        tracker.start(progress: 40)
        let first = await tracker.finish()
        let second = await tracker.stop(progress: 0)
        let third = await tracker.finish()
        tracker.update(progress: 0)
        tracker.pause(progress: 0)
        tracker.seek(progress: 0)

        XCTAssertEqual(first?.progress, 100)
        XCTAssertEqual(second, first)
        XCTAssertEqual(third, first)
        let items = await log.items
        XCTAssertEqual(items, [40, 100])
    }

    func testBacksOffHeartbeatsOn429AndRetriesTerminalSendWithCappedWait() async {
        let clock = FakeClock(0)
        let sleeps = EventLog<TimeInterval>()
        let errors = SyncLog<String>()
        let sent = EventLog<Double>()
        let attempts = AttemptCounter()

        let tracker = PlaybackTracker(
            mediaRefOrId: "MV_550",
            onError: { err in
                errors.append("\(err)")
            },
            send: { _, progress, _ in
                await sent.append(progress)
                let n = await attempts.next()
                if n == 1 {
                    throw AuthError.rateLimited(retryInSeconds: 45)
                }
                if n == 2 {
                    throw AuthError.rateLimited(retryInSeconds: 120) // capped to 60s
                }
                return ScrobbleResponse(status: "ok", progress: progress, completed: true)
            },
            now: { clock.now },
            sleep: { seconds in
                await sleeps.append(seconds)
                clock.advance(by: seconds)
            }
        )

        tracker.update(progress: 20)
        await tracker.flush()
        XCTAssertEqual(errors.items.count, 1)

        clock.advance(by: 30)
        tracker.update(progress: 25) // inside 45s backoff -> suppressed
        await tracker.flush()
        let sentAfterBackoff = await sent.items
        XCTAssertEqual(sentAfterBackoff, [20])

        let res = await tracker.finish()
        XCTAssertEqual(res, okResponse(100, completed: true))
        let recordedSleeps = await sleeps.items
        let finalSent = await sent.items
        XCTAssertEqual(recordedSleeps, [60])
        XCTAssertEqual(finalSent, [20, 100, 100])
        XCTAssertEqual(errors.items.count, 1)
    }

    func testConcurrentTerminalCallersResolveToFirstResponseWithSingleSend() async {
        let gate = PlaybackGate()
        let sent = EventLog<Double>()

        let tracker = PlaybackTracker(
            mediaRefOrId: "MV_550",
            send: { _, progress, _ in
                await sent.append(progress)
                await gate.wait()
                return ScrobbleResponse(status: "ok", progress: progress, completed: true)
            },
            sleep: { _ in }
        )

        let first = Task { await tracker.stop(progress: 80) }
        await gate.waitUntilEntered()
        let second = Task { await tracker.finish() }
        // Let second terminal call enqueue behind the active terminal send.
        await Task.yield()

        await gate.release()
        let r1 = await first.value
        let r2 = await second.value

        XCTAssertEqual(r1, okResponse(80, completed: true))
        XCTAssertEqual(r2, r1)
        let items = await sent.items
        XCTAssertEqual(items, [80])
    }

    func testRetriesTransient5xxOnTerminalStopAndDoesNotRetry4xx() async {
        let sleeps = EventLog<TimeInterval>()
        let attempts = AttemptCounter()

        let tracker = PlaybackTracker(
            mediaRefOrId: "MV_550",
            send: { _, progress, _ in
                let n = await attempts.next()
                if n == 1 {
                    throw ErrorResponse.error(503, nil, nil, URLError(.badServerResponse))
                }
                return ScrobbleResponse(status: "ok", progress: progress, completed: false)
            },
            sleep: { seconds in
                await sleeps.append(seconds)
            }
        )

        let res = await tracker.stop(progress: 72)
        XCTAssertEqual(res?.progress, 72)
        let count = await attempts.value
        let recordedSleeps = await sleeps.items
        XCTAssertEqual(count, 2)
        XCTAssertEqual(recordedSleeps, [1])

        // Permanent AuthError is not retried
        let permAttempts = AttemptCounter()
        let tracker2 = PlaybackTracker(
            mediaRefOrId: "MV_550",
            send: { _, _, _ in
                _ = await permAttempts.next()
                throw AuthError.notSignedIn
            },
            sleep: { _ in
                XCTFail("Should not sleep on permanent AuthError")
            }
        )

        let res2 = await tracker2.finish()
        XCTAssertNil(res2)
        let permCount = await permAttempts.value
        XCTAssertEqual(permCount, 1)
    }

    func testFiresOnCompletedAtMostOnce() async {
        let clock = FakeClock(0)
        let completions = EventLog<Double>()

        let tracker = PlaybackTracker(
            mediaRefOrId: "MV_550",
            onCompleted: { res in
                Task { await completions.append(res.progress) }
            },
            send: { _, progress, _ in
                ScrobbleResponse(status: "ok", progress: progress, completed: progress >= 80)
            },
            now: { clock.now },
            sleep: { _ in }
        )

        tracker.start(progress: 75)
        clock.advance(by: 30)
        tracker.update(progress: 82)
        await tracker.flush()
        clock.advance(by: 30)
        tracker.update(progress: 90)
        _ = await tracker.finish()

        try? await Task.sleep(nanoseconds: 20_000_000)
        let recorded = await completions.items
        XCTAssertEqual(recorded, [82])
    }
}
