package api.discovr

import api.discovr.apis.DiscovrApi
import api.discovr.auth.AuthStorage
import api.discovr.models.EpisodeRef
import api.discovr.models.KnownForItem
import api.discovr.models.MediaItem
import api.discovr.models.NavigationItem
import api.discovr.models.PlaybackItem
import api.discovr.models.ProviderItem
import api.discovr.models.Rating
import api.discovr.models.SearchResult
import api.discovr.models.SimilarResult
import api.discovr.models.TitleListItem
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.TextContent
import io.ktor.http.headersOf
import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlin.time.Instant

class ItemOverloadsTest {

    private class MemoryStorage : AuthStorage {
        private val map = mutableMapOf<String, String>()
        override fun get(key: String): String? = map[key]
        override fun put(key: String, value: String?) {
            if (value == null) map.remove(key) else map[key] = value
        }
    }

    private val titleStateJson = """
        {"mediaId":"MV_550","mediaType":"movie","rating":"liked","watchlist":true,"watched":false,"completed":false,"plays":0,"playback":null}
    """.trimIndent()

    private val scrobbleJson = """{"status":"ok","progress":55.0,"completed":false}"""
    private val successJson = """{"message":"ok"}"""
    private val mediaJson = """{"id":"MV_550","media_type":"movie","movie":{"id":"MV_550","tmdb_id":550,"title":"Fight Club","genres":[]}}"""
    private val assetsJson = """{"images":{"posters":[],"backdrops":[],"logos":[]},"videos":[]}"""
    private val similarJson = """{"page":1,"results":[],"total_pages":1,"total_results":0}"""
    private val seasonDetailsJson = """{"show_id":"TV_1396","show_tmdb_id":1396,"id":1,"name":"Season 1","season_number":1,"episodes":[]}"""
    private val seasonStateJson = """{"season":1,"completed":false,"episodes":[]}"""
    private val pageJson = """{"id":"pAction123","createdAt":"2026-01-01T00:00:00Z","hero":[]}"""
    private val rowsJson = """{"rows":[],"hasMore":false}"""
    private val rowJson = """{"id":"row_1","title":"Row","pageId":"pProv8","type":"media","index":0,"createdAt":"2026-01-01T00:00:00Z"}"""
    private val rowItemsJson = """{"items":[],"hasMore":false}"""

    private fun testClient(recordedPaths: MutableList<String>, recordedBodies: MutableList<String>): DiscovrClient {
        val engine = MockEngine { request ->
            recordedPaths.add("${request.method.value} ${request.url.encodedPath}")
            val bodyText = (request.body as? TextContent)?.text ?: ""
            recordedBodies.add(bodyText)
            val path = request.url.encodedPath
            val json = when {
                path.endsWith("/assets") -> assetsJson
                path.endsWith("/similar") -> similarJson
                path.contains("/seasons/") && path.startsWith("/media/") -> seasonDetailsJson
                path.contains("/seasons/") && path.startsWith("/profile/titles/") -> seasonStateJson
                path.startsWith("/media/") -> mediaJson
                path.startsWith("/profile/scrobble/") -> scrobbleJson
                path.startsWith("/profile/playback/") -> successJson
                path.startsWith("/profile/titles/") -> titleStateJson
                path.endsWith("/items") -> rowItemsJson
                path.contains("/rows/") -> rowJson
                path.endsWith("/rows") -> rowsJson
                path.startsWith("/pages/") -> pageJson
                else -> successJson
            }
            respond(
                content = json,
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json"),
            )
        }
        return DiscovrClient("test-client", storage = MemoryStorage(), basePath = "https://api.test", cache = false).apply {
            _sessionApi = DiscovrApi(baseUrl = "https://api.test", httpClientEngine = engine).apply {
                bearerTokenProvider = { "session-token" }
            }
        }
    }

