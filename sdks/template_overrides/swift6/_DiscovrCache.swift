/// `_DiscovrCache` — in-memory, session-level response cache for the generated
/// SDK base.
///
/// Which operations flow through ``wrap(operationId:keyParams:ttlSeconds:bypass:fetcher:)``
/// (and with what TTL) is decided entirely by the OpenAPI spec's
/// `x-cache-policy`/`x-cache-invalidates` extensions, parsed by
/// `public/scripts/facade/parse-openapi.ts` and baked into the generated
/// `_DiscovrClientBase` at build time.
///
/// One instance per `DiscovrClient`; never shared or persisted across clients,
/// processes, or devices. It only sees calls made through *this* client
/// instance, so it can't detect a write made by another device or SDK instance
/// sharing the same profile — the same limitation the auth layer already has
/// for local session state.
///
/// Do not use this actor directly — it's wired up automatically by
/// `DiscovrClient`.

import Foundation

private let maxEntries = 200

private struct CacheEntry {
    let value: Any
    /// `nil` = no TTL — live until explicitly invalidated or the cache is cleared.
    let expiresAt: Double?
}

/// Type-erased box for an in-flight fetch's result. `Any` itself can't cross
/// the actor boundary — `Task<Any, Error>.value` doesn't typecheck under
/// strict concurrency, since `Any` could box a non-Sendable value. `wrap()`'s
/// `T: Sendable` constraint guarantees every value actually boxed here is
/// Sendable at the point of creation, so the `@unchecked` is safe by
/// construction, not just asserted.
private struct AnyBox: @unchecked Sendable {
    let value: Any
}

/// Thrown by ``_DiscovrCache/wrap(operationId:keyParams:ttlSeconds:bypass:fetcher:)`` when a
/// fetcher doesn't complete within its configured timeout.
public struct DiscovrCacheTimeoutError: Error, Sendable {
    public let timeoutSeconds: Double
}

/// Thrown when a ``_DiscovrCache/clear()`` (profile switch, sign-out, session
/// refresh) lands while this call's fetch was in flight — its result belongs
/// to a superseded generation and may be the wrong profile's data. Callers
/// that still need the data should retry, which will run under the new
/// generation and hit whatever cache state is current now.
public struct DiscovrCacheStaleGenerationError: Error, Sendable {}

