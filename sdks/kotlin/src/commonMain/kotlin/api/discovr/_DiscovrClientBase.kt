// AUTO-GENERATED — do not edit.
@file:Suppress("TooManyFunctions", "LongParameterList")

package api.discovr

import api.discovr.apis.DiscovrApi
import api.discovr.auth._DiscovrAuth
import api.discovr.auth.TokenInvalidError
import api.discovr.auth.RateLimitedError
import api.discovr.auth.retryAfterSeconds
import api.discovr.infrastructure.HttpResponse
import api.discovr.models.AddHistoryPayload
import api.discovr.models.AddPlaybackPayload
import api.discovr.models.AddSimpleListItemPayload
import api.discovr.models.AvatarMediaType
import api.discovr.models.CreatePagePayload
import api.discovr.models.CreatePageResponse
import api.discovr.models.CreateProfilePayload
import api.discovr.models.CreateProfileResponse
import api.discovr.models.DeleteProfileResponse
import api.discovr.models.DemoSessionRequest
import api.discovr.models.DemoSessionResponse
import api.discovr.models.DeviceCodePayload
import api.discovr.models.DeviceCodeResponse
import api.discovr.models.DevicePollPayload
import api.discovr.models.EditPlaybackPayload
import api.discovr.models.FilterSpec
import api.discovr.models.GetProfilesResponse
import api.discovr.models.GetRowItemsResponse
import api.discovr.models.GetRowsResponse
import api.discovr.models.GifSearchResponse
import api.discovr.models.HistoryListResponse
import api.discovr.models.MediaAssetsResponse
import api.discovr.models.MediaProfileMeta
import api.discovr.models.MediaResponse
import api.discovr.models.MintSessionTokenPayload
import api.discovr.models.Page
import api.discovr.models.PatchHistoryPayload
import api.discovr.models.PlaybackListResponse
import api.discovr.models.PollDeviceCode200Response
import api.discovr.models.Profile
import api.discovr.models.ProfileImagesResponse
import api.discovr.models.RefreshTokenResponse
import api.discovr.models.Row
import api.discovr.models.ScrobbleProgressBody
import api.discovr.models.ScrobbleResponse
import api.discovr.models.ScrobbleSkipBody
import api.discovr.models.ScrobbleSkipResponse
import api.discovr.models.ScrobbleTv
import api.discovr.models.SearchResponse
import api.discovr.models.SeasonDetailsResponse
import api.discovr.models.SeasonProfileMeta
import api.discovr.models.SessionTokenResponse
import api.discovr.models.SignOutSession200Response
import api.discovr.models.SimilarResponse
import api.discovr.models.SimpleListResponse
import api.discovr.models.SuccessMessage
import api.discovr.models.UpdateProfilePayload
import api.discovr.models.WebTokenPayload
import io.ktor.client.statement.bodyAsText

class DiscovrException(val statusCode: Int, message: String = "") : Exception("Discovr API error $statusCode: $message")

abstract class _DiscovrClientBase {

    internal abstract val _auth: _DiscovrAuth
    internal abstract val _cache: _DiscovrCache
    internal abstract val _sessionApi: DiscovrApi
    internal abstract val _identityApi: DiscovrApi

    // ── Internal session-tier call helper with auto-recovery ──────────────────

    internal suspend inline fun <reified T : Any> sessionApiCall(
        crossinline call: suspend DiscovrApi.() -> HttpResponse<T>,
    ): T {
        val resp = _sessionApi.call()
        if (resp.success) return resp.body()
        if (resp.status == 429) throw RateLimitedError(
            "Too many requests — slow down and try again shortly.",
            retryAfterSeconds(resp.response.headers["Retry-After"]),
        )
        if (resp.status != 401) throw DiscovrException(resp.status)
        val rawBody = resp.response.bodyAsText()
        val action = _auth.handleSessionErrorBody(rawBody)
        return when (action) {
            is _DiscovrAuth.RecoveryAction.RetryWithBearer -> {
                val retry = _sessionApi.call()
                if (retry.success) retry.body() else throw DiscovrException(retry.status)
            }
            is _DiscovrAuth.RecoveryAction.SignedOut -> throw TokenInvalidError("Refresh token expired")
            is _DiscovrAuth.RecoveryAction.NoOp -> throw DiscovrException(resp.status, rawBody)
        }
    }

    internal suspend inline fun <reified T : Any> identityApiCall(
        crossinline call: suspend DiscovrApi.() -> HttpResponse<T>,
    ): T {
        val resp = _identityApi.call()
        if (resp.success) return resp.body()
        if (resp.status == 401) {
            val rawBody = resp.response.bodyAsText()
            if (_auth.handleIdentityErrorBody(rawBody)) throw TokenInvalidError("Refresh token expired")
            throw DiscovrException(resp.status, rawBody)
        }
        throw DiscovrException(resp.status)
    }

