@testable import Discovr
import Foundation
import XCTest
#if canImport(Darwin)
import Darwin
#elseif canImport(Glibc)
import Glibc
#endif

/// Minimal single-test loopback HTTP/1.1 stub server on 127.0.0.1:<ephemeral>.
/// Exercises the real URLSession + DiscovrSessionInterceptor + DiscovrAPI JSON
/// decoding pipeline without modifying any production code.
private final class LoopbackHTTPServer: @unchecked Sendable {
    private let listenFD: Int32
    let port: UInt16
    private let lock = NSLock()
    private var stopped = false
    private let handler: @Sendable (String, String, String) -> (Int, Data)
    private let queue = DispatchQueue(label: "discovr.test.loopback")

    init(handler: @escaping @Sendable (String, String, String) -> (Int, Data)) throws {
        self.handler = handler
        #if canImport(Darwin)
        let fd = socket(AF_INET, SOCK_STREAM, 0)
        #else
        let fd = socket(AF_INET, Int32(SOCK_STREAM.rawValue), 0)
        #endif
        precondition(fd >= 0, "socket() failed")

        var reuse: Int32 = 1
        setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &reuse, socklen_t(MemoryLayout<Int32>.size))

        var addr = sockaddr_in()
        addr.sin_family = sa_family_t(AF_INET)
        addr.sin_port = 0
        addr.sin_addr = in_addr(s_addr: inet_addr("127.0.0.1"))
        let bindRes = withUnsafePointer(to: &addr) {
            $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {
                bind(fd, $0, socklen_t(MemoryLayout<sockaddr_in>.size))
            }
        }
        precondition(bindRes == 0, "bind() failed")
        precondition(listen(fd, 16) == 0, "listen() failed")

        var boundAddr = sockaddr_in()
        var addrLen = socklen_t(MemoryLayout<sockaddr_in>.size)
        withUnsafeMutablePointer(to: &boundAddr) {
            $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {
                _ = getsockname(fd, $0, &addrLen)
            }
        }
        self.listenFD = fd
        self.port = UInt16(bigEndian: boundAddr.sin_port)

        queue.async { [weak self] in
            self?.acceptLoop()
        }
    }

    var baseURL: String { "http://127.0.0.1:\(port)" }

    func stop() {
        lock.lock()
        let alreadyStopped = stopped
        stopped = true
        lock.unlock()
        if !alreadyStopped {
            close(listenFD)
        }
    }

    deinit { stop() }

    private func isStopped() -> Bool {
        lock.lock(); defer { lock.unlock() }
        return stopped
    }

    private func acceptLoop() {
        while !isStopped() {
            var clientAddr = sockaddr_in()
            var clientLen = socklen_t(MemoryLayout<sockaddr_in>.size)
            let clientFD = withUnsafeMutablePointer(to: &clientAddr) {
                $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {
                    accept(listenFD, $0, &clientLen)
                }
            }
            if clientFD < 0 { break }
            handleClient(clientFD)
        }
    }

    private func handleClient(_ fd: Int32) {
        defer { close(fd) }
        var raw = Data()
        var buf = [UInt8](repeating: 0, count: 4096)
        var headerEnd: Range<Data.Index>?
        var contentLength = 0

        while true {
            let n = recv(fd, &buf, buf.count, 0)
            if n <= 0 { break }
            raw.append(contentsOf: buf[0..<n])
            if headerEnd == nil, let range = raw.range(of: Data("\r\n\r\n".utf8)) {
                headerEnd = range
                let headerText = String(data: raw[..<range.lowerBound], encoding: .utf8) ?? ""
                for line in headerText.split(separator: "\r\n") {
                    if line.lowercased().hasPrefix("content-length:") {
                        contentLength = Int(line.split(separator: ":").dropFirst().joined().trimmingCharacters(in: .whitespaces)) ?? 0
                    }
                }
            }
            if let end = headerEnd, raw.count - end.upperBound >= contentLength {
                break
            }
        }

        guard let end = headerEnd else { return }
        let headerText = String(data: raw[..<end.lowerBound], encoding: .utf8) ?? ""
        let requestLine = headerText.split(separator: "\r\n").first ?? ""
        let parts = requestLine.split(separator: " ")
        guard parts.count >= 2 else { return }
        let method = String(parts[0])
        let fullTarget = String(parts[1])
        let path = fullTarget.split(separator: "?").first.map(String.init) ?? fullTarget
        let bodyData = raw[end.upperBound..<min(raw.count, end.upperBound + contentLength)]
        let bodyText = String(data: bodyData, encoding: .utf8) ?? ""

        let (status, responseBody) = handler(method, path, bodyText)
        let header = "HTTP/1.1 \(status) OK\r\nContent-Type: application/json\r\nContent-Length: \(responseBody.count)\r\nConnection: close\r\n\r\n"
        var payload = Data(header.utf8)
        payload.append(responseBody)
        payload.withUnsafeBytes { ptr in
            var sent = 0
            while sent < payload.count {
                let n = send(fd, ptr.baseAddress!.advanced(by: sent), payload.count - sent, 0)
                if n <= 0 { break }
                sent += n
            }
        }
    }
}

