/**
 DiscovrClient — the single public entry point for the Discovr SDK.

 Extends the auto-generated `_DiscovrClientBase` (which contains all API
 methods with ergonomic labeled arguments) and owns the internal `_DiscovrAuth`
 actor that manages token storage, refresh, and auto-recovery.

 Customers never use `_DiscovrAuth` or `_DiscovrClientBase` directly.
 Authentication flows and all API calls are accessed through this class.

 ```swift
 let client = await DiscovrClient(clientId: "your-client-id")

 // Sign in (device flow)
 let code = try await client.signInWithDeviceCode()
 // Display code.userCode / code.qrCode to the user …
 for await state in await client.authStateStream {
     if state.signedIn { break }
 }

 // Select a profile
 let profiles = try await client.getProfiles()
 try await client.selectProfile(profileId: profiles.profiles.first!.id)

 // API calls
 let page = try await client.createPage()
 let rows = try await client.getRows(pageId: page.id)
 try await client.setRating(mediaId: "MV_550", value: .liked)
 ```
 */

import Foundation
#if canImport(AuthenticationServices) && !os(tvOS)
import AuthenticationServices
#endif

public final class DiscovrClient: _DiscovrClientBase, @unchecked Sendable {

    override var _auth: _DiscovrAuth { _internalAuth }
    private let _internalAuth: _DiscovrAuth

    override var _cache: _DiscovrCache { _internalCache }
    private let _internalCache: _DiscovrCache

    /// Clears cached page data when the recommendations turn over — not on
    /// every session token. Held so it can be cancelled from `deinit`.
    private var cacheClearTask: Task<Void, Never>?
    /// Wipes cached data without retrying if a forced sign-out occurs.
    private var authSignOutCacheTask: Task<Void, Never>?

    /// Create a fully-initialized client.
    ///
    /// The initializer is `async` so that previously stored Keychain tokens are
    /// loaded and available immediately — callers see the correct `isSignedIn`
    /// state as soon as `await DiscovrClient(...)` returns.
    public init(
        clientId: String,
        basePath: String = "https://api.discovr.media",
        debug: Bool = false,
        /// Enable the session-level response cache for deterministic/public
        /// endpoints (pages, rows, profiles, media, misc). Defaults to
        /// enabled — disable if you need every call to hit the network, e.g.
        /// in tests.
        cache: Bool = true,
        /// Run against a throwaway demo sandbox instead of a real account — no
        /// credentials or sign-up needed. Everything afterwards is the ordinary
        /// flow, so code written against a demo sandbox works unchanged against
        /// a real account. Sandboxes expire after a short window and are deleted.
        demoMode: Bool = false,
        /// Only meaningful with `demoMode: true`. Overrides how long each
        /// session token minted for the sandbox lives (milliseconds, default
        /// 15 minutes). Set this small (e.g. two minutes) to repeatedly
        /// exercise your app's silent session-refresh path on demand. See
        /// ``AuthConfig/demoSessionTtlMs``.
        demoSessionTtlMs: Int = 15 * 60 * 1000,
        /// Only meaningful with `demoMode: true`. Overrides how long the
        /// sandbox itself (and its refresh token) lives — milliseconds,
        /// default 30 minutes, unchanged unless set. See
        /// ``AuthConfig/demoRefreshTtlMs``.
        demoRefreshTtlMs: Int? = nil,
        /// Tune or disable the client-side runaway-loop breaker. Enabled by default.
        loopGuard: LoopGuardConfig = LoopGuardConfig(),
        /// Remember which profile was selected between launches. Defaults to
        /// `false`, like a streaming app: after a relaunch the user is still
        /// signed in but picks who's watching again. Set it to `true` to resume
        /// on the profile they last used. See ``AuthConfig/rememberProfile``.
        rememberProfile: Bool = false
    ) async {
        let auth = _DiscovrAuth(
            clientID: clientId,
            config: AuthConfig(
                basePath: basePath,
                debug: debug,
                demoMode: demoMode,
                demoSessionTtlMs: demoSessionTtlMs,
                demoRefreshTtlMs: demoRefreshTtlMs,
                loopGuard: loopGuard,
                rememberProfile: rememberProfile
            )
        )
        _internalAuth = auth
        _internalCache = _DiscovrCache(
            enabled: cache,
            retryScope: { [weak auth] in
                await auth?.activeRetryScope
            }
        )
        super.init()
        // Restore persisted tokens now that the actor is fully constructed.
        // Must happen after super.init() so self is fully initialized.
        await _internalAuth.restore()

        // Clear cached page data when the *recommendations* turn over, not on
        // every session mint. `clearForSnapshot` skips any buffered event for a
        // snapshot already cleared synchronously by `selectProfile`/`switchProfile`.
        let sessionStream = await _internalAuth.snapshotChangeStream()
        let initialProfileId = await _internalAuth.getActiveProfileId()
        let cache = _internalCache
        cacheClearTask = Task {
            var lastProfileId = initialProfileId
            for await _ in sessionStream {
                let currentProfileId = await auth.getActiveProfileId()
                let sameProfile = currentProfileId != nil && currentProfileId == lastProfileId
                lastProfileId = currentProfileId
                let snapshotId = await auth.currentSnapshotId
                await cache.clearForSnapshot(snapshotId, retryable: sameProfile)
            }
        }

        // Wipe cached data without retrying if a forced sign-out occurs (e.g.
        // expired/revoked refresh token during 401 recovery).
        let authStream = await _internalAuth.authStateStream()
        let initialSignedIn = await _internalAuth.isSignedIn
        authSignOutCacheTask = Task {
            var wasSignedIn = initialSignedIn
            for await state in authStream {
                if wasSignedIn && !state.signedIn {
                    await cache.clear(retryable: false)
                }
                wasSignedIn = state.signedIn
            }
        }
    }