    // ── Identity tier — refresh token bearer (/profiles, /auth/sessions) ─────────────────────────────────────────────────────

    suspend fun mintSessionToken(profileId: String, ttlMs: Int? = null, snapshotId: String? = null): SessionTokenResponse =
        identityApiCall { mintSessionToken(MintSessionTokenPayload(profileId = profileId, ttlMs = ttlMs, snapshotId = snapshotId)) }

    suspend fun signOutSession(): SignOutSession200Response =
        identityApiCall { signOutSession() }

    suspend fun getProfiles(bypassCache: Boolean = false): GetProfilesResponse =
        _cache.wrap("getProfiles", mapOf(), null, bypassCache) { identityApiCall { getProfiles() } }

    suspend fun createProfile(name: String, avatarUrl: String, avatarMediaType: AvatarMediaType? = null): CreateProfileResponse {
        val result = identityApiCall { createProfile(CreateProfilePayload(name = name, avatarUrl = avatarUrl, avatarMediaType = avatarMediaType)) }
        _cache.invalidate(listOf("getProfiles"))
        return result
    }

    suspend fun getProfile(profileId: String, bypassCache: Boolean = false): Profile =
        _cache.wrap("getProfile", mapOf("profileId" to profileId), null, bypassCache) { identityApiCall { getProfile(profileId) } }

    suspend fun updateProfile(profileId: String, name: String? = null, avatarUrl: String? = null, avatarMediaType: AvatarMediaType? = null): Profile {
        val result = identityApiCall { updateProfile(profileId, UpdateProfilePayload(name = name, avatarUrl = avatarUrl, avatarMediaType = avatarMediaType)) }
        _cache.invalidate(listOf("getProfiles", "getProfile"))
        return result
    }

    suspend fun deleteProfile(profileId: String): DeleteProfileResponse {
        val result = identityApiCall { deleteProfile(profileId) }
        _cache.invalidate(listOf("getProfiles", "getProfile"))
        return result
    }

    // ── Session tier — session token bearer ─────────────────────────────────────────────────────

    suspend fun createPage(pageFilters: FilterSpec? = null, name: String? = null, bypassCache: Boolean = false): CreatePageResponse =
        _cache.wrap("createPage", mapOf("pageFilters" to pageFilters, "name" to name), null, bypassCache) { sessionApiCall { createPage(CreatePagePayload(pageFilters = pageFilters, name = name)) } }

    suspend fun getPage(pageId: String, bypassCache: Boolean = false): Page =
        _cache.wrap("getPage", mapOf("pageId" to pageId), null, bypassCache) { sessionApiCall { getPage(pageId) } }

    suspend fun getRows(pageId: String, nextPageToken: String? = null, limit: Int? = null, bypassCache: Boolean = false): GetRowsResponse =
        _cache.wrap("getRows", mapOf("pageId" to pageId, "nextPageToken" to nextPageToken, "limit" to limit), null, bypassCache) { sessionApiCall { getRows(pageId, nextPageToken = nextPageToken, limit = limit) } }

    suspend fun getRow(pageId: String, rowId: String, bypassCache: Boolean = false): Row =
        _cache.wrap("getRow", mapOf("pageId" to pageId, "rowId" to rowId), null, bypassCache) { sessionApiCall { getRow(pageId, rowId) } }

    suspend fun getRowItems(pageId: String, rowId: String, nextPageToken: String? = null, limit: Int? = null, bypassCache: Boolean = false): GetRowItemsResponse =
        _cache.wrap("getRowItems", mapOf("pageId" to pageId, "rowId" to rowId, "nextPageToken" to nextPageToken, "limit" to limit), null, bypassCache) { sessionApiCall { getRowItems(pageId, rowId, nextPageToken = nextPageToken, limit = limit) } }

    suspend fun getLikedItems(nextPageToken: String? = null, limit: Int? = null): SimpleListResponse =
        sessionApiCall { getLikedItems(nextPageToken = nextPageToken, limit = limit) }

    suspend fun addLikedItem(mediaId: String): SuccessMessage =
        sessionApiCall { addLikedItem(AddSimpleListItemPayload(mediaId = mediaId)) }

    suspend fun deleteLikedItem(mediaId: String): SuccessMessage =
        sessionApiCall { deleteLikedItem(mediaId) }

    suspend fun getDislikedItems(nextPageToken: String? = null, limit: Int? = null): SimpleListResponse =
        sessionApiCall { getDislikedItems(nextPageToken = nextPageToken, limit = limit) }

