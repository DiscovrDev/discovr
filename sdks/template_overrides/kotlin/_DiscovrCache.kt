/**
 * `_DiscovrCache` — in-memory, session-level response cache for the generated
 * SDK base.
 *
 * Which operations flow through [wrap] (and with what TTL) is decided
 * entirely by the OpenAPI spec's `x-cache-policy`/`x-cache-invalidates`
 * extensions, parsed by `public/scripts/facade/parse-openapi.ts` and baked into
 * the generated `_DiscovrClientBase` at build time.
 *
 * One instance per `DiscovrClient`; never shared or persisted across clients,
 * processes, or devices. It only sees calls made through *this* client
 * instance, so it can't detect a write made by another device or SDK instance
 * sharing the same profile — the same limitation the auth layer already has
 * for local session state.
 *
 * Do not use this class directly — it's wired up automatically by
 * [DiscovrClient].
 */

package api.discovr

import kotlin.time.Clock
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withTimeout

private const val MAX_ENTRIES = 200

/** Fetches that hang longer than this are treated as failed, freeing the key for retry. */
private const val DEFAULT_TIMEOUT_MS = 30_000L

private data class CacheEntry(val value: Any?, val expiresAt: Long?)

/**
 * Thrown when a [_DiscovrCache.clear] (profile switch, sign-out, session
 * refresh) lands while this call's fetch was in flight — its result belongs
 * to a superseded generation and may be the wrong profile's data. Callers
 * that still need the data should retry, which will run under the new
 * generation and hit whatever cache state is current now.
 */
class DiscovrCacheStaleGenerationException(
    message: String = "_DiscovrCache: cache cleared while fetch was in flight",
) : IllegalStateException(message)

class _DiscovrCache(
    private val enabled: Boolean = true,
    /** Max time to wait on a fetcher before treating it as failed. Defaults to 30s. */
    private val timeoutMs: Long = DEFAULT_TIMEOUT_MS,
) {
    private val mutex = Mutex()
    private val entries = LinkedHashMap<String, CacheEntry>()
    private val inFlight = HashMap<String, CompletableDeferred<Any?>>()

    /**
     * Bumped on every [clear]. A fetch started before a clear() (profile
     * switch, sign-out, session refresh) must not write its result into the
     * cache after the clear lands — that would resurrect stale, wrong-session
     * data. Each in-flight fetch captures the generation it started under and
     * only commits to `entries` if the generation hasn't moved on. Always
     * read/written under [mutex], same as `entries`/`inFlight`.
     */
    private var generation = 0

    private data class Slot(val deferred: CompletableDeferred<Any?>, val isLeader: Boolean)

    /**
     * Cache-or-fetch a single operation call, deduping concurrent identical
     * in-flight requests along the way (so a tight accidental loop over the
     * same params costs one network call, not N).
     *
     * The cached-value check, the in-flight lookup, and registering this call
     * as the "leader" that will actually fetch all happen inside a single
     * [Mutex.withLock] critical section — splitting that across separate lock
     * acquisitions would let two concurrent callers both see no pending fetch
     * and both register their own, firing duplicate network calls.
     *
     * @param ttlMs `null` means cache for the life of the session (until
     *   invalidated or [clear]ed); a value caches for that many ms.
     * @param bypass Skip the cache read (and any in-flight dedup) for this
     *   call, but still refresh the stored entry with the result — a "force
     *   refresh" that also warms the cache for the next normal call.
     */
    @Suppress("UNCHECKED_CAST")
    suspend fun <T> wrap(
        operationId: String,
        keyParams: Map<String, Any?>,
        ttlMs: Long?,
        bypass: Boolean,
        fetcher: suspend () -> T,
    ): T {
        if (!enabled) return fetcher()

        val key = buildKey(operationId, keyParams)
        val now = Clock.System.now().toEpochMilliseconds()

        if (bypass) {
            val startGeneration = mutex.withLock { generation }
            val value = fetchWithTimeout(fetcher)
            mutex.withLock {
                if (generation == startGeneration) {
                    entries[key] = CacheEntry(value, ttlMs?.let { now + it })
                    evictIfNeeded()
                }
            }
            return value
        }

        var startGeneration = 0
        val slot = mutex.withLock {
            startGeneration = generation
            val cached = entries[key]
            if (cached != null && (cached.expiresAt == null || cached.expiresAt > now)) {
                return cached.value as T
            }
            val pending = inFlight[key]
            if (pending != null) {
                Slot(pending, isLeader = false)
            } else {
                val d = CompletableDeferred<Any?>()
                inFlight[key] = d
                Slot(d, isLeader = true)
            }
        }

        if (!slot.isLeader) {
            return slot.deferred.await() as T
        }

        return try {
            val value = fetchWithTimeout(fetcher)
            val stillCurrent = mutex.withLock {
                if (generation == startGeneration) {
                    entries[key] = CacheEntry(value, ttlMs?.let { now + it })
                    evictIfNeeded()
                    true
                } else {
                    false
                }
            }
            if (!stillCurrent) {
                // A clear() (profile switch, sign-out, session refresh) landed
                // while this fetch was in flight — this result belongs to a
                // superseded generation, possibly the wrong profile's data.
                // Fail rather than complete so any follower awaiting this same
                // deferred doesn't get handed stale data; it'll fall through to
                // a fresh fetch under the new generation on its next call.
                val staleError = DiscovrCacheStaleGenerationException()
                slot.deferred.completeExceptionally(staleError)
                throw staleError
            }
            slot.deferred.complete(value)
            value
        } catch (e: Throwable) {
            slot.deferred.completeExceptionally(e)
            throw e
        } finally {
            // Only remove if `inFlight[key]` is still *this* registration — a
            // clear() may have wiped the map and a new caller may have already
            // registered its own deferred under the same key in the meantime.
            // Deleting unconditionally would drop that new caller's entry.
            mutex.withLock { if (inFlight[key] === slot.deferred) inFlight.remove(key) }
        }
    }

    /** Purge every cached entry for the given operationIds (all param variants). */
    suspend fun invalidate(operationIds: List<String>) {
        if (operationIds.isEmpty()) return
        val prefixes = operationIds.map { "$it::" }
        mutex.withLock {
            entries.keys.removeAll { key -> prefixes.any { prefix -> key.startsWith(prefix) } }
        }
    }

    /** Full wipe — called on profile switch, sign-out, and session rotation. */
    suspend fun clear() {
        mutex.withLock {
            generation++
            entries.clear()
            inFlight.clear()
        }
    }

    private suspend fun <T> fetchWithTimeout(fetcher: suspend () -> T): T {
        if (timeoutMs <= 0) return fetcher()
        return withTimeout(timeoutMs) { fetcher() }
    }

    private fun evictIfNeeded() {
        while (entries.size > MAX_ENTRIES) {
            val oldestKey = entries.keys.firstOrNull() ?: break
            entries.remove(oldestKey)
        }
    }

    private fun buildKey(operationId: String, keyParams: Map<String, Any?>): String {
        // JSON-style escaping so values containing the field/entry separators
        // (commas, colons, quotes) can't produce ambiguous/colliding keys for
        // otherwise-different param sets.
        val serialized = keyParams.entries
            .sortedBy { it.key }
            .joinToString(",", prefix = "{", postfix = "}") { (k, v) -> "${jsonString(k)}:${jsonString(v?.toString())}" }
        return "$operationId::$serialized"
    }

    private fun jsonString(value: String?): String {
        if (value == null) return "null"
        val escaped = value.replace("\\", "\\\\").replace("\"", "\\\"")
        return "\"$escaped\""
    }
}
