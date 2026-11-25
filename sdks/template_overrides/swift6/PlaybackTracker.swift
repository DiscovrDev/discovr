/// `PlaybackTracker` — percentage-first, source-independent playback scrobbler.
///
/// Create one per watched movie or episode via ``DiscovrClient/trackPlayback(_:tv:after:onError:onCompleted:heartbeatInterval:)``.
/// Report player lifecycle events (`start`, `update`, `pause`, `resume`, `seek`,
/// `stop` / `finish`); the tracker owns the 30-second heartbeat throttle, strict
/// serial FIFO ordering, episode handoff (`after:`), once-only terminal teardown
/// protection, pause/resume deduplication, and graceful 429 / transient retry.
///
/// Percentage (`0–100`) is the primary unit everywhere and the tracker never
/// caches a fixed `duration` across calls (different media sources can have
/// different runtimes, and streams may switch mid-watch). Callers holding a
/// `(position, duration)` pair for the *current* stream may use the
/// `position:duration:` overloads; calls with `duration <= 0` or non-finite
/// values are safely ignored instead of overwriting resume position with `0%`.

import Foundation

public final class PlaybackTracker: Sendable {
    public static let defaultHeartbeatInterval: TimeInterval = 30

    private static let maxTerminalRetries = 2
    private static let maxTerminalRetryWaitSeconds = 60
    private static let maxBackoffSeconds = 300
    private static let transientBaseDelaySeconds: TimeInterval = 1

    private enum EventKind {
        case heartbeat
        case transition
        case terminal
    }

    private struct QueuedEvent {
        let kind: EventKind
        var progress: Double
    }

    private final class State: @unchecked Sendable {
        let lock = NSLock()
        var started = false
        var ended = false
        var paused = false
        var completedNotified = false
        var lastScrobbleAt: TimeInterval = -.infinity
        var backoffUntil: TimeInterval = -.infinity
        var awaitedPredecessor = false
        var queue: [QueuedEvent] = []
        var workerRunning = false
        var terminalResolved = false
        var terminalResult: ScrobbleResponse?
        var terminalWaiters: [CheckedContinuation<ScrobbleResponse?, Never>] = []
        var flushWaiters: [CheckedContinuation<Void, Never>] = []

        func withLock<T>(_ body: () -> T) -> T {
            lock.lock()
            defer { lock.unlock() }
            return body()
        }
    }

    private let mediaRefOrId: String
    private let tv: EpisodeRef?
    private let after: PlaybackTracker?
    private let onError: (@Sendable (Error) -> Void)?
    private let onCompleted: (@Sendable (ScrobbleResponse) -> Void)?
    private let heartbeatInterval: TimeInterval
    private let send: @Sendable (String, Double, EpisodeRef?) async throws -> ScrobbleResponse
    private let now: @Sendable () -> TimeInterval
    private let sleep: @Sendable (TimeInterval) async -> Void
    private let state = State()

    internal init(
        mediaRefOrId: String,
        tv: EpisodeRef? = nil,
        after: PlaybackTracker? = nil,
        onError: (@Sendable (Error) -> Void)? = nil,
        onCompleted: (@Sendable (ScrobbleResponse) -> Void)? = nil,
        heartbeatInterval: TimeInterval = PlaybackTracker.defaultHeartbeatInterval,
        send: @escaping @Sendable (String, Double, EpisodeRef?) async throws -> ScrobbleResponse,
        now: @escaping @Sendable () -> TimeInterval = { Date().timeIntervalSince1970 },
        sleep: @escaping @Sendable (TimeInterval) async -> Void = { seconds in
            let ns = UInt64(max(0, seconds) * 1_000_000_000)
            try? await Task.sleep(nanoseconds: ns)
        }
    ) {
        self.mediaRefOrId = mediaRefOrId
        self.tv = tv
        self.after = after
        self.onError = onError
        self.onCompleted = onCompleted
        self.heartbeatInterval = heartbeatInterval
        self.send = send
        self.now = now
        self.sleep = sleep
    }

    // MARK: - Primary percentage API (0–100)

    /// Report playback start at a percentage (`0–100`).
    public func start(progress: Double) {
        guard let p = Self.sanitizeProgress(progress) else { return }
        enqueueStart(p)
    }

