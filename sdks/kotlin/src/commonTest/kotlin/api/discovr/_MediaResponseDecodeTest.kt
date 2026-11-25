package api.discovr

import api.discovr.models.MediaItem
import api.discovr.models.MediaResponse
import kotlinx.serialization.json.Json
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

/**
 * Verifies decoding `MediaResponse` and `MediaItem` payloads with null
 * nullable fields (`tvdb_id: null`, `character: null`, `profile_path: null`,
 * `logo_path: null`, `trailer: null`), which movies routinely return.
 */
class MediaResponseDecodeTest {
    private val json = Json { ignoreUnknownKeys = true }

    @Test
    fun decodesMovieMediaResponseWithNullExternalIdsAndCreditsFields() {
        val payload = """
            {
                "id": "MV_603",
                "media_type": "movie",
                "credits": {
                    "cast": [
                        {
                            "id": 6384,
                            "name": "Keanu Reeves",
                            "character": "Neo",
                            "profile_path": { "w185": "https://cdn.example.com/w185/keanu.jpg" }
                        },
                        {
                            "id": 9999,
                            "name": "Uncredited Extra",
                            "character": null,
                            "profile_path": null
                        }
                    ],
                    "crew": [
                        {
                            "id": 9340,
                            "name": "Lana Wachowski",
                            "job": "Director",
                            "profile_path": null
                        }
                    ]
                },
                "external_ids": {
                    "imdb_id": "tt0133093",
                    "tvdb_id": null
                }
            }
        """.trimIndent()

        val decoded = json.decodeFromString<MediaResponse>(payload)
        assertEquals("MV_603", decoded.id)
        assertEquals(MediaResponse.MediaType.movie, decoded.mediaType)
        assertEquals("tt0133093", decoded.externalIds?.imdbId)
        assertNull(decoded.externalIds?.tvdbId)
        val credits = assertNotNull(decoded.credits)
        assertEquals(2, credits.cast.size)
        assertNull(credits.cast[1].character)
        assertNull(credits.cast[1].profilePath)
        assertEquals(1, credits.crew.size)
        assertNull(credits.crew[0].profilePath)
    }

    @Test
    fun decodesMediaResponseWhenBothExternalIdsAreNull() {
        val payload = """
            {
                "id": "MV_999",
                "media_type": "movie",
                "external_ids": {
                    "imdb_id": null,
                    "tvdb_id": null
                }
            }
        """.trimIndent()

        val decoded = json.decodeFromString<MediaResponse>(payload)
        assertNull(decoded.externalIds?.imdbId)
        assertNull(decoded.externalIds?.tvdbId)
    }

    @Test
    fun decodesMediaItemWithNullLogoAndTrailer() {
        val payload = """
            {
                "id": "MV_603",
                "title": "The Matrix",
                "overview": "A hacker learns the truth.",
                "media_type": "movie",
                "logo_path": null,
                "trailer": null,
                "runtime": 136
            }
        """.trimIndent()

        val decoded = json.decodeFromString<MediaItem>(payload)
        assertEquals("MV_603", decoded.id)
        assertNull(decoded.logoPath)
        assertNull(decoded.trailer)
        assertEquals(136, decoded.runtime)
    }
}