    suspend fun addDislikedItem(mediaId: String): SuccessMessage =
        sessionApiCall { addDislikedItem(AddSimpleListItemPayload(mediaId = mediaId)) }

    suspend fun deleteDislikedItem(mediaId: String): SuccessMessage =
        sessionApiCall { deleteDislikedItem(mediaId) }

    suspend fun getSuperLikedItems(nextPageToken: String? = null, limit: Int? = null): SimpleListResponse =
        sessionApiCall { getSuperLikedItems(nextPageToken = nextPageToken, limit = limit) }

    suspend fun addSuperLikedItem(mediaId: String): SuccessMessage =
        sessionApiCall { addSuperLikedItem(AddSimpleListItemPayload(mediaId = mediaId)) }

    suspend fun deleteSuperLikedItem(mediaId: String): SuccessMessage =
        sessionApiCall { deleteSuperLikedItem(mediaId) }

    suspend fun getWatchlistItems(nextPageToken: String? = null, limit: Int? = null): SimpleListResponse =
        sessionApiCall { getWatchlistItems(nextPageToken = nextPageToken, limit = limit) }

    suspend fun addWatchlistItem(mediaId: String): SuccessMessage =
        sessionApiCall { addWatchlistItem(AddSimpleListItemPayload(mediaId = mediaId)) }

    suspend fun deleteWatchlistItem(mediaId: String): SuccessMessage =
        sessionApiCall { deleteWatchlistItem(mediaId) }

    suspend fun getPlaybackItems(nextPageToken: String? = null, limit: Int? = null): PlaybackListResponse =
        sessionApiCall { getPlaybackItems(nextPageToken = nextPageToken, limit = limit) }

    suspend fun addPlaybackItem(mediaId: String, progress: Double? = null, updatedAt: kotlin.time.Instant? = null): SuccessMessage =
        sessionApiCall { addPlaybackItem(AddPlaybackPayload(mediaId = mediaId, progress = progress, updatedAt = updatedAt)) }

    suspend fun updatePlaybackItem(mediaId: String, progress: Double? = null, updatedAt: kotlin.time.Instant? = null): SuccessMessage =
        sessionApiCall { updatePlaybackItem(EditPlaybackPayload(mediaId = mediaId, progress = progress, updatedAt = updatedAt)) }

    suspend fun deletePlaybackItem(mediaId: String): SuccessMessage =
        sessionApiCall { deletePlaybackItem(mediaId) }

    suspend fun markUnwatched(mediaId: String, season: Int? = null, episode: Int? = null): SuccessMessage =
        sessionApiCall { markUnwatched(mediaId, season = season, episode = episode) }

    suspend fun scrobble(mediaId: String, progress: Double, tv: ScrobbleTv? = null): ScrobbleResponse =
        sessionApiCall { scrobble(mediaId, ScrobbleProgressBody(progress = progress, tv = tv)) }

    suspend fun scrobbleSkip(mediaId: String, from: Double, to: Double, duration: Double, tv: ScrobbleTv? = null): ScrobbleSkipResponse =
        sessionApiCall { scrobbleSkip(mediaId, ScrobbleSkipBody(from = from, to = to, duration = duration, tv = tv)) }

    suspend fun getHistoryItems(nextPageToken: String? = null, limit: Int? = null): HistoryListResponse =
        sessionApiCall { getHistoryItems(nextPageToken = nextPageToken, limit = limit) }

    suspend fun addHistoryItem(mediaId: String, updatedAt: kotlin.time.Instant? = null, progress: Double? = null, season: Int? = null, episode: Int? = null, imported: String? = null): SuccessMessage =
        sessionApiCall { addHistoryItem(AddHistoryPayload(mediaId = mediaId, updatedAt = updatedAt, progress = progress, season = season, episode = episode, imported = imported)) }

    suspend fun getHistoryItemsByMediaId(mediaId: String, season: Int? = null, episode: Int? = null, nextPageToken: String? = null, limit: Int? = null): HistoryListResponse =
        sessionApiCall { getHistoryItemsByMediaId(mediaId, season = season, episode = episode, nextPageToken = nextPageToken, limit = limit) }

    suspend fun patchHistoryItem(mediaId: String, progress: Double, season: Int? = null, episode: Int? = null): SuccessMessage =
        sessionApiCall { patchHistoryItem(mediaId, PatchHistoryPayload(progress = progress), season = season, episode = episode) }

    suspend fun deleteHistoryItem(mediaId: String, season: Int? = null, episode: Int? = null): SuccessMessage =
        sessionApiCall { deleteHistoryItem(mediaId, season = season, episode = episode) }