    /// Report ongoing playback progress (`0–100`). Safe to call every second —
    /// throttled to 30 seconds by default, coalesced when queued behind an
    /// in-flight request, and paused during 429 backoff.
    public func update(progress: Double) {
        guard let p = Self.sanitizeProgress(progress) else { return }
        enqueueUpdate(p)
    }

    /// Report playback pause at a percentage (`0–100`). Deduplicated; sends immediately.
    public func pause(progress: Double) {
        guard let p = Self.sanitizeProgress(progress) else { return }
        enqueuePause(p)
    }

    /// Report playback resume at a percentage (`0–100`). Deduplicated; sends immediately.
    public func resume(progress: Double) {
        guard let p = Self.sanitizeProgress(progress) else { return }
        enqueueResume(p)
    }

    /// Report a seek to a percentage (`0–100`). Sends immediately and resets heartbeat timer.
    public func seek(progress: Double) {
        guard let p = Self.sanitizeProgress(progress) else { return }
        enqueueSeek(p)
    }

    /// Report playback stop at the viewer's final percentage (`0–100`).
    /// Idempotent once-only: subsequent calls to `stop` or `finish` do not send
    /// again and return the first terminal result.
    @discardableResult
    public func stop(progress: Double) async -> ScrobbleResponse? {
        await submitTerminal(Self.sanitizeProgress(progress))
    }

    /// Report that the movie or episode played to completion (`100%`).
    /// Idempotent once-only: subsequent calls to `finish` or `stop` do not send
    /// again and return the first terminal result.
    @discardableResult
    public func finish() async -> ScrobbleResponse? {
        await submitTerminal(100)
    }

    // MARK: - Per-call (position, duration) convenience overloads

    /// Report playback start from current stream `(position, duration)`. No-ops if `duration <= 0` or non-finite.
    public func start(position: Double, duration: Double) {
        guard let p = Self.progressFromTime(position: position, duration: duration) else { return }
        enqueueStart(p)
    }

    /// Report ongoing playback from current stream `(position, duration)`. No-ops if `duration <= 0` or non-finite.
    public func update(position: Double, duration: Double) {
        guard let p = Self.progressFromTime(position: position, duration: duration) else { return }
        enqueueUpdate(p)
    }

    /// Report playback pause from current stream `(position, duration)`. No-ops if `duration <= 0` or non-finite.
    public func pause(position: Double, duration: Double) {
        guard let p = Self.progressFromTime(position: position, duration: duration) else { return }
        enqueuePause(p)
    }

    /// Report playback resume from current stream `(position, duration)`. No-ops if `duration <= 0` or non-finite.
    public func resume(position: Double, duration: Double) {
        guard let p = Self.progressFromTime(position: position, duration: duration) else { return }
        enqueueResume(p)
    }

    /// Report a seek from current stream `(position, duration)`. No-ops if `duration <= 0` or non-finite.
    public func seek(position: Double, duration: Double) {
        guard let p = Self.progressFromTime(position: position, duration: duration) else { return }
        enqueueSeek(p)
    }

    /// Report playback stop from current stream `(position, duration)`.
    /// Safely skips sending (still marks ended and drains queue) if `duration <= 0` or non-finite.
    @discardableResult
    public func stop(position: Double, duration: Double) async -> ScrobbleResponse? {
        await submitTerminal(Self.progressFromTime(position: position, duration: duration))
    }

    /// Wait until all currently queued scrobbles on this tracker have completed.
    public func flush() async {
        let shouldWaitPredecessor = state.withLock { !state.awaitedPredecessor && after != nil }
        if shouldWaitPredecessor, let after {
            await after.flush()
        }
        await withCheckedContinuation { (continuation: CheckedContinuation<Void, Never>) in
            let resumeImmediately = state.withLock { () -> Bool in
                if !state.workerRunning && state.queue.isEmpty {
                    return true
                }
                state.flushWaiters.append(continuation)
                return false
            }
            if resumeImmediately {
                continuation.resume()
            }
        }
    }

    // MARK: - Internals

    internal static func sanitizeProgress(_ progress: Double) -> Double? {
        guard progress.isFinite else { return nil }
        return min(100, max(0, progress))
    }