    @Test
    fun titleAndTileOverloadsPreferRefAndFallBackToIdOrPageId() = runTest {
        val paths = mutableListOf<String>()
        val bodies = mutableListOf<String>()
        val client = testClient(paths, bodies)

        val at = Instant.fromEpochSeconds(0)
        val mediaItem = MediaItem(
            id = "MV_550",
            title = "Fight Club",
            overview = "",
            mediaType = MediaItem.MediaType.movie,
            ref = "MV_550@row",
        )
        val titleNoRef = TitleListItem(
            id = "TV_1396",
            mediaType = TitleListItem.MediaType.tv,
            title = "Breaking Bad",
            posterPath = emptyMap(),
            backdropPath = emptyMap(),
            rating = Rating.liked,
            watchlist = true,
            updatedAt = at,
        )
        val playbackItem = PlaybackItem(
            id = "TV_1396",
            mediaType = PlaybackItem.MediaType.tv,
            title = "Breaking Bad",
            posterPath = emptyMap(),
            backdropPath = emptyMap(),
            season = 2,
            episode = 5,
            createdAt = at,
            ref = "TV_1396@cw",
        )
        val searchItem = SearchResult(id = "MV_13", tmdbId = 13, mediaType = SearchResult.MediaType.movie, ref = "MV_13@sr")
        val similarItem = SimilarResult(id = "MV_14", tmdbId = 14, mediaType = SimilarResult.MediaType.movie, ref = "MV_14@sim")
        val knownForItem = KnownForItem(id = "MV_15", tmdbId = 15, mediaType = KnownForItem.MediaType.movie, ref = "MV_15@kf")
        val navTile = NavigationItem(id = "nav-action", title = "Action", pageId = "pAction123", ref = "pAction123@nav")
        val provTileNoRef = ProviderItem(id = "prov-8", title = "Provider", pageId = "pProv8", paths = emptyMap())

        client.getMedia(mediaItem)
        client.getMediaAssets(searchItem)
        client.getSimilarRecommendations(similarItem)
        client.getSeasonDetails(knownForItem, seasonNumber = 1)
        client.getTitleState(mediaItem, providers = true)
        client.getSeasonState(titleNoRef, seasonNumber = 2)
        client.setRating(mediaItem, Rating.liked)
        client.clearRating(mediaItem)
        client.addToWatchlist(mediaItem)
        client.removeFromWatchlist(mediaItem)
        client.markWatched(playbackItem, season = 2, episode = 5)
        client.markUnwatched(titleNoRef, season = 1)
        client.deletePlaybackItem(playbackItem)
        client.scrobble(playbackItem, progress = 55.0, tv = EpisodeRef(season = 2, episode = 5))

        // trackPlayback defaults tv from PlaybackItem.season/episode and uses refOrId
        val tracker = client.trackPlayback(playbackItem)
        tracker.stop(65.0)

        // Page / tile overloads prefer ref, fall back to pageId (never tile id)
        client.getPage(navTile)
        client.getRows(navTile)
        client.getRow(provTileNoRef, rowId = "row_1")
        client.getRowItems(provTileNoRef, rowId = "row_1")

        client.close()

        assertTrue(paths.any { it.contains("MV_550%40row") || it.contains("MV_550@row") }, "Expected MV_550@row in $paths")
        assertTrue(paths.any { it.contains("MV_13%40sr") || it.contains("MV_13@sr") }, "Expected MV_13@sr in $paths")
        assertTrue(paths.any { it.contains("MV_14%40sim") || it.contains("MV_14@sim") }, "Expected MV_14@sim in $paths")
        assertTrue(paths.any { it.contains("MV_15%40kf") || it.contains("MV_15@kf") }, "Expected MV_15@kf in $paths")
        assertTrue(paths.any { it.contains("TV_1396%40cw") || it.contains("TV_1396@cw") }, "Expected TV_1396@cw in $paths")
        assertTrue(paths.any { it == "GET /profile/titles/TV_1396/seasons/2" }, "Expected fallback to plain id in $paths")
        assertTrue(paths.any { it.contains("pAction123%40nav") || it.contains("pAction123@nav") }, "Expected nav ref in $paths")
        assertTrue(paths.any { it == "GET /pages/pProv8/rows/row_1/items" }, "Expected provider pageId fallback in $paths")

        val trackerBody = bodies.last { it.contains("65") }
        assertTrue(
            Regex("\"season\"\\s*:\\s*2").containsMatchIn(trackerBody) &&
                Regex("\"episode\"\\s*:\\s*5").containsMatchIn(trackerBody),
            "Expected PlaybackItem tv default in $trackerBody",
        )
        assertEquals(19, paths.size)
    }
}
