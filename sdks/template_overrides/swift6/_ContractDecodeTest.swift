@testable import Discovr
import XCTest

/// Verifies the Swift SDK decodes the API's contract shapes cleanly —
/// specifically nullable dates (A2 / D11: an unreleased title has `null`
/// instead of `""`), renamed types (`PlaybackProgress`, `Genre`, `EpisodeRef`),
/// and typed episode credits (`EpisodeCrewMember`, `EpisodeGuestStar`).
final class ContractDecodeTest: XCTestCase {
    private let helper = CodableHelper()

    private func decode<T: Decodable>(_ type: T.Type, json: String) throws -> T {
        let data = Data(json.utf8)
        return try helper.jsonDecoder.decode(type, from: data)
    }

    func testSearchResponseDecodesNullReleaseAndAirDates() throws {
        let json = """
        {
          "page": 1,
          "has_more": true,
          "results": [
            {
              "id": "MV_438631",
              "tmdb_id": 438631,
              "media_type": "movie",
              "title": "Dune: Messiah",
              "original_title": "Dune: Messiah",
              "overview": null,
              "poster_path": null,
              "backdrop_path": null,
              "release_date": null,
              "popularity": 88.2,
              "vote_average": 0,
              "vote_count": 0
            },
            {
              "id": "TV_90228",
              "tmdb_id": 90228,
              "media_type": "tv",
              "name": "Dune: Prophecy",
              "original_name": "Dune: Prophecy",
              "overview": null,
              "poster_path": null,
              "backdrop_path": null,
              "first_air_date": null,
              "popularity": 64.1,
              "vote_average": 7.2,
              "vote_count": 420
            },
            {
              "id": "137427",
              "tmdb_id": 137427,
              "media_type": "person",
              "name": "Denis Villeneuve",
              "popularity": 31.4,
              "profile_path": null,
              "known_for_department": "Directing",
              "known_for": [
                {
                  "id": "MV_123456",
                  "tmdb_id": 123456,
                  "media_type": "movie",
                  "title": "Untitled Sci-Fi Project",
                  "overview": null,
                  "poster_path": null,
                  "backdrop_path": null,
                  "release_date": null,
                  "vote_average": 0
                }
              ]
            }
          ]
        }
        """

        let response = try decode(SearchResponse.self, json: json)
        XCTAssertEqual(response.results.count, 3)
        XCTAssertNil(response.results[0].releaseDate)
        XCTAssertNil(response.results[1].firstAirDate)
        XCTAssertNil(response.results[2].knownFor?.first?.releaseDate)
    }

    func testMediaResponseDecodesSharedGenreAndNullDates() throws {
        let json = """
        {
          "id": "MV_438631",
          "media_type": "movie",
          "movie": {
            "id": "MV_438631",
            "tmdb_id": 438631,
            "title": "Dune: Messiah",
            "original_title": "Dune: Messiah",
            "overview": null,
            "poster_path": null,
            "backdrop_path": null,
            "release_date": null,
            "runtime": null,
            "vote_average": 0,
            "vote_count": 0,
            "popularity": 50.0,
            "genres": [{ "tmdb_id": 878, "name": "Science Fiction" }],
            "tagline": null,
            "status": "Planned",
            "budget": 0,
            "revenue": 0,
            "homepage": null,
            "imdb_id": null
          },
          "watch_providers": []
        }
        """

        let response = try decode(MediaResponse.self, json: json)
        XCTAssertNil(response.movie?.releaseDate)
        let genres: [Genre]? = response.movie?.genres
        XCTAssertEqual(genres?.first?.tmdbId, 878)
        XCTAssertEqual(genres?.first?.name, "Science Fiction")
    }

    func testSeasonDetailsDecodesStringShowIdAndTypedCredits() throws {
        let json = """
        {
          "show_id": "TV_1396",
          "show_tmdb_id": 1396,
          "id": 3572,
          "season_tmdb_id": 3572,
          "name": "Season 1",
          "overview": null,
          "poster_path": null,
          "season_number": 1,
          "air_date": null,
          "episodes": [
            {
              "episode_tmdb_id": 62085,
              "episode_number": 1,
              "name": "Pilot",
              "overview": null,
              "still_path": null,
              "air_date": null,
              "runtime": 58,
              "season_number": 1,
              "show_id": "TV_1396",
              "production_code": null,
              "vote_average": 8.3,
              "vote_count": 350,
              "crew": [
                {
                  "tmdb_id": 66633,
                  "name": "Vince Gilligan",
                  "job": "Director",
                  "department": "Directing",
                  "profile_path": null
                }
              ],
              "guest_stars": [
                {
                  "tmdb_id": 14329,
                  "name": "John Koyama",
                  "character": "Emilio Koyama",
                  "order": 1,
                  "profile_path": null
                }
              ]
            }
          ]
        }
        """

        let season = try decode(SeasonDetailsResponse.self, json: json)
        XCTAssertNil(season.airDate)
        XCTAssertEqual(season.episodes.first?.showId, "TV_1396")
        XCTAssertNil(season.episodes.first?.airDate)
        let crew: [EpisodeCrewMember]? = season.episodes.first?.crew
        let guests: [EpisodeGuestStar]? = season.episodes.first?.guestStars
        XCTAssertEqual(crew?.first?.name, "Vince Gilligan")
        XCTAssertEqual(guests?.first?.character, "Emilio Koyama")
    }

    func testMediaProfileMetaUsesPlaybackProgressAndEpisodeRefEncodes() throws {
        let json = """
        {
          "watchlist": false,
          "liked": true,
          "disliked": false,
          "super_liked": false,
          "history": true,
          "completed": false,
          "playback": {
            "inlist": true,
            "data": {
              "mediaId": "TV_1396",
              "mediaType": "tv",
              "createdAt": "2026-01-01T00:00:00.000Z",
              "updatedAt": "2026-01-02T00:00:00.000Z",
              "progress": 42.5,
              "season": 1,
              "episode": 2
            }
          }
        }
        """

        let meta = try decode(MediaProfileMeta.self, json: json)
        let progress: PlaybackProgress? = meta.playback.data
        XCTAssertEqual(progress?.progress, 42.5)
        XCTAssertEqual(progress?.season, 1)

        let ref = EpisodeRef(season: 2, episode: 5)
        XCTAssertEqual(ref.season, 2)
        XCTAssertEqual(ref.episode, 5)
    }
}