    internal static func progressFromTime(position: Double, duration: Double) -> Double? {
        guard position.isFinite, duration.isFinite, duration > 0 else { return nil }
        return sanitizeProgress((position / duration) * 100)
    }

    private static func isTransientError(_ error: Error) -> Bool {
        if error is AuthError {
            return false // AuthError (including rateLimited, handled separately) is not transient
        }
        if case let ErrorResponse.error(status, _, _, _) = error {
            return status >= 500 || status == 408 || status < 0
        }
        if error is URLError {
            return true
        }
        return false
    }

    private func enqueueStart(_ progress: Double) {
        let ts = now()
        let startWorker = state.withLock { () -> Bool in
            guard !state.ended else { return false }
            state.started = true
            state.paused = false
            state.lastScrobbleAt = ts
            return appendLocked(QueuedEvent(kind: .transition, progress: progress))
        }
        if startWorker { launchWorker() }
    }

    private func enqueueUpdate(_ progress: Double) {
        let ts = now()
        let startWorker = state.withLock { () -> Bool in
            guard !state.ended, !state.paused else { return false }
            guard ts >= state.backoffUntil else { return false }
            if state.started, ts - state.lastScrobbleAt < heartbeatInterval {
                return false
            }
            state.started = true
            state.lastScrobbleAt = ts
            return appendLocked(QueuedEvent(kind: .heartbeat, progress: progress))
        }
        if startWorker { launchWorker() }
    }

    private func enqueuePause(_ progress: Double) {
        let ts = now()
        let startWorker = state.withLock { () -> Bool in
            guard !state.ended, !state.paused else { return false }
            state.started = true
            state.paused = true
            state.lastScrobbleAt = ts
            return appendLocked(QueuedEvent(kind: .transition, progress: progress))
        }
        if startWorker { launchWorker() }
    }

    private func enqueueResume(_ progress: Double) {
        let ts = now()
        let startWorker = state.withLock { () -> Bool in
            guard !state.ended else { return false }
            if state.started && !state.paused { return false }
            state.started = true
            state.paused = false
            state.lastScrobbleAt = ts
            return appendLocked(QueuedEvent(kind: .transition, progress: progress))
        }
        if startWorker { launchWorker() }
    }

    private func enqueueSeek(_ progress: Double) {
        let ts = now()
        let startWorker = state.withLock { () -> Bool in
            guard !state.ended else { return false }
            state.started = true
            state.lastScrobbleAt = ts
            return appendLocked(QueuedEvent(kind: .transition, progress: progress))
        }
        if startWorker { launchWorker() }
    }

    private func submitTerminal(_ progress: Double?) async -> ScrobbleResponse? {
        return await withCheckedContinuation { (continuation: CheckedContinuation<ScrobbleResponse?, Never>) in
            enum Action {
                case immediate(ScrobbleResponse?)
                case startWorker
                case waitOnly
                case drainWithoutSend
            }

            let action = state.withLock { () -> Action in
                if state.ended {
                    if state.terminalResolved {
                        return .immediate(state.terminalResult)
                    }
                    state.terminalWaiters.append(continuation)
                    return .waitOnly
                }
                state.ended = true
                state.paused = true
                if let progress {
                    state.queue.removeAll { $0.kind == .heartbeat }
                    state.terminalWaiters.append(continuation)
                    let shouldStart = appendLocked(QueuedEvent(kind: .terminal, progress: progress))
                    return shouldStart ? .startWorker : .waitOnly
                } else {
                    // Invalid/zero duration on stop: drain existing queue without sending 0%.
                    if !state.workerRunning && state.queue.isEmpty && (state.awaitedPredecessor || after == nil) {
                        state.terminalResolved = true
                        state.terminalResult = nil
                        return .immediate(nil)
                    }
                    state.terminalWaiters.append(continuation)
                    return .drainWithoutSend
                }
            }

            switch action {
            case .immediate(let response):
                continuation.resume(returning: response)
            case .startWorker:
                launchWorker()
            case .waitOnly:
                break
            case .drainWithoutSend:
                Task {
                    await self.flush()
                    let waiters = self.state.withLock { () -> [CheckedContinuation<ScrobbleResponse?, Never>] in
                        if !self.state.terminalResolved {
                            self.state.terminalResolved = true
                            self.state.terminalResult = nil
                        }
                        let w = self.state.terminalWaiters
                        self.state.terminalWaiters.removeAll()
                        return w
                    }
                    for w in waiters { w.resume(returning: nil) }
                }
            }
        }
    }

