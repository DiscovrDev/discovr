@testable import Discovr
import XCTest

private actor AsyncGate<T: Sendable> {
    private var continuation: CheckedContinuation<T, Never>?
    private var pendingValue: T?
    private var waitingContinuation: CheckedContinuation<Void, Never>?
    private var isWaiting = false

    func wait() async -> T {
        if let value = pendingValue {
            pendingValue = nil
            return value
        }
        return await withCheckedContinuation { cont in
            continuation = cont
            isWaiting = true
            waitingContinuation?.resume()
            waitingContinuation = nil
        }
    }

    func waitUntilEntered() async {
        if isWaiting { return }
        await withCheckedContinuation { cont in
            waitingContinuation = cont
        }
    }

    func release(_ value: T) {
        if let cont = continuation {
            continuation = nil
            isWaiting = false
            cont.resume(returning: value)
        } else {
            pendingValue = value
        }
    }
}

private actor Counter {
    private(set) var count = 0
    func next() -> Int {
        count += 1
        return count
    }
}

private actor ScopeBox {
    private(set) var value: String?
    init(_ value: String?) { self.value = value }
    func set(_ newValue: String?) { value = newValue }
}

final class DiscovrCacheTest: XCTestCase {
    func testCachesRepeatCallsWithSameParams() async throws {
        let cache = _DiscovrCache()
        let counter = Counter()

        let first = try await cache.wrap(operationId: "getPage", keyParams: ["pageId": "abc"], ttlSeconds: nil, bypass: false) {
            "page_\(await counter.next())"
        }
        let second = try await cache.wrap(operationId: "getPage", keyParams: ["pageId": "abc"], ttlSeconds: nil, bypass: false) {
            "page_\(await counter.next())"
        }

        XCTAssertEqual(first, "page_1")
        XCTAssertEqual(second, "page_1")
        let calls = await counter.count
        XCTAssertEqual(calls, 1)
    }

    func testClearDuringInFlightFetchDiscardsStaleResultWithoutRetryPredicate() async throws {
        let cache = _DiscovrCache()
        let gate = AsyncGate<String>()

        let pending = Task {
            try await cache.wrap(operationId: "getPage", keyParams: ["pageId": "abc"], ttlSeconds: nil, bypass: false) {
                await gate.wait()
            }
        }

        await gate.waitUntilEntered()
        await cache.clear()
        await gate.release("profileA")

        do {
            _ = try await pending.value
            XCTFail("Expected DiscovrCacheStaleGenerationError")
        } catch is DiscovrCacheStaleGenerationError {
            // expected
        }

        // Stale result was never committed to the cache.
        let fresh = try await cache.wrap(operationId: "getPage", keyParams: ["pageId": "abc"], ttlSeconds: nil, bypass: false) {
            "profileB"
        }
        XCTAssertEqual(fresh, "profileB")
    }

    func testMidFlightClearWhileActiveRetriesOnceTransparently() async throws {
        let cache = _DiscovrCache(retryScope: { "profileA" })
        let counter = Counter()
        let gate = AsyncGate<String>()

        let pending = Task {
            try await cache.wrap(operationId: "getPage", keyParams: ["pageId": "home"], ttlSeconds: nil, bypass: false) {
                let n = await counter.next()
                if n == 1 { return await gate.wait() }
                return "snap2"
            }
        }

        await gate.waitUntilEntered()
        await cache.clearForSnapshot("snap2", retryable: true)
        await gate.release("snap1")

        let result = try await pending.value
        XCTAssertEqual(result, "snap2")
        let callsAfterRetry = await counter.count
        XCTAssertEqual(callsAfterRetry, 2)

        // Fresh value is cached; stale value was never cached.
        let cached = try await cache.wrap(operationId: "getPage", keyParams: ["pageId": "home"], ttlSeconds: nil, bypass: false) {
            _ = await counter.next()
            return "snap3"
        }
        XCTAssertEqual(cached, "snap2")
        let callsAfterCacheHit = await counter.count
        XCTAssertEqual(callsAfterCacheHit, 2)
    }

