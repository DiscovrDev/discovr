// AUTO-GENERATED — do not edit.
@file:Suppress("TooManyFunctions", "LongParameterList")

package api.discovr

import api.discovr.apis.DiscovrApi
import api.discovr.auth._DiscovrAuth
import api.discovr.auth.TokenInvalidError
import api.discovr.auth.RateLimitedError
import api.discovr.auth.retryAfterSeconds
import api.discovr.auth.typedApiErrorFor
import api.discovr.infrastructure.HttpResponse
import api.discovr.models.AvatarMediaType
import api.discovr.models.CreatePagePayload
import api.discovr.models.CreatePageResponse
import api.discovr.models.CreateProfilePayload
import api.discovr.models.CreateProfileResponse
import api.discovr.models.DeleteProfileResponse
import api.discovr.models.DemoSessionRequest
import api.discovr.models.DemoSessionResponse
import api.discovr.models.DeviceCodePayload
import api.discovr.models.DeviceCodePollResponse
import api.discovr.models.DeviceCodeResponse
import api.discovr.models.DevicePollPayload
import api.discovr.models.EpisodeRef
import api.discovr.models.FilterSpec
import api.discovr.models.GetProfilesResponse
import api.discovr.models.GetRowItemsResponse
import api.discovr.models.GetRowsResponse
import api.discovr.models.GifSearchResponse
import api.discovr.models.ImportHistoryPayload
import api.discovr.models.MediaAssetsResponse
import api.discovr.models.MediaResponse
import api.discovr.models.MintSessionTokenPayload
import api.discovr.models.Page
import api.discovr.models.PlaybackListResponse
import api.discovr.models.Profile
import api.discovr.models.ProfileImagesResponse
import api.discovr.models.Rating
import api.discovr.models.RefreshTokenResponse
import api.discovr.models.Row
import api.discovr.models.ScrobbleProgressBody
import api.discovr.models.ScrobbleResponse
import api.discovr.models.SearchResponse
import api.discovr.models.SeasonDetailsResponse
import api.discovr.models.SeasonState
import api.discovr.models.SessionTokenResponse
import api.discovr.models.SetRatingPayload
import api.discovr.models.SignOutResponse
import api.discovr.models.SimilarResponse
import api.discovr.models.SuccessMessage
import api.discovr.models.TitleListResponse
import api.discovr.models.TitleState
import api.discovr.models.UpdateProfilePayload
import api.discovr.models.WebTokenPayload
import io.ktor.client.statement.bodyAsText

class DiscovrException(val statusCode: Int, message: String = "") : Exception("Discovr API error $statusCode: $message")

abstract class _DiscovrClientBase {

    internal abstract val _auth: _DiscovrAuth
    internal abstract val _cache: _DiscovrCache
    internal abstract val _sessionApi: DiscovrApi
    internal abstract val _identityApi: DiscovrApi

    // ── Internal call helpers with 429, typed-error, and 401 recovery ─────────

    internal fun throwForFailure(status: Int, rawBody: String, retryAfterHeader: String?): Nothing {
        if (status == 429) throw RateLimitedError(
            "Too many requests — slow down and try again shortly.",
            retryAfterSeconds(retryAfterHeader, rawBody),
        )
        typedApiErrorFor(status, rawBody, retryAfterHeader)?.let { throw it }
        throw DiscovrException(status, rawBody)
    }

