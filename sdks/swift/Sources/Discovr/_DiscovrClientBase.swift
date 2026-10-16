// AUTO-GENERATED — do not edit.
import Foundation

// swiftlint:disable file_length function_parameter_count
open class _DiscovrClientBase: @unchecked Sendable {

    // Provided by DiscovrClient
    var _auth: _DiscovrAuth { fatalError("_auth must be overridden") }
    var _cache: _DiscovrCache { fatalError("_cache must be overridden") }

    // ── Configuration accessors ──────────────────────────────────────────────

    private var _sessionConfig: DiscovrAPIConfiguration {
        _auth.sessionAPIConfiguration()
    }

    private var _identityConfig: DiscovrAPIConfiguration {
        _auth.identityAPIConfiguration()
    }

    private var _publicConfig: DiscovrAPIConfiguration {
        _auth.publicAPIConfiguration()
    }

    // ── Identity tier — refresh token bearer (/profiles, /auth/sessions) ─────────────────────────────────────────────────────

    @discardableResult
    public func mintSessionToken(profileId: String, ttlMs: Int? = nil, snapshotId: String? = nil) async throws -> SessionTokenResponse {
        return try await DiscovrAPI.mintSessionToken(mintSessionTokenPayload: MintSessionTokenPayload(profileId: profileId, ttlMs: ttlMs, snapshotId: snapshotId), apiConfiguration: self._identityConfig)
    }

    @discardableResult
    public func signOutSession() async throws -> SignOutSession200Response {
        return try await DiscovrAPI.signOutSession(apiConfiguration: self._identityConfig)
    }

    public func getProfiles(bypassCache: Bool = false) async throws -> GetProfilesResponse {
        return try await _cache.wrap(
            operationId: "getProfiles",
            keyParams: [:],
            ttlSeconds: nil,
            bypass: bypassCache
        ) {
            try await DiscovrAPI.getProfiles(apiConfiguration: self._identityConfig)
        }
    }

    @discardableResult
    public func createProfile(name: String, avatarUrl: String, avatarMediaType: AvatarMediaType? = nil) async throws -> CreateProfileResponse {
        let result = try await DiscovrAPI.createProfile(createProfilePayload: CreateProfilePayload(name: name, avatarUrl: avatarUrl, avatarMediaType: avatarMediaType), apiConfiguration: self._identityConfig)
        await _cache.invalidate(["getProfiles"])
        return result
    }

    public func getProfile(profileId: String, bypassCache: Bool = false) async throws -> Profile {
        return try await _cache.wrap(
            operationId: "getProfile",
            keyParams: ["profileId": String(describing: profileId)],
            ttlSeconds: nil,
            bypass: bypassCache
        ) {
            try await DiscovrAPI.getProfile(profileId: profileId, apiConfiguration: self._identityConfig)
        }
    }

    @discardableResult
    public func updateProfile(profileId: String, name: String? = nil, avatarUrl: String? = nil, avatarMediaType: AvatarMediaType? = nil) async throws -> Profile {
        let result = try await DiscovrAPI.updateProfile(profileId: profileId, updateProfilePayload: UpdateProfilePayload(name: name, avatarUrl: avatarUrl, avatarMediaType: avatarMediaType), apiConfiguration: self._identityConfig)
        await _cache.invalidate(["getProfiles", "getProfile"])
        return result
    }

    @discardableResult
    public func deleteProfile(profileId: String) async throws -> DeleteProfileResponse {
        let result = try await DiscovrAPI.deleteProfile(profileId: profileId, apiConfiguration: self._identityConfig)
        await _cache.invalidate(["getProfiles", "getProfile"])
        return result
    }

    // ── Session tier — session token bearer ─────────────────────────────────────────────────────

