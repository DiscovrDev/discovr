/// `_RequestLoopGuard` — client-side circuit breaker for runaway request loops.
///
/// ## What this is for
///
/// The overwhelmingly common cause of a client hammering an API is not abuse,
/// it's a bug: a SwiftUI view that refetches on every body evaluation, a retry
/// without backoff, a `task` modifier with an unstable id. Without a guard the
/// developer discovers this as a wall of `429`s — long after thousands of
/// requests have already been sent, and with nothing pointing at the line of
/// code responsible.
///
/// This guard turns that into an immediate, obvious failure at the call site.
///
/// ## It fails CLOSED, deliberately
///
/// When the threshold trips, the request is **not sent** — the guard throws
/// before dispatch and keeps refusing for a cooldown. It does not warn and
/// proceed. A guard that logged but still made the call would leave the actual
/// problem (traffic hitting the server) completely unsolved.
///
/// ## What this is NOT
///
/// Not a security control, and not a substitute for server-side rate limiting.
/// It lives in the caller's own process and any client can simply not use the
/// SDK. Server-side limits remain the real boundary; this is a developer-
/// experience safety net on top of them.

import Foundation

/// Tuning for ``_RequestLoopGuard``. Defaults are sized so that no realistic UI
/// burst trips the breaker while a genuine loop trips it almost immediately.
public struct LoopGuardConfig: Sendable {
    /// Requests allowed within ``windowMs`` before the breaker trips. Far above
    /// any sane burst (a screen might fire a dozen calls on appear), far below
    /// what a runaway loop reaches in a second.
    public var maxRequests: Int
    /// Sliding window width, milliseconds.
    public var windowMs: Int
    /// How long the breaker stays open once tripped, milliseconds. A cooldown
    /// rather than a permanent stop, so a genuine burst doesn't disable the
    /// client for the rest of its life.
    public var cooldownMs: Int
    /// Set `false` to disable entirely. For legitimately high-throughput
    /// integrations (bulk backfills, server-side batch jobs) where the default
    /// threshold would be a false positive.
    public var enabled: Bool

    public init(
        maxRequests: Int = 100,
        windowMs: Int = 10_000,
        cooldownMs: Int = 30_000,
        enabled: Bool = true
    ) {
        self.maxRequests = maxRequests
        self.windowMs = windowMs
        self.cooldownMs = cooldownMs
        self.enabled = enabled
    }
}

/// Thrown when the loop guard blocks a request because call volume looks like
/// an unintentional loop.
///
/// Distinct from a server `429`: this request never left the process. Seeing it
/// means the fix is in your own code — a view refetching on every body
/// evaluation, or a retry without backoff — not a server quota to wait out.
public struct RequestLoopError: Error, Sendable {
    public let message: String
    /// Roughly how long until requests are allowed again, in seconds.
    public let retryInSeconds: Int
}

/// An `actor` rather than a plain class with a lock.
///
/// Unlike the TypeScript guard — which runs on a single-threaded event loop and
/// needs no synchronisation — a Swift client fans requests out across
/// concurrent tasks. Concurrent `check` calls would otherwise race on the
/// timestamp buffer and undercount, which for a *loop* guard is exactly the
/// situation it exists to catch. Actor isolation gives that serialisation for
/// free and satisfies Swift 6 strict concurrency without `@unchecked Sendable`.
internal actor _RequestLoopGuard {
    private let config: LoopGuardConfig

    /// Timestamps (ms since epoch) of recent requests, oldest first.
    private var timestamps: [Int] = []

    /// When the breaker closes again, or nil while it is closed.
    private var openUntil: Int?

    init(config: LoopGuardConfig = LoopGuardConfig()) {
        self.config = config
    }

    /// Record an outbound request and throw if it looks like a loop.
    ///
    /// Call **before** dispatching. `description` is echoed in the error so the
    /// developer sees which call was being repeated.
    func check(_ description: String) throws {
        guard config.enabled else { return }

        let now = Int(Date().timeIntervalSince1970 * 1000)

        if let open = openUntil {
            if now < open {
                throw buildError(description, retryInSeconds: ceilDivide(open - now, 1000))
            }
            // Cooldown elapsed — close the breaker and start counting fresh, so
            // the caller gets a clean window rather than instantly re-tripping
            // on stale timestamps.
            openUntil = nil
            timestamps.removeAll(keepingCapacity: true)
        }

        let cutoff = now - config.windowMs
        // Timestamps are appended in order, so dropping the expired prefix is
        // enough — no need to scan the whole buffer.
        if let firstLive = timestamps.firstIndex(where: { $0 > cutoff }) {
            if firstLive > 0 { timestamps.removeFirst(firstLive) }
        } else {
            timestamps.removeAll(keepingCapacity: true)
        }

        timestamps.append(now)

        if timestamps.count > config.maxRequests {
            openUntil = now + config.cooldownMs
            throw buildError(description, retryInSeconds: ceilDivide(config.cooldownMs, 1000))
        }
    }

    /// Clear all state. Intended for tests and for an explicit caller reset.
    func reset() {
        timestamps.removeAll()
        openUntil = nil
    }

    private func ceilDivide(_ value: Int, _ divisor: Int) -> Int {
        (value + divisor - 1) / divisor
    }

    private func buildError(_ description: String, retryInSeconds: Int) -> RequestLoopError {
        RequestLoopError(
            message: """
                Blocked "\(description)": more than \(config.maxRequests) requests in \
                \(config.windowMs / 1000)s. This almost always means an unintentional request \
                loop — check for a view refetching on every body evaluation, or a retry without \
                backoff. The request was NOT sent. Requests resume in ~\(retryInSeconds)s. If \
                this is legitimate high-volume traffic, raise or disable the limit via the \
                "loopGuard" client option.
                """,
            retryInSeconds: retryInSeconds
        )
    }
}
