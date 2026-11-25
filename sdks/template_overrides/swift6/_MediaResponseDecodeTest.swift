@testable import Discovr
import XCTest

/// Verifies decoding `MediaResponse` and `MediaItem` payloads with null
/// nullable fields (`tvdb_id: null`, `character: null`, `profile_path: null`,
/// `logo_path: null`, `trailer: null`), which movies routinely return.
final class MediaResponseDecodeTest: XCTestCase {
    func testDecodesMovieMediaResponseWithNullExternalIdsAndCreditsFields() throws {
        let json = """
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
        """

        let decoded = try JSONDecoder().decode(MediaResponse.self, from: Data(json.utf8))
        XCTAssertEqual(decoded.id, "MV_603")
        XCTAssertEqual(decoded.mediaType, .movie)
        XCTAssertEqual(decoded.externalIds?.imdbId, "tt0133093")
        XCTAssertNil(decoded.externalIds?.tvdbId)
        XCTAssertEqual(decoded.credits?.cast.count, 2)
        XCTAssertNil(decoded.credits?.cast[1].character)
        XCTAssertNil(decoded.credits?.cast[1].profilePath)
        XCTAssertEqual(decoded.credits?.crew.count, 1)
        XCTAssertNil(decoded.credits?.crew[0].profilePath)
    }

    func testDecodesMediaResponseWhenBothExternalIdsAreNull() throws {
        let json = """
        {
            "id": "MV_999",
            "media_type": "movie",
            "external_ids": {
                "imdb_id": null,
                "tvdb_id": null
            }
        }
        """

        let decoded = try JSONDecoder().decode(MediaResponse.self, from: Data(json.utf8))
        XCTAssertNil(decoded.externalIds?.imdbId)
        XCTAssertNil(decoded.externalIds?.tvdbId)
    }

    func testDecodesMediaItemWithNullLogoAndTrailer() throws {
        let json = """
        {
            "id": "MV_603",
            "title": "The Matrix",
            "overview": "A hacker learns the truth.",
            "media_type": "movie",
            "type": "media",
            "logo_path": null,
            "trailer": null,
            "runtime": 136
        }
        """

        let decoded = try JSONDecoder().decode(MediaItem.self, from: Data(json.utf8))
        XCTAssertEqual(decoded.id, "MV_603")
        XCTAssertNil(decoded.logoPath)
        XCTAssertNil(decoded.trailer)
        XCTAssertEqual(decoded.runtime, 136)
    }
}
