@testable import Discovr
import XCTest

/// Tests for the one-line helper integrators are told to reach for instead of
/// `.id`.
///
/// Its whole job is picking the right string out of an item, and it has two
/// ways to be quietly wrong. Return the `id` when a `ref` was present and the
/// call still succeeds -- it just loses the attribution the ref exists to
/// carry, with nothing to notice. Return a navigation tile's own `id` instead
/// of its `pageId` and the call fails outright, because a tile's id is not a
/// page id.
///
/// These are five separate extensions rather than one protocol, so each can
/// drift independently -- hence a case per type.
final class RefOrIdTest: XCTestCase {
    func testPrefersTheRefOverTheId() {
        let item = MediaItem(
            id: "MV_550",
            title: "Fight Club",
            overview: "",
            mediaType: .movie,
            type: .media,
            ref: "MV_550@ctx"
        )
        XCTAssertEqual(item.refOrId, "MV_550@ctx")
    }

    func testFallsBackToTheIdWhenThereIsNoRef() {
        // Hero items built from a cached materialization, and anything a client
        // reconstructed itself, arrive without one. They still have to work.
        let item = MediaItem(
            id: "MV_550",
            title: "Fight Club",
            overview: "",
            mediaType: .movie,
            type: .media
        )
        XCTAssertEqual(item.refOrId, "MV_550")
    }

    func testHeroAndSearchItemsResolveTheSameWay() {
        let hero = HeroItem(
            id: "TV_1396",
            title: "Breaking Bad",
            overview: "",
            mediaType: .tv,
            type: .media,
            ref: "TV_1396@ctx",
            logoPath: [:]
        )
        let result = SearchResult(id: "MV_550", tmdbId: 550, mediaType: .movie)
        XCTAssertEqual(hero.refOrId, "TV_1396@ctx")
        XCTAssertEqual(result.refOrId, "MV_550")
    }

    func testTilesResolveToThePageTheyOpenNotToTheTile() {
        // A tile's `id` identifies the tile; `getPage` wants the page it links
        // to. Handing it the tile id is a 404, so the fallback target matters
        // more here than anywhere else.
        let navigation = NavigationItem(
            id: "nav-movies",
            title: "Movies",
            pageId: "k7Qm2xR9pT",
            type: .navigation
        )
        let provider = ProviderItem(
            id: "provider-8",
            title: "A provider",
            pageId: "p3Rt9wQ2mX",
            type: .provider,
            paths: [:]
        )
        XCTAssertEqual(navigation.refOrId, "k7Qm2xR9pT")
        XCTAssertEqual(provider.refOrId, "p3Rt9wQ2mX")
    }

    func testStillPrefersATilesRefOverItsPageId() {
        let navigation = NavigationItem(
            id: "nav-movies",
            title: "Movies",
            pageId: "k7Qm2xR9pT",
            ref: "k7Qm2xR9pT@ctx",
            type: .navigation
        )
        XCTAssertEqual(navigation.refOrId, "k7Qm2xR9pT@ctx")
    }

    // The five shapes below gained a `ref` alongside the rows, hero and search
    // results. Each has its own extension, so each gets a case.

    func testSuggestionsCarryARef() {
        let withRef = SimilarResult(id: "MV_13", ref: "MV_13@ctx", tmdbId: 13, mediaType: .movie)
        let without = SimilarResult(id: "MV_13", tmdbId: 13, mediaType: .movie)
        XCTAssertEqual(withRef.refOrId, "MV_13@ctx")
        XCTAssertEqual(without.refOrId, "MV_13")
    }

    func testAPersonsKnownForTitlesCarryARef() {
        let withRef = KnownForItem(id: "MV_238", ref: "MV_238@ctx", tmdbId: 238, mediaType: .movie)
        let without = KnownForItem(id: "MV_238", tmdbId: 238, mediaType: .movie)
        XCTAssertEqual(withRef.refOrId, "MV_238@ctx")
        XCTAssertEqual(without.refOrId, "MV_238")
    }

    func testProfileListItemsCarryARef() {
        let at = Date(timeIntervalSince1970: 0)
        let simple = SimpleListItem(
            id: "MV_550", ref: "MV_550@ctx", mediaType: .movie, title: "Fight Club",
            posterPath: [:], backdropPath: [:], createdAt: at
        )
        let playback = PlaybackItem(
            id: "MV_550", ref: "MV_550@ctx", mediaType: .movie, title: "Fight Club",
            posterPath: [:], backdropPath: [:], createdAt: at
        )
        let history = HistoryItem(
            id: "MV_550", ref: "MV_550@ctx", mediaType: .movie, title: "Fight Club",
            posterPath: [:], backdropPath: [:], updatedAt: at, completed: true,
            watchedCount: 1, createdAt: at
        )
        XCTAssertEqual(simple.refOrId, "MV_550@ctx")
        XCTAssertEqual(playback.refOrId, "MV_550@ctx")
        XCTAssertEqual(history.refOrId, "MV_550@ctx")

        // And with no ref, each falls back to its id.
        let bareSimple = SimpleListItem(
            id: "MV_550", mediaType: .movie, title: "Fight Club",
            posterPath: [:], backdropPath: [:], createdAt: at
        )
        XCTAssertEqual(bareSimple.refOrId, "MV_550")
    }

    // The same table is asserted in the TypeScript and Kotlin SDKs and against the
    // the API's own ref parser. Keep all four identical.
    func testIdOfRecoversTheIdFromARefOrAPlainId() {
        let cases: [(String, String)] = [
            ("MV_550", "MV_550"),
            ("MV_550@ctx", "MV_550"),
            ("TV_1396@Zk3vQ9tXp2Lw.AbCdEfGhIjKlMnOp", "TV_1396"),
            ("k7Qm2xR9pT@ctx", "k7Qm2xR9pT"),
            ("", ""),
            ("@ctx", ""),
        ]
        for (input, id) in cases {
            XCTAssertEqual(idOf(input), id, "idOf(\"\(input)\")")
        }
    }

    func testIdOfRoundTripsWithRefOrId() {
        let item = MediaItem(
            id: "MV_550",
            title: "Fight Club",
            overview: "",
            mediaType: .movie,
            type: .media,
            ref: "MV_550@ctx"
        )
        XCTAssertEqual(idOf(item.refOrId), item.id)
        XCTAssertEqual(idOf(idOf("MV_550@ctx")), "MV_550")
    }
}