    deinit {
        cacheClearTask?.cancel()
        authSignOutCacheTask?.cancel()
    }

    // ── Auth pass-throughs ────────────────────────────────────────────────────

    /** Live stream of auth-state changes. */
    public var authStateStream: AsyncStream<AuthState> {
        get async { await _auth.authStateStream() }
    }

    /**
     Live stream of session changes. Yields on the initial `selectProfile`, a
     profile switch, and each automatic renewal.

     Watch `snapshotId` rather than the emission itself to know when page data
     is stale — most of these are routine credential renewals that leave the
     user's recommendations exactly where they were.
     */
    public var sessionStateStream: AsyncStream<SessionState> {
        get async { await _auth.sessionStateStream() }
    }

    /**
     Yields when the user's recommendations turn over — the signal to rebuild
     what's on screen.

     Fires roughly every 30 minutes, as a snapshot ages out. Routine
     credential renewals don't yield here.
     Page ids don't change, so refetch the page you're already showing rather
     than recreating it.

     Unlike ``sessionStateStream`` this doesn't yield on subscribe: it reports
     an event, not a state, so a new consumer doesn't immediately refetch data
     it had only just loaded.
     */
    public var recommendationChangeStream: AsyncStream<Void> {
        get async { await _auth.snapshotChangeStream() }
    }

    /** True if a refresh token is held (signed in). */
    public var isSignedIn: Bool {
        get async { await _auth.isSignedIn }
    }

    /** True if a profile has been selected and a session token is held. */
    public var hasActiveProfile: Bool {
        get async { await _auth.hasActiveProfile }
    }

    /** Returns the currently selected profile ID, or nil. */
    public func getActiveProfileId() async -> String? {
        await _auth.getActiveProfileId()
    }

    /**
     Sign in to a throwaway demo sandbox — no credentials or sign-up needed.

     Everything afterwards is the ordinary flow (`getProfiles`,
     `selectProfile`, reads and writes), so code written against a demo sandbox
     works unchanged against a real account. Sandboxes expire after a short
     window and are deleted, so treat the data as disposable.

     Happens automatically on first use when the client is created with
     `demoMode: true`.
     */
    public func signInWithDemo() async throws {
        try await _auth.signInWithDemo()
    }

    /**
     Begin device-code sign-in. Returns display data immediately;
     observe ``authStateStream`` to detect completion.

     `qrSize` is the QR code's size in pixels (100-1000, default 300); a TV
     screen wants 600-800. The poll pace and the timeout are the server's; call
     `completion` on the result to learn that the person declined or the code
     lapsed.
     */
    public func signInWithDeviceCode(qrSize: Int? = nil) async throws -> DeviceCodeResult {
        try await _auth.signInWithDeviceCode(qrSize: qrSize)
    }

