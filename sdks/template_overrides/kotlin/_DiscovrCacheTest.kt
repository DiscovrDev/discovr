package api.discovr

import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitCancellation
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.supervisorScope
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.yield
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class DiscovrCacheTest {

    @Test
    fun cachesBySessionPolicy_repeatCallsDontRefetch() = runTest {
        val cache = _DiscovrCache()
        var calls = 0
        val fetcher: suspend () -> Map<String, String> = { calls++; mapOf("id" to "page_1") }

        val first = cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, fetcher)
        val second = cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, fetcher)

        assertEquals(mapOf("id" to "page_1"), first)
        assertEquals(mapOf("id" to "page_1"), second)
        assertEquals(1, calls)
    }

    @Test
    fun differentParams_areDifferentEntries() = runTest {
        val cache = _DiscovrCache()
        var calls = 0
        val fetcher: suspend () -> Boolean = { calls++; true }

        cache.wrap("getPage", mapOf("pageId" to "a"), null, false, fetcher)
        cache.wrap("getPage", mapOf("pageId" to "b"), null, false, fetcher)

        assertEquals(2, calls)
    }

    @Test
    fun concurrentInFlightCalls_dedupeToOneFetch() = runTest {
        val cache = _DiscovrCache()
        var calls = 0
        val fetcher: suspend () -> Boolean = {
            calls++
            yield() // force a suspension point so other launched coroutines can interleave
            true
        }

        val jobs = (1..5).map { async { cache.wrap("getPage", mapOf("pageId" to "x"), null, false, fetcher) } }
        jobs.forEach { it.await() }

        assertEquals(1, calls)
    }

    @Test
    fun ttlPolicy_servesFromCacheBeforeExpiry() = runTest {
        // The full expire-after-N-ms path is covered in the TypeScript suite (real
        // setTimeout there matches System.currentTimeMillis() semantics). Skipped
        // here: runTest's virtual clock advances delay()/withTimeout() instantly
        // without moving System.currentTimeMillis(), so a real elapsed-time
        // assertion would be flaky/meaningless under this test dispatcher.
        val cache = _DiscovrCache()
        var calls = 0
        val fetcher: suspend () -> Boolean = { calls++; true }

        cache.wrap("searchMedia", mapOf("q" to "avatar"), 3_600_000L, false, fetcher)
        cache.wrap("searchMedia", mapOf("q" to "avatar"), 3_600_000L, false, fetcher)

        assertEquals(1, calls)
    }

    @Test
    fun bypass_skipsCachedReadButRefreshesEntry() = runTest {
        val cache = _DiscovrCache()
        var calls = 0
        val fetcher: suspend () -> Int = { calls++; calls }

        val first = cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, fetcher)
        val bypassed = cache.wrap("getPage", mapOf("pageId" to "abc"), null, true, fetcher)
        val third = cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, fetcher)

        assertEquals(1, first)
        assertEquals(2, bypassed)
        assertEquals(2, third) // reads the entry the bypass call just refreshed
        assertEquals(2, calls)
    }

    @Test
    fun invalidate_purgesOnlyGivenOperationIds() = runTest {
        val cache = _DiscovrCache()
        var profileCalls = 0
        var mediaCalls = 0
        val profilesFetcher: suspend () -> Boolean = { profileCalls++; true }
        val mediaFetcher: suspend () -> Boolean = { mediaCalls++; true }

        cache.wrap("getProfiles", mapOf(), null, false, profilesFetcher)
        cache.wrap("getProfile", mapOf("profileId" to "p1"), null, false, profilesFetcher)
        cache.wrap("getMedia", mapOf("mediaId" to "MV_1"), null, false, mediaFetcher)

        cache.invalidate(listOf("getProfiles", "getProfile"))

        cache.wrap("getProfiles", mapOf(), null, false, profilesFetcher)
        cache.wrap("getProfile", mapOf("profileId" to "p1"), null, false, profilesFetcher)
        cache.wrap("getMedia", mapOf("mediaId" to "MV_1"), null, false, mediaFetcher)

        assertEquals(4, profileCalls) // getProfiles + getProfile, each refetched once
        assertEquals(1, mediaCalls) // untouched
    }

    @Test
    fun clear_wipesEveryEntry() = runTest {
        val cache = _DiscovrCache()
        var calls = 0
        val fetcher: suspend () -> Boolean = { calls++; true }

        cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, fetcher)
        cache.clear()
        cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, fetcher)

        assertEquals(2, calls)
    }

    @Test
    fun disabled_alwaysFetchesNeverCaches() = runTest {
        val cache = _DiscovrCache(enabled = false)
        var calls = 0
        val fetcher: suspend () -> Boolean = { calls++; true }

        cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, fetcher)
        cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, fetcher)

        assertEquals(2, calls)
    }

    @Test
    fun clearDuringInFlightFetch_discardsStaleResult() = runTest {
        // Reproduces the TOCTOU the review flagged: a profile switch (clear())
        // racing an in-flight fetch from the old profile must not let that
        // fetch's result resurrect itself into the new, post-clear cache.
        //
        // supervisorScope: `pending`'s expected failure must not cancel this
        // test's own coroutine — under a plain (non-supervisor) scope, async's
        // eager exception propagation would tear down the whole test before
        // assertFailsWith ever gets to observe it.
        supervisorScope {
            val cache = _DiscovrCache()
            val gate = CompletableDeferred<Map<String, String>>()
            val slowFetcher: suspend () -> Map<String, String> = { gate.await() }

            val pending = async { cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, slowFetcher) }
            yield() // let `pending` actually reach gate.await() before clear() lands
            cache.clear() // profile switch lands while the fetch above is still in flight
            gate.complete(mapOf("owner" to "profileA"))
            // The stale-generation fetch must fail, not resolve — otherwise any
            // follower deduped onto this same deferred would get profileA's data.
            assertFailsWith<DiscovrCacheStaleGenerationException> { pending.await() }

            var calls = 0
            val freshFetcher: suspend () -> Map<String, String> = { calls++; mapOf("owner" to "profileB") }
            val result = cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, freshFetcher)

            assertEquals(mapOf("owner" to "profileB"), result)
            assertEquals(1, calls) // not served from the stale profileA entry
        }
    }

    @Test
    fun preClearFetchCleanup_doesNotDeletePostClearCallersRegistration() = runTest {
        // A finally block that unconditionally removes inFlight[key] would let
        // an old (pre-clear) fetch's cleanup delete a *new* caller's
        // registration for the same key, defeating dedup for anyone racing
        // that new caller.
        //
        // supervisorScope: `oldPending`'s expected failure must not cancel
        // this test's own coroutine — see the comment in
        // clearDuringInFlightFetch_discardsStaleResult above.
        supervisorScope {
            val cache = _DiscovrCache()
            val oldGate = CompletableDeferred<Map<String, String>>()
            val oldFetcher: suspend () -> Map<String, String> = { oldGate.await() }

            val oldPending = async { cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, oldFetcher) }
            yield() // let `oldPending` actually reach oldGate.await() and register as leader first
            cache.clear() // wipes inFlight — oldFetcher's own coroutine keeps running regardless

            var newCalls = 0
            val newGate = CompletableDeferred<Map<String, String>>()
            val newFetcher: suspend () -> Map<String, String> = { newCalls++; newGate.await() }

            val newPending = async { cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, newFetcher) }
            yield() // let `newPending` register as the new leader before oldGate resolves

            oldGate.complete(mapOf("gen" to "old"))
            // Rejects (stale generation) rather than resolving; only its cleanup
            // behavior matters here.
            assertFailsWith<DiscovrCacheStaleGenerationException> { oldPending.await() }

            // A third call while the new fetch is still pending should dedupe onto
            // it, not start a fourth fetch — only possible if the old fetch's
            // cleanup left the new registration alone.
            val thirdPending = async { cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, newFetcher) }
            yield() // let `thirdPending` reach the dedupe check before newGate resolves
            newGate.complete(mapOf("gen" to "new"))

            assertEquals(mapOf("gen" to "new"), newPending.await())
            assertEquals(mapOf("gen" to "new"), thirdPending.await())
            assertEquals(1, newCalls) // deduped, not a fresh fourth fetch
        }
    }

    @Test
    fun clearDuringInFlightFetch_doesNotHandFollowerStaleData() = runTest {
        // The P0 the review flagged: a follower deduped onto the *same*
        // in-flight deferred as a leader must not get handed the leader's
        // result once a clear() has superseded it, even though the follower
        // itself never touched the cache/inFlight maps directly.
        //
        // supervisorScope: both `leader` and `follower` are expected to fail —
        // see the comment in clearDuringInFlightFetch_discardsStaleResult above.
        supervisorScope {
            val cache = _DiscovrCache()
            val gate = CompletableDeferred<Map<String, String>>()
            val slowFetcher: suspend () -> Map<String, String> = { gate.await() }

            val leader = async { cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, slowFetcher) }
            yield() // let `leader` register and reach gate.await() first
            val follower = async { cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, slowFetcher) }
            yield() // let `follower` dedupe onto the leader's in-flight deferred

            cache.clear() // profile switch lands while both are still in flight
            gate.complete(mapOf("owner" to "profileA"))

            assertFailsWith<DiscovrCacheStaleGenerationException> { leader.await() }
            assertFailsWith<DiscovrCacheStaleGenerationException> { follower.await() }

            var calls = 0
            val freshFetcher: suspend () -> Map<String, String> = { calls++; mapOf("owner" to "profileB") }
            val result = cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, freshFetcher)

            assertEquals(mapOf("owner" to "profileB"), result)
            assertEquals(1, calls) // not served from the stale profileA entry
        }
    }

    @Test
    fun fetcherExceedingTimeout_rejectsAndFreesKeyForRetry() = runTest {
        val cache = _DiscovrCache(timeoutMs = 10L)
        val hungFetcher: suspend () -> Boolean = { awaitCancellation() }

        assertFailsWith<TimeoutCancellationException> {
            cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, hungFetcher)
        }

        var calls = 0
        val fetcher: suspend () -> Boolean = { calls++; true }
        val result = cache.wrap("getPage", mapOf("pageId" to "abc"), null, false, fetcher)
        assertEquals(true, result)
        assertEquals(1, calls) // the timed-out key wasn't left permanently stuck
    }

    @Test
    fun buildKey_doesNotCollideOnCommasInValues() = runTest {
        val cache = _DiscovrCache()
        var calls = 0
        val fetcher: suspend () -> Boolean = { calls++; true }

        // { a: "hello,world", b: "x" } vs { a: "hello", b: "world,x" } — naive
        // comma-joined keys collide on these; a proper escaped serialization doesn't.
        cache.wrap("search", mapOf("a" to "hello,world", "b" to "x"), null, false, fetcher)
        cache.wrap("search", mapOf("a" to "hello", "b" to "world,x"), null, false, fetcher)

        assertEquals(2, calls)
    }
}