    func testProfileSwitchDuringInFlightFetchNeverRetriesAcrossProfiles() async throws {
        let activeProfile = ScopeBox("profileA")
        let cache = _DiscovrCache(retryScope: { await activeProfile.value })
        let counter = Counter()
        let gate = AsyncGate<String>()

        let pending = Task {
            try await cache.wrap(operationId: "getPage", keyParams: ["pageId": "home"], ttlSeconds: nil, bypass: false) {
                let n = await counter.next()
                if n == 1 { return await gate.wait() }
                return "profileB"
            }
        }

        await gate.waitUntilEntered()
        // Switch to Profile B (non-retryable), followed by a retryable
        // snapshot turnover before Profile A's slow fetch completes.
        await activeProfile.set("profileB")
        await cache.clearAndMarkSnapshot("snapB1", retryable: false)
        await cache.clearForSnapshot("snapB2", retryable: true)
        await gate.release("profileA")

        do {
            _ = try await pending.value
            XCTFail("Expected DiscovrCacheStaleGenerationError")
        } catch is DiscovrCacheStaleGenerationError {
            // expected
        }
        let calls = await counter.count
        XCTAssertEqual(calls, 1)
    }

    func testNonRetryableClearOnSignOutOrReselectDoesNotRetryEvenAfterLaterClear() async throws {
        let cache = _DiscovrCache(retryScope: { "profileA" })
        let counter = Counter()
        let gate = AsyncGate<String>()

        let pending = Task {
            try await cache.wrap(operationId: "getPage", keyParams: ["pageId": "home"], ttlSeconds: nil, bypass: false) {
                _ = await counter.next()
                return await gate.wait()
            }
        }

        await gate.waitUntilEntered()
        await cache.clear(retryable: false)
        await cache.clear(retryable: true)
        await gate.release("stale")

        do {
            _ = try await pending.value
            XCTFail("Expected DiscovrCacheStaleGenerationError")
        } catch is DiscovrCacheStaleGenerationError {
            // expected
        }
        let calls = await counter.count
        XCTAssertEqual(calls, 1)
    }

    func testClearWhileSignedOutDoesNotRetry() async throws {
        let scope = ScopeBox("profileA")
        let cache = _DiscovrCache(retryScope: { await scope.value })
        let counter = Counter()
        let gate = AsyncGate<String>()

        let pending = Task {
            try await cache.wrap(operationId: "getPage", keyParams: ["pageId": "home"], ttlSeconds: nil, bypass: false) {
                _ = await counter.next()
                return await gate.wait()
            }
        }

        await gate.waitUntilEntered()
        await scope.set(nil)
        await cache.clear()
        await gate.release("stale")

        do {
            _ = try await pending.value
            XCTFail("Expected DiscovrCacheStaleGenerationError")
        } catch is DiscovrCacheStaleGenerationError {
            // expected
        }
        let calls = await counter.count
        XCTAssertEqual(calls, 1)
    }

    func testSecondConsecutiveClearDuringRetryThrowsInsteadOfLooping() async throws {
        let cache = _DiscovrCache(retryScope: { "profileA" })
        let counter = Counter()
        let gate1 = AsyncGate<String>()
        let gate2 = AsyncGate<String>()

        let pending = Task {
            try await cache.wrap(operationId: "getPage", keyParams: ["pageId": "home"], ttlSeconds: nil, bypass: false) {
                let n = await counter.next()
                return n == 1 ? await gate1.wait() : await gate2.wait()
            }
        }

        await gate1.waitUntilEntered()
        await cache.clear()
        await gate1.release("gen1")

        await gate2.waitUntilEntered()
        await cache.clear()
        await gate2.release("gen2")

        do {
            _ = try await pending.value
            XCTFail("Expected DiscovrCacheStaleGenerationError")
        } catch is DiscovrCacheStaleGenerationError {
            // expected
        }
        let calls = await counter.count
        XCTAssertEqual(calls, 2)
    }

    func testClearForSnapshotSkipsDuplicateForAlreadyMarkedSnapshot() async throws {
        let cache = _DiscovrCache()
        let counter = Counter()

        await cache.clearAndMarkSnapshot("snap1")
        let first = try await cache.wrap(operationId: "getPage", keyParams: ["pageId": "home"], ttlSeconds: nil, bypass: false) {
            "v\(await counter.next())"
        }
        XCTAssertEqual(first, "v1")

        // Duplicate delayed event for snap1 is a no-op; cached entry survives.
        await cache.clearForSnapshot("snap1")
        let stillCached = try await cache.wrap(operationId: "getPage", keyParams: ["pageId": "home"], ttlSeconds: nil, bypass: false) {
            "v\(await counter.next())"
        }
        XCTAssertEqual(stillCached, "v1")

        // Genuine move to snap2 clears the cache.
        await cache.clearForSnapshot("snap2")
        let refreshed = try await cache.wrap(operationId: "getPage", keyParams: ["pageId": "home"], ttlSeconds: nil, bypass: false) {
            "v\(await counter.next())"
        }
        XCTAssertEqual(refreshed, "v2")
    }
}