    /**
     Sign in using `ASWebAuthenticationSession` (iOS / macOS).

     Opens an in-app browser to `/auth/web/authorize`, waits for the redirect
     back to `redirectUri`, and stores the returned refresh token automatically.

     - Parameters:
       - redirectUri: The custom-scheme URI registered for this client
         (e.g. `"com.example.app://auth/callback"`).
       - presentationAnchor: The `ASPresentationAnchor` (window) to attach to.
     */
    #if canImport(AuthenticationServices) && !os(tvOS)
    @available(iOS 13.0, macOS 10.15, *)
    public func signInWithWebAuth(
        redirectUri: String,
        presentationAnchor: ASPresentationAnchor
    ) async throws {
        try await _auth.signInWithWebAuth(
            redirectUri: redirectUri,
            presentationAnchor: presentationAnchor
        )
    }
    #endif

    /**
     Select a profile and mint a session token bound to it. Must be called
     after sign-in before any session-tier API calls.
     */
    public func selectProfile(profileId: String) async throws {
        try await _auth.selectProfile(profileId)
        // Clear synchronously (non-retryable) and record the snapshot ID so
        // `cacheClearTask` does not fire a duplicate delayed clear right after
        // this call returns, and in-flight calls from a prior profile never retry.
        await _internalCache.clearAndMarkSnapshot(await _internalAuth.currentSnapshotId, retryable: false)
    }

    /**
     Switch to a different profile. Mints a new session token
     (which also starts a fresh recommendation snapshot).
     */
    public func switchProfile(profileId: String) async throws {
        try await _auth.switchProfile(profileId)
        await _internalCache.clearAndMarkSnapshot(await _internalAuth.currentSnapshotId, retryable: false)
    }

    /** Revoke the current device's refresh token and clear Keychain state. */
    public func signOut() async {
        // Clear first with retryable: false: local auth state is wiped inside
        // _auth.signOut() before it awaits the server-side revocation call, and
        // in-flight fetches must not retry into a signed-out session.
        await _cache.clear(retryable: false)
        await _auth.signOut()
    }

    /**
     Clear the session-level response cache. Cacheable calls (pages, rows,
     profiles, media, misc) after this will hit the network again. Also
     called automatically on profile switch, sign-out, and session rotation.
     */
    public func clearCache() async {
        await _cache.clear()
    }

    // ── Convenience title-list wrappers ───────────────────────────────────────

    /** List titles rated `liked` by the active profile, newest rated first. */
    public func getLiked(nextPageToken: String? = nil, limit: Int? = nil) async throws -> TitleListResponse {
        try await getTitles(rating: .liked, nextPageToken: nextPageToken, limit: limit)
    }

    /** List titles rated `disliked` by the active profile, newest rated first. */
    public func getDisliked(nextPageToken: String? = nil, limit: Int? = nil) async throws -> TitleListResponse {
        try await getTitles(rating: .disliked, nextPageToken: nextPageToken, limit: limit)
    }

    /** List titles rated `super_liked` by the active profile, newest rated first. */
    public func getSuperLiked(nextPageToken: String? = nil, limit: Int? = nil) async throws -> TitleListResponse {
        try await getTitles(rating: .superLiked, nextPageToken: nextPageToken, limit: limit)
    }

    /** List titles on the active profile's watchlist, newest added first. */
    public func getWatchlist(nextPageToken: String? = nil, limit: Int? = nil) async throws -> TitleListResponse {
        try await getTitles(watchlist: true, nextPageToken: nextPageToken, limit: limit)
    }

    /** List the active profile's watch history (one entry per title), most recently watched first. */
    public func getHistory(nextPageToken: String? = nil, limit: Int? = nil) async throws -> TitleListResponse {
        try await getTitles(watched: true, nextPageToken: nextPageToken, limit: limit)
    }

    // ── Playback tracker (A18) ────────────────────────────────────────────────

    /**
     Create a percentage-first ``PlaybackTracker`` for a movie or TV episode
     identified by raw media ID or `ref`.
     */
    public func trackPlayback(
        _ mediaId: String,
        tv: EpisodeRef? = nil,
        after previous: PlaybackTracker? = nil,
        onError: (@Sendable (Error) -> Void)? = nil,
        onCompleted: (@Sendable (ScrobbleResponse) -> Void)? = nil,
        heartbeatInterval: TimeInterval = PlaybackTracker.defaultHeartbeatInterval
    ) -> PlaybackTracker {
        PlaybackTracker(
            mediaRefOrId: mediaId,
            tv: tv,
            after: previous,
            onError: onError,
            onCompleted: onCompleted,
            heartbeatInterval: heartbeatInterval,
            send: { [self] id, progress, episodeRef in
                try await self.scrobble(mediaId: id, progress: progress, tv: episodeRef)
            }
        )
    }