    /// Must be called while holding `state.lock`. Returns `true` if the caller
    /// should launch the serial worker task.
    private func appendLocked(_ event: QueuedEvent) -> Bool {
        if event.kind == .heartbeat, let last = state.queue.last, last.kind == .heartbeat {
            state.queue[state.queue.count - 1].progress = event.progress
            return false
        }
        state.queue.append(event)
        if !state.workerRunning {
            state.workerRunning = true
            return true
        }
        return false
    }

    private func launchWorker() {
        Task {
            await self.drainLoop()
        }
    }

    private func drainLoop() async {
        let shouldWaitPredecessor = state.withLock { () -> Bool in
            if state.awaitedPredecessor { return false }
            state.awaitedPredecessor = true
            return after != nil
        }
        if shouldWaitPredecessor, let after {
            await after.flush()
        }

        while true {
            enum LoopStep {
                case event(QueuedEvent)
                case done([CheckedContinuation<Void, Never>], [CheckedContinuation<ScrobbleResponse?, Never>], ScrobbleResponse?)
            }

            let step: LoopStep = state.withLock {
                if state.queue.isEmpty {
                    state.workerRunning = false
                    let f = state.flushWaiters
                    state.flushWaiters.removeAll()
                    if state.ended && !state.terminalResolved {
                        state.terminalResolved = true
                        state.terminalResult = nil
                    }
                    let t = state.terminalResolved ? state.terminalWaiters : []
                    if state.terminalResolved {
                        state.terminalWaiters.removeAll()
                    }
                    return .done(f, t, state.terminalResult)
                }
                return .event(state.queue.removeFirst())
            }

            switch step {
            case .done(let flushWaiters, let terminalWaiters, let resolvedResult):
                for f in flushWaiters { f.resume() }
                for t in terminalWaiters { t.resume(returning: resolvedResult) }
                return
            case .event(let event):
                let delivered = await deliver(event)
                if event.kind == .terminal {
                    let waiters = state.withLock { () -> [CheckedContinuation<ScrobbleResponse?, Never>] in
                        state.terminalResolved = true
                        state.terminalResult = delivered
                        let w = state.terminalWaiters
                        state.terminalWaiters.removeAll()
                        return w
                    }
                    for w in waiters { w.resume(returning: delivered) }
                }
            }
        }
    }

    private func deliver(_ event: QueuedEvent) async -> ScrobbleResponse? {
        let maxAttempts = event.kind == .terminal ? Self.maxTerminalRetries + 1 : 1

        for attempt in 0..<maxAttempts {
            do {
                let response = try await send(mediaRefOrId, event.progress, tv)
                if response.completed {
                    let shouldNotify = state.withLock { () -> Bool in
                        if state.completedNotified { return false }
                        state.completedNotified = true
                        return true
                    }
                    if shouldNotify {
                        onCompleted?(response)
                    }
                }
                return response
            } catch let AuthError.rateLimited(retryInSeconds) {
                let retrySec = min(Self.maxBackoffSeconds, max(1, retryInSeconds))
                let until = now() + TimeInterval(retrySec)
                state.withLock { state.backoffUntil = until }

                if event.kind == .terminal, attempt + 1 < maxAttempts {
                    let waitSec = min(retrySec, Self.maxTerminalRetryWaitSeconds)
                    await sleep(TimeInterval(waitSec))
                    continue
                }
                onError?(AuthError.rateLimited(retryInSeconds: retryInSeconds))
                return nil
            } catch {
                if event.kind == .terminal, Self.isTransientError(error), attempt + 1 < maxAttempts {
                    let delay = Self.transientBaseDelaySeconds * Double(1 << attempt)
                    await sleep(delay)
                    continue
                }
                onError?(error)
                return nil
            }
        }
        return nil
    }
}