    suspend fun getMediaProfileMeta(mediaId: String, providers: Boolean? = false): MediaProfileMeta =
        sessionApiCall { getMediaProfileMeta(mediaId, providers = providers) }

    suspend fun getSeasonProfileMeta(mediaId: String, seasonNumber: Int): SeasonProfileMeta =
        sessionApiCall { getSeasonProfileMeta(mediaId, seasonNumber) }

    suspend fun searchMedia(query: String? = null, q: String? = null, page: Int? = null, bypassCache: Boolean = false): SearchResponse =
        _cache.wrap("searchMedia", mapOf("query" to query, "q" to q, "page" to page), 3600000L, bypassCache) { sessionApiCall { searchMedia(query = query, q = q, page = page) } }

    // ── Public endpoints — no bearer required ─────────────────────────────────────────────────────

    suspend fun requestDeviceCode(clientID: String, demo: Boolean? = false, size: Int? = null, format: DiscovrApi.FormatRequestDeviceCode? = null): DeviceCodeResponse =
        _auth.publicApi().requestDeviceCode(DeviceCodePayload(clientID = clientID, demo = demo), size = size, format = format).body()

    suspend fun pollDeviceCode(deviceCode: String, deviceId: String? = null): PollDeviceCode200Response =
        _auth.publicApi().pollDeviceCode(deviceCode, DevicePollPayload(deviceId = deviceId)).body()

    suspend fun authorizeClientWeb(clientID: String, state: String, codeChallenge: String, codeChallengeMethod: DiscovrApi.CodeChallengeMethodAuthorizeClientWeb, redirectURL: String? = null, platform: DiscovrApi.PlatformAuthorizeClientWeb? = null): Unit =
        _auth.publicApi().authorizeClientWeb(clientID, state, codeChallenge, codeChallengeMethod, redirectURL = redirectURL, platform = platform).body()

    suspend fun exchangeWebAuthCode(clientID: String, code: String, codeVerifier: String, deviceId: String? = null): RefreshTokenResponse =
        _auth.publicApi().exchangeWebAuthCode(WebTokenPayload(clientID = clientID, code = code, codeVerifier = codeVerifier, deviceId = deviceId)).body()

    suspend fun startDemoSession(clientId: String, ttlMs: Int? = null): DemoSessionResponse =
        _auth.publicApi().startDemoSession(DemoSessionRequest(clientId = clientId, ttlMs = ttlMs)).body()

    suspend fun getMedia(mediaId: String, bypassCache: Boolean = false): MediaResponse =
        _cache.wrap("getMedia", mapOf("mediaId" to mediaId), null, bypassCache) { _auth.publicApi().getMedia(mediaId).body() }

    suspend fun getMediaAssets(mediaId: String, bypassCache: Boolean = false): MediaAssetsResponse =
        _cache.wrap("getMediaAssets", mapOf("mediaId" to mediaId), null, bypassCache) { _auth.publicApi().getMediaAssets(mediaId).body() }

    suspend fun getSeasonDetails(mediaId: String, seasonNumber: Int, language: String? = null, bypassCache: Boolean = false): SeasonDetailsResponse =
        _cache.wrap("getSeasonDetails", mapOf("mediaId" to mediaId, "seasonNumber" to seasonNumber, "language" to language), null, bypassCache) { _auth.publicApi().getSeasonDetails(mediaId, seasonNumber, language = language).body() }

    suspend fun getSimilarRecommendations(mediaId: String, language: String? = null, page: Int? = null, bypassCache: Boolean = false): SimilarResponse =
        _cache.wrap("getSimilarRecommendations", mapOf("mediaId" to mediaId, "language" to language, "page" to page), 3600000L, bypassCache) { _auth.publicApi().getSimilarRecommendations(mediaId, language = language, page = page).body() }

    suspend fun getProfileImages(limit: Int? = null, pageToken: String? = null, bypassCache: Boolean = false): ProfileImagesResponse =
        _cache.wrap("getProfileImages", mapOf("limit" to limit, "pageToken" to pageToken), null, bypassCache) { _auth.publicApi().getProfileImages(limit = limit, pageToken = pageToken).body() }

    suspend fun searchGifs(q: String, limit: Int? = null, pos: String? = null, contentfilter: DiscovrApi.ContentfilterSearchGifs? = null, country: String? = null, locale: String? = null, bypassCache: Boolean = false): GifSearchResponse =
        _cache.wrap("searchGifs", mapOf("q" to q, "limit" to limit, "pos" to pos, "contentfilter" to contentfilter, "country" to country, "locale" to locale), 3600000L, bypassCache) { _auth.publicApi().searchGifs(q, limit = limit, pos = pos, contentfilter = contentfilter, country = country, locale = locale).body() }

}