    /**
     Create a percentage-first ``PlaybackTracker`` from any title item
     (`MediaItem`, `TitleListItem`, `PlaybackItem`, `SearchResult`,
     `SimilarResult`, `KnownForItem`), preserving its `ref`.

     When passed a ``PlaybackItem`` with `season` and `episode` and `tv` is
     omitted, `tv` automatically defaults to `EpisodeRef(season:episode:)`.
     */
    public func trackPlayback(
        _ item: any DiscovrTitleRef,
        tv: EpisodeRef? = nil,
        after previous: PlaybackTracker? = nil,
        onError: (@Sendable (Error) -> Void)? = nil,
        onCompleted: (@Sendable (ScrobbleResponse) -> Void)? = nil,
        heartbeatInterval: TimeInterval = PlaybackTracker.defaultHeartbeatInterval
    ) -> PlaybackTracker {
        let resolvedTv: EpisodeRef?
        if let tv {
            resolvedTv = tv
        } else if let playback = item as? PlaybackItem,
                  let season = playback.season,
                  let episode = playback.episode {
            resolvedTv = EpisodeRef(season: season, episode: episode)
        } else {
            resolvedTv = nil
        }
        return trackPlayback(
            item.refOrId,
            tv: resolvedTv,
            after: previous,
            onError: onError,
            onCompleted: onCompleted,
            heartbeatInterval: heartbeatInterval
        )
    }

    // ── Item-taking overloads (A16) ───────────────────────────────────────────
    // Accept item/tile models directly so attribution via `refOrId` is
    // automatic while keeping every labeled String signature intact for deep links.

    public func getMedia(_ item: any DiscovrTitleRef, bypassCache: Bool = false) async throws -> MediaResponse {
        try await getMedia(mediaId: item.refOrId, bypassCache: bypassCache)
    }

    public func getMediaAssets(_ item: any DiscovrTitleRef, bypassCache: Bool = false) async throws -> MediaAssetsResponse {
        try await getMediaAssets(mediaId: item.refOrId, bypassCache: bypassCache)
    }

    public func getSimilarRecommendations(
        _ item: any DiscovrTitleRef,
        language: String? = nil,
        page: Int? = nil,
        bypassCache: Bool = false
    ) async throws -> SimilarResponse {
        try await getSimilarRecommendations(mediaId: item.refOrId, language: language, page: page, bypassCache: bypassCache)
    }

    public func getSeasonDetails(
        _ item: any DiscovrTitleRef,
        seasonNumber: Int,
        language: String? = nil,
        bypassCache: Bool = false
    ) async throws -> SeasonDetailsResponse {
        try await getSeasonDetails(mediaId: item.refOrId, seasonNumber: seasonNumber, language: language, bypassCache: bypassCache)
    }

    public func getTitleState(_ item: any DiscovrTitleRef, providers: Bool? = false) async throws -> TitleState {
        try await getTitleState(mediaId: item.refOrId, providers: providers)
    }

    public func getSeasonState(_ item: any DiscovrTitleRef, seasonNumber: Int) async throws -> SeasonState {
        try await getSeasonState(mediaId: item.refOrId, seasonNumber: seasonNumber)
    }

    @discardableResult
    public func setRating(_ item: any DiscovrTitleRef, value: Rating) async throws -> TitleState {
        try await setRating(mediaId: item.refOrId, value: value)
    }

    @discardableResult
    public func clearRating(_ item: any DiscovrTitleRef) async throws -> TitleState {
        try await clearRating(mediaId: item.refOrId)
    }

    @discardableResult
    public func addToWatchlist(_ item: any DiscovrTitleRef) async throws -> TitleState {
        try await addToWatchlist(mediaId: item.refOrId)
    }

    @discardableResult
    public func removeFromWatchlist(_ item: any DiscovrTitleRef) async throws -> TitleState {
        try await removeFromWatchlist(mediaId: item.refOrId)
    }

    @discardableResult
    public func markWatched(
        _ item: any DiscovrTitleRef,
        season: Int? = nil,
        episode: Int? = nil
    ) async throws -> TitleState {
        try await markWatched(mediaId: item.refOrId, season: season, episode: episode)
    }

    @discardableResult
    public func markUnwatched(
        _ item: any DiscovrTitleRef,
        season: Int? = nil,
        episode: Int? = nil
    ) async throws -> TitleState {
        try await markUnwatched(mediaId: item.refOrId, season: season, episode: episode)
    }