    internal suspend inline fun <reified T : Any> sessionApiCall(
        crossinline call: suspend DiscovrApi.() -> HttpResponse<T>,
    ): T {
        val resp = _sessionApi.call()
        if (resp.success) return resp.body()
        val rawBody = resp.response.bodyAsText()
        if (resp.status != 401) throwForFailure(resp.status, rawBody, resp.response.headers["Retry-After"])
        val action = _auth.handleSessionErrorBody(rawBody)
        return when (action) {
            is _DiscovrAuth.RecoveryAction.RetryWithBearer -> {
                val retry = _sessionApi.call()
                if (retry.success) return retry.body()
                val retryBody = retry.response.bodyAsText()
                throwForFailure(retry.status, retryBody, retry.response.headers["Retry-After"])
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
        val rawBody = resp.response.bodyAsText()
        if (resp.status == 401) {
            if (_auth.handleIdentityErrorBody(rawBody)) throw TokenInvalidError("Refresh token expired")
            throw DiscovrException(resp.status, rawBody)
        }
        throwForFailure(resp.status, rawBody, resp.response.headers["Retry-After"])
    }

    internal suspend inline fun <reified T : Any> publicApiCall(
        crossinline call: suspend DiscovrApi.() -> HttpResponse<T>,
    ): T {
        val resp = _auth.publicApi().call()
        if (resp.success) return resp.body()
        val rawBody = resp.response.bodyAsText()
        throwForFailure(resp.status, rawBody, resp.response.headers["Retry-After"])
    }

    // ── Identity tier — refresh token bearer (/profiles, /auth/sessions) ─────────────────────────────────────────────────────

    suspend fun mintSessionToken(profileId: String, ttlMs: Int? = null, snapshotId: String? = null): SessionTokenResponse =
        identityApiCall { mintSessionToken(MintSessionTokenPayload(profileId = profileId, ttlMs = ttlMs, snapshotId = snapshotId)) }

    suspend fun signOutSession(): SignOutResponse =
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

    suspend fun createPage(pageFilters: FilterSpec? = null, bypassCache: Boolean = false): CreatePageResponse =
        _cache.wrap("createPage", mapOf("pageFilters" to pageFilters), null, bypassCache) { sessionApiCall { createPage(CreatePagePayload(pageFilters = pageFilters)) } }

    suspend fun getPage(pageId: String, bypassCache: Boolean = false): Page =
        _cache.wrap("getPage", mapOf("pageId" to pageId), null, bypassCache) { sessionApiCall { getPage(pageId) } }

    suspend fun getRows(pageId: String, nextPageToken: String? = null, limit: Int? = null, bypassCache: Boolean = false): GetRowsResponse =
        _cache.wrap("getRows", mapOf("pageId" to pageId, "nextPageToken" to nextPageToken, "limit" to limit), null, bypassCache) { sessionApiCall { getRows(pageId, nextPageToken = nextPageToken, limit = limit) } }

    suspend fun getRow(pageId: String, rowId: String, bypassCache: Boolean = false): Row =
        _cache.wrap("getRow", mapOf("pageId" to pageId, "rowId" to rowId), null, bypassCache) { sessionApiCall { getRow(pageId, rowId) } }

    suspend fun getRowItems(pageId: String, rowId: String, nextPageToken: String? = null, limit: Int? = null, bypassCache: Boolean = false): GetRowItemsResponse =
        _cache.wrap("getRowItems", mapOf("pageId" to pageId, "rowId" to rowId, "nextPageToken" to nextPageToken, "limit" to limit), null, bypassCache) { sessionApiCall { getRowItems(pageId, rowId, nextPageToken = nextPageToken, limit = limit) } }

    suspend fun getTitles(rating: Rating? = null, watchlist: Boolean? = false, watched: Boolean? = false, nextPageToken: String? = null, limit: Int? = null): TitleListResponse =
        sessionApiCall { getTitles(rating = rating, watchlist = watchlist, watched = watched, nextPageToken = nextPageToken, limit = limit) }

    suspend fun getTitleState(mediaId: String, providers: Boolean? = false): TitleState =
        sessionApiCall { getTitleState(mediaId, providers = providers) }

    suspend fun getSeasonState(mediaId: String, seasonNumber: Int): SeasonState =
        sessionApiCall { getSeasonState(mediaId, seasonNumber) }

    suspend fun setRating(mediaId: String, value: Rating): TitleState =
        sessionApiCall { setRating(mediaId, SetRatingPayload(value = value)) }

    suspend fun clearRating(mediaId: String): TitleState =
        sessionApiCall { clearRating(mediaId) }

    suspend fun addToWatchlist(mediaId: String): TitleState =
        sessionApiCall { addToWatchlist(mediaId) }

    suspend fun removeFromWatchlist(mediaId: String): TitleState =
        sessionApiCall { removeFromWatchlist(mediaId) }

    suspend fun markWatched(mediaId: String, season: Int? = null, episode: Int? = null): TitleState =
        sessionApiCall { markWatched(mediaId, season = season, episode = episode) }

    suspend fun markUnwatched(mediaId: String, season: Int? = null, episode: Int? = null): TitleState =
        sessionApiCall { markUnwatched(mediaId, season = season, episode = episode) }

    suspend fun getPlaybackItems(nextPageToken: String? = null, limit: Int? = null): PlaybackListResponse =
        sessionApiCall { getPlaybackItems(nextPageToken = nextPageToken, limit = limit) }

    suspend fun deletePlaybackItem(mediaId: String): SuccessMessage =
        sessionApiCall { deletePlaybackItem(mediaId) }

    suspend fun scrobble(mediaId: String, progress: Double, tv: EpisodeRef? = null): ScrobbleResponse =
        sessionApiCall { scrobble(mediaId, ScrobbleProgressBody(progress = progress, tv = tv)) }

    suspend fun importHistory(mediaId: String, imported: String, updatedAt: kotlin.time.Instant? = null, season: Int? = null, episode: Int? = null): TitleState =
        sessionApiCall { importHistory(ImportHistoryPayload(mediaId = mediaId, imported = imported, updatedAt = updatedAt, season = season, episode = episode)) }

    suspend fun getMedia(mediaId: String, bypassCache: Boolean = false): MediaResponse =
        _cache.wrap("getMedia", mapOf("mediaId" to mediaId), null, bypassCache) { sessionApiCall { getMedia(mediaId) } }

    suspend fun getMediaAssets(mediaId: String, bypassCache: Boolean = false): MediaAssetsResponse =
        _cache.wrap("getMediaAssets", mapOf("mediaId" to mediaId), null, bypassCache) { sessionApiCall { getMediaAssets(mediaId) } }

    suspend fun getSeasonDetails(mediaId: String, seasonNumber: Int, language: String? = null, bypassCache: Boolean = false): SeasonDetailsResponse =
        _cache.wrap("getSeasonDetails", mapOf("mediaId" to mediaId, "seasonNumber" to seasonNumber, "language" to language), null, bypassCache) { sessionApiCall { getSeasonDetails(mediaId, seasonNumber, language = language) } }

    suspend fun getSimilarRecommendations(mediaId: String, language: String? = null, page: Int? = null, bypassCache: Boolean = false): SimilarResponse =
        _cache.wrap("getSimilarRecommendations", mapOf("mediaId" to mediaId, "language" to language, "page" to page), 3600000L, bypassCache) { sessionApiCall { getSimilarRecommendations(mediaId, language = language, page = page) } }

    suspend fun searchMedia(query: String? = null, q: String? = null, page: Int? = null, bypassCache: Boolean = false): SearchResponse =
        _cache.wrap("searchMedia", mapOf("query" to query, "q" to q, "page" to page), 3600000L, bypassCache) { sessionApiCall { searchMedia(query = query, q = q, page = page) } }

    // ── Public endpoints — no bearer required ─────────────────────────────────────────────────────

    suspend fun requestDeviceCode(clientID: String, demo: Boolean? = false, size: Int? = null, format: DiscovrApi.FormatRequestDeviceCode? = null): DeviceCodeResponse =
        publicApiCall { requestDeviceCode(DeviceCodePayload(clientID = clientID, demo = demo), size = size, format = format) }

    suspend fun pollDeviceCode(deviceCode: String, deviceId: String? = null): DeviceCodePollResponse =
        publicApiCall { pollDeviceCode(deviceCode, DevicePollPayload(deviceId = deviceId)) }

    suspend fun authorizeClientWeb(clientID: String, state: String, codeChallenge: String, codeChallengeMethod: DiscovrApi.CodeChallengeMethodAuthorizeClientWeb, redirectURL: String? = null, platform: DiscovrApi.PlatformAuthorizeClientWeb? = null): Unit =
        publicApiCall { authorizeClientWeb(clientID, state, codeChallenge, codeChallengeMethod, redirectURL = redirectURL, platform = platform) }

    suspend fun exchangeWebAuthCode(clientID: String, code: String, codeVerifier: String, deviceId: String? = null): RefreshTokenResponse =
        publicApiCall { exchangeWebAuthCode(WebTokenPayload(clientID = clientID, code = code, codeVerifier = codeVerifier, deviceId = deviceId)) }

    suspend fun startDemoSession(clientId: String, ttlMs: Int? = null): DemoSessionResponse =
        publicApiCall { startDemoSession(DemoSessionRequest(clientId = clientId, ttlMs = ttlMs)) }

    suspend fun getProfileImages(limit: Int? = null, pageToken: String? = null, bypassCache: Boolean = false): ProfileImagesResponse =
        _cache.wrap("getProfileImages", mapOf("limit" to limit, "pageToken" to pageToken), null, bypassCache) { publicApiCall { getProfileImages(limit = limit, pageToken = pageToken) } }

    suspend fun searchGifs(q: String, limit: Int? = null, pos: String? = null, contentfilter: DiscovrApi.ContentfilterSearchGifs? = null, country: String? = null, locale: String? = null, bypassCache: Boolean = false): GifSearchResponse =
        _cache.wrap("searchGifs", mapOf("q" to q, "limit" to limit, "pos" to pos, "contentfilter" to contentfilter, "country" to country, "locale" to locale), 3600000L, bypassCache) { publicApiCall { searchGifs(q, limit = limit, pos = pos, contentfilter = contentfilter, country = country, locale = locale) } }

}