private final class LockedRecorder: @unchecked Sendable {
    private let lock = NSLock()
    private var _paths: [String] = []
    private var _bodies: [String] = []

    func record(path: String, body: String) {
        lock.lock()
        _paths.append(path)
        _bodies.append(body)
        lock.unlock()
    }

    var paths: [String] {
        lock.lock(); defer { lock.unlock() }
        return _paths
    }

    var bodies: [String] {
        lock.lock(); defer { lock.unlock() }
        return _bodies
    }
}

final class ItemOverloadsTest: XCTestCase {
    private let titleStateJson = Data(#"{"mediaId":"MV_550","mediaType":"movie","rating":"liked","watchlist":true,"watched":false,"completed":false,"plays":0,"playback":null}"#.utf8)
    private let scrobbleJson = Data(#"{"status":"ok","progress":55.0,"completed":false}"#.utf8)
    private let successJson = Data(#"{"message":"ok"}"#.utf8)
    private let mediaJson = Data(#"{"id":"MV_550","media_type":"movie","movie":{"id":"MV_550","tmdb_id":550,"title":"Fight Club","genres":[]}}"#.utf8)
    private let assetsJson = Data(#"{"images":{"posters":[],"backdrops":[],"logos":[]},"videos":[]}"#.utf8)
    private let similarJson = Data(#"{"page":1,"results":[],"total_pages":1,"total_results":0}"#.utf8)
    private let seasonDetailsJson = Data(#"{"show_id":"TV_1396","show_tmdb_id":1396,"id":1,"name":"Season 1","season_number":1,"episodes":[]}"#.utf8)
    private let seasonStateJson = Data(#"{"season":1,"completed":false,"episodes":[]}"#.utf8)
    private let pageJson = Data(#"{"id":"pAction123","createdAt":"2026-01-01T00:00:00Z","hero":[]}"#.utf8)
    private let rowsJson = Data(#"{"rows":[],"hasMore":false}"#.utf8)
    private let rowJson = Data(#"{"id":"row_1","title":"Row","pageId":"pProv8","type":"media","index":0,"createdAt":"2026-01-01T00:00:00Z"}"#.utf8)
    private let rowItemsJson = Data(#"{"items":[],"hasMore":false}"#.utf8)

    func testAllTitleAndPageModelsConformToRefProtocols() {
        let at = Date(timeIntervalSince1970: 0)
        let titleRefs: [any DiscovrTitleRef] = [
            MediaItem(id: "MV_550", title: "Fight Club", overview: "", mediaType: .movie, type: .media, ref: "MV_550@row"),
            TitleListItem(id: "TV_1396", mediaType: .tv, title: "Breaking Bad", posterPath: [:], backdropPath: [:], rating: .liked, watchlist: true, updatedAt: at),
            PlaybackItem(id: "TV_1396", ref: "TV_1396@cw", mediaType: .tv, title: "Breaking Bad", posterPath: [:], backdropPath: [:], season: 2, episode: 5, createdAt: at),
            SearchResult(id: "MV_13", tmdbId: 13, mediaType: .movie, ref: "MV_13@sr"),
            SimilarResult(id: "MV_14", ref: "MV_14@sim", tmdbId: 14, mediaType: .movie),
            KnownForItem(id: "MV_15", ref: "MV_15@kf", tmdbId: 15, mediaType: .movie),
        ]
        XCTAssertEqual(titleRefs.map(\.refOrId), ["MV_550@row", "TV_1396", "TV_1396@cw", "MV_13@sr", "MV_14@sim", "MV_15@kf"])

        let pageRefs: [any DiscovrPageRef] = [
            NavigationItem(id: "nav-action", title: "Action", pageId: "pAction123", ref: "pAction123@nav", type: .navigation),
            ProviderItem(id: "prov-8", title: "Provider", pageId: "pProv8", type: .provider, paths: [:]),
        ]
        XCTAssertEqual(pageRefs.map(\.refOrId), ["pAction123@nav", "pProv8"])
    }

    func testOverloadsForwardRefOrIdAndTrackPlaybackDefaultsTvFromPlaybackItem() async throws {
        let recorder = LockedRecorder()
        let titleStateData = titleStateJson
        let scrobbleData = scrobbleJson
        let successData = successJson
        let mediaData = mediaJson
        let assetsData = assetsJson
        let similarData = similarJson
        let seasonDetailsData = seasonDetailsJson
        let seasonStateData = seasonStateJson
        let pageData = pageJson
        let rowsData = rowsJson
        let rowData = rowJson
        let rowItemsData = rowItemsJson

        let server = try LoopbackHTTPServer { method, path, body in
            recorder.record(path: "\(method) \(path)", body: body)

            if path == "/auth/demo-session" {
                return (200, Data(#"{"refreshToken":"rt_test","expiresAt":9999999999}"#.utf8))
            }
            if path == "/auth/session-token" {
                return (200, Data(#"{"sessionToken":"st_test","snapshotId":"snap1","expiresAt":9999999999}"#.utf8))
            }
            if path.hasSuffix("/assets") { return (200, assetsData) }
            if path.hasSuffix("/similar") { return (200, similarData) }
            if path.contains("/seasons/") && path.hasPrefix("/media/") { return (200, seasonDetailsData) }
            if path.contains("/seasons/") && path.hasPrefix("/profile/titles/") { return (200, seasonStateData) }
            if path.hasPrefix("/media/") { return (200, mediaData) }
            if path.hasPrefix("/profile/scrobble/") { return (200, scrobbleData) }
            if path.hasPrefix("/profile/playback/") { return (200, successData) }
            if path.hasPrefix("/profile/titles/") { return (200, titleStateData) }
            if path.hasSuffix("/items") { return (200, rowItemsData) }
            if path.contains("/rows/") { return (200, rowData) }
            if path.hasSuffix("/rows") { return (200, rowsData) }
            if path.hasPrefix("/pages/") { return (200, pageData) }
            return (200, successData)
        }
        defer { server.stop() }

        let client = await DiscovrClient(
            clientId: "test-client",
            basePath: server.baseURL,
            cache: false,
            demoMode: true
        )
        try await client.selectProfile(profileId: "prof_1")

        let at = Date(timeIntervalSince1970: 0)
        let mediaItem = MediaItem(id: "MV_550", title: "Fight Club", overview: "", mediaType: .movie, type: .media, ref: "MV_550@row")
        let titleNoRef = TitleListItem(id: "TV_1396", mediaType: .tv, title: "Breaking Bad", posterPath: [:], backdropPath: [:], rating: .liked, watchlist: true, updatedAt: at)
        let playbackItem = PlaybackItem(id: "TV_1396", ref: "TV_1396@cw", mediaType: .tv, title: "Breaking Bad", posterPath: [:], backdropPath: [:], season: 2, episode: 5, createdAt: at)
        let navTile = NavigationItem(id: "nav-action", title: "Action", pageId: "pAction123", ref: "pAction123@nav", type: .navigation)
        let provTile = ProviderItem(id: "prov-8", title: "Provider", pageId: "pProv8", type: .provider, paths: [:])

        _ = try await client.getMedia(mediaItem)
        _ = try await client.getMediaAssets(mediaItem)
        _ = try await client.getSimilarRecommendations(mediaItem)
        _ = try await client.getSeasonDetails(playbackItem, seasonNumber: 2)
        _ = try await client.getTitleState(mediaItem, providers: true)
        _ = try await client.getSeasonState(titleNoRef, seasonNumber: 1)
        _ = try await client.setRating(mediaItem, value: .liked)
        _ = try await client.clearRating(mediaItem)
        _ = try await client.addToWatchlist(mediaItem)
        _ = try await client.removeFromWatchlist(mediaItem)
        _ = try await client.markWatched(playbackItem, season: 2, episode: 5)
        _ = try await client.markUnwatched(titleNoRef, season: 1)
        _ = try await client.deletePlaybackItem(playbackItem)
        _ = try await client.scrobble(playbackItem, progress: 55, tv: EpisodeRef(season: 2, episode: 5))

        let tracker = client.trackPlayback(playbackItem)
        await tracker.stop(progress: 65)

        _ = try await client.getPage(navTile)
        _ = try await client.getRows(navTile)
        _ = try await client.getRow(provTile, rowId: "row_1")
        _ = try await client.getRowItems(provTile, rowId: "row_1")

        let paths = recorder.paths
        let bodies = recorder.bodies

        XCTAssertTrue(paths.contains { $0.contains("MV_550@row") || $0.contains("MV_550%40row") }, "Expected MV_550@row in \(paths)")
        XCTAssertTrue(paths.contains { $0.contains("TV_1396@cw") || $0.contains("TV_1396%40cw") }, "Expected TV_1396@cw in \(paths)")
        XCTAssertTrue(paths.contains { $0 == "GET /profile/titles/TV_1396/seasons/1" }, "Expected fallback to plain id in \(paths)")
        XCTAssertTrue(paths.contains { $0.contains("pAction123@nav") || $0.contains("pAction123%40nav") }, "Expected nav ref in \(paths)")
        XCTAssertTrue(paths.contains { $0 == "GET /pages/pProv8/rows/row_1/items" }, "Expected provider pageId fallback in \(paths)")

        let trackerBody = bodies.last { $0.contains("65") } ?? ""
        let parsed = try JSONSerialization.jsonObject(with: Data(trackerBody.utf8)) as? [String: Any]
        let tvObj = parsed?["tv"] as? [String: Any]
        XCTAssertEqual(tvObj?["season"] as? Int, 2, "Expected PlaybackItem tv season in \(trackerBody)")
        XCTAssertEqual(tvObj?["episode"] as? Int, 5, "Expected PlaybackItem tv episode in \(trackerBody)")
    }
}
