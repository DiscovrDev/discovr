package api.discovr

import api.discovr.models.HeroItem
import api.discovr.models.HistoryItem
import api.discovr.models.KnownForItem
import api.discovr.models.MediaItem
import api.discovr.models.MediaItemType
import api.discovr.models.NavigationItem
import api.discovr.models.PlaybackItem
import api.discovr.models.ProviderItem
import api.discovr.models.SearchResult
import api.discovr.models.SimilarResult
import api.discovr.models.SimpleListItem
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.time.Instant

/**
 * Tests for the one-line helper integrators are told to reach for instead of
 * `.id`.
 *
 * Its whole job is picking the right string out of an item, and it has two ways
 * to be quietly wrong. Return the `id` when a `ref` was present and the call
 * still succeeds — it just loses the attribution the ref exists to carry, with
 * nothing to notice. Return a navigation tile's own `id` instead of its
 * `pageId` and the call fails outright, because a tile's id is not a page id.
 *
 * These are five separate extension functions rather than one generic, so each
 * one can drift independently — hence a case per type.
 */
class RefOrIdTest {

    @Test
    fun prefersTheRefOverTheId() {
        val item = MediaItem(
            id = "MV_550",
            title = "Fight Club",
            overview = "",
            mediaType = MediaItem.MediaType.movie,
            ref = "MV_550@ctx",
        )
        assertEquals("MV_550@ctx", item.refOrId())
    }

    @Test
    fun fallsBackToTheIdWhenThereIsNoRef() {
        // Hero items built from a cached materialization, and anything a client
        // reconstructed itself, arrive without one. They still have to work.
        val item = MediaItem(
            id = "MV_550",
            title = "Fight Club",
            overview = "",
            mediaType = MediaItem.MediaType.movie,
        )
        assertEquals("MV_550", item.refOrId())
    }

    @Test
    fun heroAndSearchItemsResolveTheSameWay() {
        val hero = HeroItem(
            id = "TV_1396",
            title = "Breaking Bad",
            overview = "",
            mediaType = HeroItem.MediaType.tv,
            type = MediaItemType.media,
            logoPath = emptyMap(),
            ref = "TV_1396@ctx",
        )
        val result = SearchResult(
            id = "MV_550",
            tmdbId = 550,
            mediaType = SearchResult.MediaType.movie,
        )
        assertEquals("TV_1396@ctx", hero.refOrId())
        assertEquals("MV_550", result.refOrId())
    }

    @Test
    fun tilesResolveToThePageTheyOpenNotToTheTile() {
        // A tile's `id` identifies the tile; `getPage` wants the page it links
        // to. Handing it the tile id is a 404, so the fallback target matters
        // more here than anywhere else.
        val navigation = NavigationItem(
            id = "nav-movies",
            title = "Movies",
            pageId = "k7Qm2xR9pT",
        )
        val provider = ProviderItem(
            id = "provider-8",
            title = "A provider",
            pageId = "p3Rt9wQ2mX",
            paths = emptyMap(),
        )
        assertEquals("k7Qm2xR9pT", navigation.refOrId())
        assertEquals("p3Rt9wQ2mX", provider.refOrId())
    }

    @Test
    fun stillPrefersATilesRefOverItsPageId() {
        val navigation = NavigationItem(
            id = "nav-movies",
            title = "Movies",
            pageId = "k7Qm2xR9pT",
            ref = "k7Qm2xR9pT@ctx",
        )
        assertEquals("k7Qm2xR9pT@ctx", navigation.refOrId())
    }

    // The five shapes below gained a `ref` alongside the rows, hero and search
    // results. Each has its own extension, so each gets a case.

    @Test
    fun suggestionsCarryARef() {
        val withRef = SimilarResult(
            id = "MV_13",
            tmdbId = 13,
            mediaType = SimilarResult.MediaType.movie,
            ref = "MV_13@ctx",
        )
        val without = SimilarResult(
            id = "MV_13",
            tmdbId = 13,
            mediaType = SimilarResult.MediaType.movie,
        )
        assertEquals("MV_13@ctx", withRef.refOrId())
        assertEquals("MV_13", without.refOrId())
    }

    @Test
    fun aPersonsKnownForTitlesCarryARef() {
        val withRef = KnownForItem(
            id = "MV_238",
            tmdbId = 238,
            mediaType = KnownForItem.MediaType.movie,
            ref = "MV_238@ctx",
        )
        val without = KnownForItem(
            id = "MV_238",
            tmdbId = 238,
            mediaType = KnownForItem.MediaType.movie,
        )
        assertEquals("MV_238@ctx", withRef.refOrId())
        assertEquals("MV_238", without.refOrId())
    }

    @Test
    fun profileListItemsCarryARef() {
        val at = Instant.fromEpochSeconds(0)
        val images = emptyMap<String, String>()

        val simple = SimpleListItem(
            id = "MV_550",
            mediaType = SimpleListItem.MediaType.movie,
            title = "Fight Club",
            posterPath = images,
            backdropPath = images,
            createdAt = at,
            ref = "MV_550@ctx",
        )
        val playback = PlaybackItem(
            id = "MV_550",
            mediaType = PlaybackItem.MediaType.movie,
            title = "Fight Club",
            posterPath = images,
            backdropPath = images,
            createdAt = at,
            ref = "MV_550@ctx",
        )
        val history = HistoryItem(
            id = "MV_550",
            mediaType = HistoryItem.MediaType.movie,
            title = "Fight Club",
            posterPath = images,
            backdropPath = images,
            updatedAt = at,
            completed = true,
            watchedCount = 1,
            createdAt = at,
            ref = "MV_550@ctx",
        )
        assertEquals("MV_550@ctx", simple.refOrId())
        assertEquals("MV_550@ctx", playback.refOrId())
        assertEquals("MV_550@ctx", history.refOrId())

        // And with no ref, each falls back to its id.
        assertEquals("MV_550", simple.copy(ref = null).refOrId())
        assertEquals("MV_550", playback.copy(ref = null).refOrId())
        assertEquals("MV_550", history.copy(ref = null).refOrId())
    }

    // The same table is asserted in the TypeScript and Swift SDKs and against the
    // the API's own ref parser. Keep all four identical.
    @Test
    fun idOfRecoversTheIdFromARefOrAPlainId() {
        val cases = listOf(
            "MV_550" to "MV_550",
            "MV_550@ctx" to "MV_550",
            "TV_1396@Zk3vQ9tXp2Lw.AbCdEfGhIjKlMnOp" to "TV_1396",
            "k7Qm2xR9pT@ctx" to "k7Qm2xR9pT",
            "" to "",
            "@ctx" to "",
        )
        for ((input, id) in cases) {
            assertEquals(id, idOf(input), "idOf(\"$input\")")
        }
    }

    @Test
    fun idOfRoundTripsWithRefOrId() {
        val item = MediaItem(
            id = "MV_550",
            title = "Fight Club",
            overview = "",
            mediaType = MediaItem.MediaType.movie,
            ref = "MV_550@ctx",
        )
        assertEquals(item.id, idOf(item.refOrId()))
        assertEquals("MV_550", idOf(idOf("MV_550@ctx")))
    }
}