public actor _DiscovrCache {
    private let enabled: Bool
    /// Fetches that hang longer than this are treated as failed, freeing the key for retry.
    private let timeoutSeconds: Double
    private var entries: [String: CacheEntry] = [:]
    /// Insertion order, for FIFO eviction once `maxEntries` is exceeded.
    private var insertionOrder: [String] = []
    private var inFlight: [String: (task: Task<AnyBox, Error>, token: UInt64)] = [:]
    /// Tags each in-flight registration so its own cleanup can tell whether
    /// it's still the current occupant of `inFlight[key]` before removing it
    /// — see the identity check in `wrap()`'s cleanup path.
    private var inFlightToken: UInt64 = 0

    /// Bumped on every ``clear()``. A fetch started before a clear() (profile
    /// switch, sign-out, session refresh) must not write its result into the
    /// cache after the clear lands — that would resurrect stale, wrong-session
    /// data. Each in-flight fetch captures the generation it started under and
    /// only commits to `entries` if the generation hasn't moved on. Reading a
    /// suspended `await` can interleave with `clear()` even inside an actor,
    /// since actor isolation only serializes work *between* suspension points.
    private var generation = 0

    public init(enabled: Bool = true, timeoutSeconds: Double = 30) {
        self.enabled = enabled
        self.timeoutSeconds = timeoutSeconds
    }

    /// Cache-or-fetch a single operation call, deduping concurrent identical
    /// in-flight requests along the way (so a tight accidental loop over the
    /// same params costs one network call, not N).
    ///
    /// - Parameters:
    ///   - ttlSeconds: `nil` means cache for the life of the session (until
    ///     invalidated or ``clear()``ed); a value caches for that many seconds.
    ///   - bypass: Skip the cache read (and any in-flight dedup) for this
    ///     call, but still refresh the stored entry with the result — a
    ///     "force refresh" that also warms the cache for the next normal call.
    public func wrap<T: Sendable>(
        operationId: String,
        keyParams: [String: String],
        ttlSeconds: Double?,
        bypass: Bool,
        fetcher: @Sendable @escaping () async throws -> T
    ) async throws -> T {
        guard enabled else { return try await fetcher() }

        let key = buildKey(operationId: operationId, keyParams: keyParams)
        let now = Date().timeIntervalSince1970
        let startGeneration = generation

        if !bypass {
            if let cached = entries[key], cached.expiresAt == nil || cached.expiresAt! > now {
                // Safe: `key` is namespaced per-operationId, so every entry under it
                // was produced by this same generic `T` at its call site.
                return cached.value as! T
            }
            if let pending = inFlight[key] {
                let value = try await pending.task.value.value
                // A clear() may have landed between this call joining the
                // in-flight fetch and it resolving — don't hand back a result
                // that may belong to a superseded (possibly wrong-profile)
                // generation just because we deduped onto someone else's fetch.
                guard generation == startGeneration else {
                    throw DiscovrCacheStaleGenerationError()
                }
                return value as! T
            }
        }

        let timeoutSeconds = self.timeoutSeconds
        let task = Task<AnyBox, Error> {
            AnyBox(value: try await Self.fetchWithTimeout(timeoutSeconds: timeoutSeconds, fetcher: fetcher))
        }
        inFlightToken += 1
        let myToken = inFlightToken
        if !bypass { inFlight[key] = (task, myToken) }

        do {
            let value = try await task.value.value
            // Only remove if `inFlight[key]` is still *this* registration — a
            // clear() may have wiped the map and a new caller may have already
            // registered its own task under the same key in the meantime.
            // Deleting unconditionally would drop that new caller's entry.
            if !bypass, inFlight[key]?.token == myToken { inFlight[key] = nil }
            // If no clear() landed while this fetch was in flight, commit and
            // return normally. Otherwise this result belongs to a superseded
            // (possibly wrong-profile) generation — throw instead of returning
            // it, so any follower that deduped onto this same task doesn't get
            // handed stale data either.
            guard generation == startGeneration else {
                throw DiscovrCacheStaleGenerationError()
            }
            entries[key] = CacheEntry(value: value, expiresAt: ttlSeconds.map { now + $0 })
            insertionOrder.append(key)
            evictIfNeeded()
            return value as! T
        } catch {
            if !bypass, inFlight[key]?.token == myToken { inFlight[key] = nil }
            throw error
        }
    }

    /// Purge every cached entry for the given operationIds (all param variants).
    public func invalidate(_ operationIds: [String]) {
        guard !operationIds.isEmpty else { return }
        let prefixes = operationIds.map { "\($0)::" }
        for key in Array(entries.keys) where prefixes.contains(where: { key.hasPrefix($0) }) {
            entries.removeValue(forKey: key)
        }
        insertionOrder.removeAll { !entries.keys.contains($0) }
    }

    /// Full wipe — called on profile switch, sign-out, and session rotation.
    public func clear() {
        generation += 1
        entries.removeAll()
        insertionOrder.removeAll()
        inFlight.removeAll()
    }

    private static func fetchWithTimeout<T: Sendable>(
        timeoutSeconds: Double,
        fetcher: @Sendable @escaping () async throws -> T
    ) async throws -> T {
        guard timeoutSeconds > 0 else { return try await fetcher() }
        return try await withThrowingTaskGroup(of: T.self) { group in
            group.addTask { try await fetcher() }
            group.addTask {
                try await Task.sleep(nanoseconds: UInt64(timeoutSeconds * 1_000_000_000))
                throw DiscovrCacheTimeoutError(timeoutSeconds: timeoutSeconds)
            }
            defer { group.cancelAll() }
            guard let result = try await group.next() else {
                throw DiscovrCacheTimeoutError(timeoutSeconds: timeoutSeconds)
            }
            return result
        }
    }

    private func evictIfNeeded() {
        while entries.count > maxEntries, !insertionOrder.isEmpty {
            let oldest = insertionOrder.removeFirst()
            entries.removeValue(forKey: oldest)
        }
    }

    private func buildKey(operationId: String, keyParams: [String: String]) -> String {
        // JSON-style escaping so values containing the field/entry separators
        // (commas, colons, quotes) can't produce ambiguous/colliding keys for
        // otherwise-different param sets.
        let serialized = keyParams.keys.sorted()
            .map { "\(jsonString($0)):\(jsonString(keyParams[$0]))" }
            .joined(separator: ",")
        return "\(operationId)::{\(serialized)}"
    }

    private func jsonString(_ value: String?) -> String {
        guard let value else { return "null" }
        let escaped = value.replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\"", with: "\\\"")
        return "\"\(escaped)\""
    }
}