    @discardableResult
    public func createPage(pageFilters: FilterSpec? = nil, name: String? = nil, bypassCache: Bool = false) async throws -> CreatePageResponse {
        return try await _cache.wrap(
            operationId: "createPage",
            keyParams: ["pageFilters": String(describing: pageFilters), "name": String(describing: name)],
            ttlSeconds: nil,
            bypass: bypassCache
        ) {
            try await DiscovrAPI.createPage(createPagePayload: CreatePagePayload(pageFilters: pageFilters, name: name), apiConfiguration: self._sessionConfig)
        }
    }

    public func getPage(pageId: String, bypassCache: Bool = false) async throws -> Page {
        return try await _cache.wrap(
            operationId: "getPage",
            keyParams: ["pageId": String(describing: pageId)],
            ttlSeconds: nil,
            bypass: bypassCache
        ) {
            try await DiscovrAPI.getPage(pageId: pageId, apiConfiguration: self._sessionConfig)
        }
    }

    public func getRows(pageId: String, nextPageToken: String? = nil, limit: Int? = nil, bypassCache: Bool = false) async throws -> GetRowsResponse {
        return try await _cache.wrap(
            operationId: "getRows",
            keyParams: ["pageId": String(describing: pageId), "nextPageToken": String(describing: nextPageToken), "limit": String(describing: limit)],
            ttlSeconds: nil,
            bypass: bypassCache
        ) {
            try await DiscovrAPI.getRows(pageId: pageId, nextPageToken: nextPageToken, limit: limit, apiConfiguration: self._sessionConfig)
        }
    }

    public func getRow(pageId: String, rowId: String, bypassCache: Bool = false) async throws -> Row {
        return try await _cache.wrap(
            operationId: "getRow",
            keyParams: ["pageId": String(describing: pageId), "rowId": String(describing: rowId)],
            ttlSeconds: nil,
            bypass: bypassCache
        ) {
            try await DiscovrAPI.getRow(pageId: pageId, rowId: rowId, apiConfiguration: self._sessionConfig)
        }
    }

    public func getRowItems(pageId: String, rowId: String, nextPageToken: String? = nil, limit: Int? = nil, bypassCache: Bool = false) async throws -> GetRowItemsResponse {
        return try await _cache.wrap(
            operationId: "getRowItems",
            keyParams: ["pageId": String(describing: pageId), "rowId": String(describing: rowId), "nextPageToken": String(describing: nextPageToken), "limit": String(describing: limit)],
            ttlSeconds: nil,
            bypass: bypassCache
        ) {
            try await DiscovrAPI.getRowItems(pageId: pageId, rowId: rowId, nextPageToken: nextPageToken, limit: limit, apiConfiguration: self._sessionConfig)
        }
    }