    @discardableResult
    public func deletePlaybackItem(_ item: any DiscovrTitleRef) async throws -> SuccessMessage {
        try await deletePlaybackItem(mediaId: item.refOrId)
    }

    @discardableResult
    public func scrobble(
        _ item: any DiscovrTitleRef,
        progress: Double,
        tv: EpisodeRef? = nil
    ) async throws -> ScrobbleResponse {
        try await scrobble(mediaId: item.refOrId, progress: progress, tv: tv)
    }

    public func getPage(_ tile: any DiscovrPageRef, bypassCache: Bool = false) async throws -> Page {
        try await getPage(pageId: tile.refOrId, bypassCache: bypassCache)
    }

    public func getRows(
        _ tile: any DiscovrPageRef,
        nextPageToken: String? = nil,
        limit: Int? = nil,
        bypassCache: Bool = false
    ) async throws -> GetRowsResponse {
        try await getRows(pageId: tile.refOrId, nextPageToken: nextPageToken, limit: limit, bypassCache: bypassCache)
    }

    public func getRow(
        _ tile: any DiscovrPageRef,
        rowId: String,
        bypassCache: Bool = false
    ) async throws -> Row {
        try await getRow(pageId: tile.refOrId, rowId: rowId, bypassCache: bypassCache)
    }

    public func getRowItems(
        _ tile: any DiscovrPageRef,
        rowId: String,
        nextPageToken: String? = nil,
        limit: Int? = nil,
        bypassCache: Bool = false
    ) async throws -> GetRowItemsResponse {
        try await getRowItems(pageId: tile.refOrId, rowId: rowId, nextPageToken: nextPageToken, limit: limit, bypassCache: bypassCache)
    }
}

/// Any Discovr title model carrying an `id` and optional `ref`
/// (`MediaItem`, `TitleListItem`, `PlaybackItem`, `SearchResult`,
/// `SimilarResult`, `KnownForItem`).
public protocol DiscovrTitleRef: Sendable {
    var refOrId: String { get }
}

/// Any Discovr navigation or provider tile linking to a page
/// (`NavigationItem`, `ProviderItem`).
public protocol DiscovrPageRef: Sendable {
    var refOrId: String { get }
}


/**
 The value to pass onward for an item Discovr returned.

 Every media, navigation, provider and search item carries an `id` and, usually,
 a `ref` -- the same id with the place it was shown attached. The ref works
 anywhere the id does and tells Discovr which row or search surfaced the item,
 which sharpens that profile's recommendations.

 Prefer these over reaching for `.id` directly:

 ```swift
 let details = try await client.getMedia(mediaId: item.refOrId)
 let page = try await client.getPage(pageId: tile.refOrId)
 ```

 Navigation and provider tiles are keyed by the page they open rather than by
 their own id, so theirs falls back to `pageId` -- the same call works for every
 kind of item a row can contain.
 */
public extension MediaItem {
    var refOrId: String { ref ?? id }
}

extension MediaItem: DiscovrTitleRef {}

public extension SearchResult {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? id }
}

extension SearchResult: DiscovrTitleRef {}

public extension NavigationItem {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? pageId }
}

extension NavigationItem: DiscovrPageRef {}

public extension ProviderItem {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? pageId }
}

extension ProviderItem: DiscovrPageRef {}

public extension SimilarResult {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? id }
}

extension SimilarResult: DiscovrTitleRef {}

public extension KnownForItem {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? id }
}

extension KnownForItem: DiscovrTitleRef {}

public extension TitleListItem {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? id }
}

extension TitleListItem: DiscovrTitleRef {}

public extension PlaybackItem {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? id }
}

extension PlaybackItem: DiscovrTitleRef {}

/**
 The plain id behind a `ref`, or the id itself if that's what you were given.

 Pass the `ref` to anything your user does or any screen they move to. But when
 all you're holding is that one string -- a navigation argument, a saved
 "recently viewed" list -- and you need the title's id for a cache key, a
 shareable link, or a log line, this gets it back:

 ```swift
 idOf("MV_550@...") // "MV_550"
 idOf("MV_550")     // "MV_550"
 ```
 */
public func idOf(_ refOrId: String) -> String {
    guard let at = refOrId.firstIndex(of: "@") else { return refOrId }
    return String(refOrId[..<at])
}