    public func getLikedItems(nextPageToken: String? = nil, limit: Int? = nil) async throws -> SimpleListResponse {
        return try await DiscovrAPI.getLikedItems(nextPageToken: nextPageToken, limit: limit, apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func addLikedItem(mediaId: String) async throws -> SuccessMessage {
        return try await DiscovrAPI.addLikedItem(addSimpleListItemPayload: AddSimpleListItemPayload(mediaId: mediaId), apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func deleteLikedItem(mediaId: String) async throws -> SuccessMessage {
        return try await DiscovrAPI.deleteLikedItem(mediaId: mediaId, apiConfiguration: self._sessionConfig)
    }

    public func getDislikedItems(nextPageToken: String? = nil, limit: Int? = nil) async throws -> SimpleListResponse {
        return try await DiscovrAPI.getDislikedItems(nextPageToken: nextPageToken, limit: limit, apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func addDislikedItem(mediaId: String) async throws -> SuccessMessage {
        return try await DiscovrAPI.addDislikedItem(addSimpleListItemPayload: AddSimpleListItemPayload(mediaId: mediaId), apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func deleteDislikedItem(mediaId: String) async throws -> SuccessMessage {
        return try await DiscovrAPI.deleteDislikedItem(mediaId: mediaId, apiConfiguration: self._sessionConfig)
    }

    public func getSuperLikedItems(nextPageToken: String? = nil, limit: Int? = nil) async throws -> SimpleListResponse {
        return try await DiscovrAPI.getSuperLikedItems(nextPageToken: nextPageToken, limit: limit, apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func addSuperLikedItem(mediaId: String) async throws -> SuccessMessage {
        return try await DiscovrAPI.addSuperLikedItem(addSimpleListItemPayload: AddSimpleListItemPayload(mediaId: mediaId), apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func deleteSuperLikedItem(mediaId: String) async throws -> SuccessMessage {
        return try await DiscovrAPI.deleteSuperLikedItem(mediaId: mediaId, apiConfiguration: self._sessionConfig)
    }

    public func getWatchlistItems(nextPageToken: String? = nil, limit: Int? = nil) async throws -> SimpleListResponse {
        return try await DiscovrAPI.getWatchlistItems(nextPageToken: nextPageToken, limit: limit, apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func addWatchlistItem(mediaId: String) async throws -> SuccessMessage {
        return try await DiscovrAPI.addWatchlistItem(addSimpleListItemPayload: AddSimpleListItemPayload(mediaId: mediaId), apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func deleteWatchlistItem(mediaId: String) async throws -> SuccessMessage {
        return try await DiscovrAPI.deleteWatchlistItem(mediaId: mediaId, apiConfiguration: self._sessionConfig)
    }

    public func getPlaybackItems(nextPageToken: String? = nil, limit: Int? = nil) async throws -> PlaybackListResponse {
        return try await DiscovrAPI.getPlaybackItems(nextPageToken: nextPageToken, limit: limit, apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func addPlaybackItem(mediaId: String, progress: Double? = nil, updatedAt: Date? = nil) async throws -> SuccessMessage {
        return try await DiscovrAPI.addPlaybackItem(addPlaybackPayload: AddPlaybackPayload(mediaId: mediaId, progress: progress, updatedAt: updatedAt), apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func updatePlaybackItem(mediaId: String, progress: Double? = nil, updatedAt: Date? = nil) async throws -> SuccessMessage {
        return try await DiscovrAPI.updatePlaybackItem(editPlaybackPayload: EditPlaybackPayload(mediaId: mediaId, progress: progress, updatedAt: updatedAt), apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func deletePlaybackItem(mediaId: String) async throws -> SuccessMessage {
        return try await DiscovrAPI.deletePlaybackItem(mediaId: mediaId, apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func markUnwatched(mediaId: String, season: Int? = nil, episode: Int? = nil) async throws -> SuccessMessage {
        return try await DiscovrAPI.markUnwatched(mediaId: mediaId, season: season, episode: episode, apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func scrobble(mediaId: String, progress: Double, tv: ScrobbleTv? = nil) async throws -> ScrobbleResponse {
        return try await DiscovrAPI.scrobble(mediaId: mediaId, scrobbleProgressBody: ScrobbleProgressBody(progress: progress, tv: tv), apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func scrobbleSkip(mediaId: String, from: Double, to: Double, duration: Double, tv: ScrobbleTv? = nil) async throws -> ScrobbleSkipResponse {
        return try await DiscovrAPI.scrobbleSkip(mediaId: mediaId, scrobbleSkipBody: ScrobbleSkipBody(from: from, to: to, duration: duration, tv: tv), apiConfiguration: self._sessionConfig)
    }

    public func getHistoryItems(nextPageToken: String? = nil, limit: Int? = nil) async throws -> HistoryListResponse {
        return try await DiscovrAPI.getHistoryItems(nextPageToken: nextPageToken, limit: limit, apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func addHistoryItem(mediaId: String, updatedAt: Date? = nil, progress: Double? = nil, season: Int? = nil, episode: Int? = nil, imported: String? = nil) async throws -> SuccessMessage {
        return try await DiscovrAPI.addHistoryItem(addHistoryPayload: AddHistoryPayload(mediaId: mediaId, updatedAt: updatedAt, progress: progress, season: season, episode: episode, imported: imported), apiConfiguration: self._sessionConfig)
    }

    public func getHistoryItemsByMediaId(mediaId: String, season: Int? = nil, episode: Int? = nil, nextPageToken: String? = nil, limit: Int? = nil) async throws -> HistoryListResponse {
        return try await DiscovrAPI.getHistoryItemsByMediaId(mediaId: mediaId, season: season, episode: episode, nextPageToken: nextPageToken, limit: limit, apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func patchHistoryItem(mediaId: String, progress: Double, season: Int? = nil, episode: Int? = nil) async throws -> SuccessMessage {
        return try await DiscovrAPI.patchHistoryItem(mediaId: mediaId, patchHistoryPayload: PatchHistoryPayload(progress: progress), season: season, episode: episode, apiConfiguration: self._sessionConfig)
    }

    @discardableResult
    public func deleteHistoryItem(mediaId: String, season: Int? = nil, episode: Int? = nil) async throws -> SuccessMessage {
        return try await DiscovrAPI.deleteHistoryItem(mediaId: mediaId, season: season, episode: episode, apiConfiguration: self._sessionConfig)
    }

    public func getMediaProfileMeta(mediaId: String, providers: Bool? = false) async throws -> MediaProfileMeta {
        return try await DiscovrAPI.getMediaProfileMeta(mediaId: mediaId, providers: providers, apiConfiguration: self._sessionConfig)
    }

    public func getSeasonProfileMeta(mediaId: String, seasonNumber: Int) async throws -> SeasonProfileMeta {
        return try await DiscovrAPI.getSeasonProfileMeta(mediaId: mediaId, seasonNumber: seasonNumber, apiConfiguration: self._sessionConfig)
    }

    public func searchMedia(query: String? = nil, q: String? = nil, page: Int? = nil, bypassCache: Bool = false) async throws -> SearchResponse {
        return try await _cache.wrap(
            operationId: "searchMedia",
            keyParams: ["query": String(describing: query), "q": String(describing: q), "page": String(describing: page)],
            ttlSeconds: 3600.0,
            bypass: bypassCache
        ) {
            try await DiscovrAPI.searchMedia(query: query, q: q, page: page, apiConfiguration: self._sessionConfig)
        }
    }

    // ── Public endpoints — no bearer required ─────────────────────────────────────────────────────

    @discardableResult
    public func requestDeviceCode(clientID: String, demo: Bool? = false, size: Int? = nil, format: DiscovrAPI.Format_requestDeviceCode? = nil) async throws -> DeviceCodeResponse {
        return try await DiscovrAPI.requestDeviceCode(deviceCodePayload: DeviceCodePayload(clientID: clientID, demo: demo), size: size, format: format, apiConfiguration: self._publicConfig)
    }

    @discardableResult
    public func pollDeviceCode(deviceCode: String) async throws -> PollDeviceCode200Response {
        return try await DiscovrAPI.pollDeviceCode(deviceCode: deviceCode, apiConfiguration: self._publicConfig)
    }

    public func authorizeClientWeb(clientID: String, state: String, codeChallenge: String, codeChallengeMethod: DiscovrAPI.CodeChallengeMethod_authorizeClientWeb, redirectURL: String? = nil, platform: DiscovrAPI.Platform_authorizeClientWeb? = nil) async throws -> Void {
        return try await DiscovrAPI.authorizeClientWeb(clientID: clientID, state: state, codeChallenge: codeChallenge, codeChallengeMethod: codeChallengeMethod, redirectURL: redirectURL, platform: platform, apiConfiguration: self._publicConfig)
    }

    @discardableResult
    public func exchangeWebAuthCode(clientID: String, code: String, codeVerifier: String) async throws -> RefreshTokenResponse {
        return try await DiscovrAPI.exchangeWebAuthCode(webTokenPayload: WebTokenPayload(clientID: clientID, code: code, codeVerifier: codeVerifier), apiConfiguration: self._publicConfig)
    }

    @discardableResult
    public func startDemoSession(clientId: String, ttlMs: Int? = nil) async throws -> DemoSessionResponse {
        return try await DiscovrAPI.startDemoSession(demoSessionRequest: DemoSessionRequest(clientId: clientId, ttlMs: ttlMs), apiConfiguration: self._publicConfig)
    }

    public func getMedia(mediaId: String, bypassCache: Bool = false) async throws -> MediaResponse {
        return try await _cache.wrap(
            operationId: "getMedia",
            keyParams: ["mediaId": String(describing: mediaId)],
            ttlSeconds: nil,
            bypass: bypassCache
        ) {
            try await DiscovrAPI.getMedia(mediaId: mediaId, apiConfiguration: self._publicConfig)
        }
    }

    public func getMediaAssets(mediaId: String, bypassCache: Bool = false) async throws -> MediaAssetsResponse {
        return try await _cache.wrap(
            operationId: "getMediaAssets",
            keyParams: ["mediaId": String(describing: mediaId)],
            ttlSeconds: nil,
            bypass: bypassCache
        ) {
            try await DiscovrAPI.getMediaAssets(mediaId: mediaId, apiConfiguration: self._publicConfig)
        }
    }

    public func getSeasonDetails(mediaId: String, seasonNumber: Int, language: String? = nil, bypassCache: Bool = false) async throws -> SeasonDetailsResponse {
        return try await _cache.wrap(
            operationId: "getSeasonDetails",
            keyParams: ["mediaId": String(describing: mediaId), "seasonNumber": String(describing: seasonNumber), "language": String(describing: language)],
            ttlSeconds: nil,
            bypass: bypassCache
        ) {
            try await DiscovrAPI.getSeasonDetails(mediaId: mediaId, seasonNumber: seasonNumber, language: language, apiConfiguration: self._publicConfig)
        }
    }

    public func getSimilarRecommendations(mediaId: String, language: String? = nil, page: Int? = nil, bypassCache: Bool = false) async throws -> SimilarResponse {
        return try await _cache.wrap(
            operationId: "getSimilarRecommendations",
            keyParams: ["mediaId": String(describing: mediaId), "language": String(describing: language), "page": String(describing: page)],
            ttlSeconds: 3600.0,
            bypass: bypassCache
        ) {
            try await DiscovrAPI.getSimilarRecommendations(mediaId: mediaId, language: language, page: page, apiConfiguration: self._publicConfig)
        }
    }

    public func getProfileImages(limit: Int? = nil, pageToken: String? = nil, bypassCache: Bool = false) async throws -> ProfileImagesResponse {
        return try await _cache.wrap(
            operationId: "getProfileImages",
            keyParams: ["limit": String(describing: limit), "pageToken": String(describing: pageToken)],
            ttlSeconds: nil,
            bypass: bypassCache
        ) {
            try await DiscovrAPI.getProfileImages(limit: limit, pageToken: pageToken, apiConfiguration: self._publicConfig)
        }
    }

    public func searchGifs(q: String, limit: Int? = nil, pos: String? = nil, contentfilter: DiscovrAPI.Contentfilter_searchGifs? = nil, country: String? = nil, locale: String? = nil, bypassCache: Bool = false) async throws -> GifSearchResponse {
        return try await _cache.wrap(
            operationId: "searchGifs",
            keyParams: ["q": String(describing: q), "limit": String(describing: limit), "pos": String(describing: pos), "contentfilter": String(describing: contentfilter), "country": String(describing: country), "locale": String(describing: locale)],
            ttlSeconds: 3600.0,
            bypass: bypassCache
        ) {
            try await DiscovrAPI.searchGifs(q: q, limit: limit, pos: pos, contentfilter: contentfilter, country: country, locale: locale, apiConfiguration: self._publicConfig)
        }
    }

}