/**
 * DiscovrClient — the single public entry point for the Discovr SDK.
 *
 * Extends the auto-generated [_DiscovrClientBase] (which contains all API
 * methods with ergonomic named arguments) and owns the internal [_DiscovrAuth]
 * instance that manages token storage, refresh, and auto-recovery.
 *
 * Customers never use [_DiscovrAuth] or [_DiscovrClientBase] directly.
 * Authentication flows and all API calls are accessed through this class.
 *
 * @sample
 * ```kotlin
 * val client = DiscovrClient("your-client-id", storage = prefs)
 *
 * // Sign in (TV flow)
 * val code = client.signInWithDeviceCode()
 * // Display code.userCode / code.qrCode to the user …
 * client.state.collect { if (it.signedIn) proceed() }
 *
 * // Select a profile
 * val profiles = client.getProfiles()
 * client.selectProfile(profiles.profiles.first().id)
 *
 * // API calls
 * val page = client.createPage()
 * val rows = client.getRows(page.id)
 * client.setRating("MV_550", Rating.liked)
 * ```
 */

package api.discovr

import api.discovr.apis.DiscovrApi
import api.discovr.models.EpisodeRef
import api.discovr.models.GetRowItemsResponse
import api.discovr.models.GetRowsResponse
import api.discovr.models.KnownForItem
import api.discovr.models.MediaAssetsResponse
import api.discovr.models.MediaItem
import api.discovr.models.MediaResponse
import api.discovr.models.NavigationItem
import api.discovr.models.Page
import api.discovr.models.PlaybackItem
import api.discovr.models.ProviderItem
import api.discovr.models.Rating
import api.discovr.models.Row
import api.discovr.models.ScrobbleResponse
import api.discovr.models.SearchResult
import api.discovr.models.SeasonDetailsResponse
import api.discovr.models.SeasonState
import api.discovr.models.SimilarResponse
import api.discovr.models.SimilarResult
import api.discovr.models.SuccessMessage
import api.discovr.models.TitleListItem
import api.discovr.models.TitleListResponse
import api.discovr.models.TitleState
import api.discovr.auth.AuthConfig
import api.discovr.auth.AuthState
import api.discovr.auth.AuthStorage
import api.discovr.auth.SessionState
import api.discovr.auth.DeviceCodeResult
import api.discovr.auth.LoopGuardConfig
import api.discovr.auth._DiscovrAuth
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class DiscovrClient(
    clientId: String,
    storage: AuthStorage,
    basePath: String = "https://api.discovr.media",
    debug: Boolean = false,
    /**
     * Enable the session-level response cache for deterministic/public
     * endpoints (pages, rows, profiles, media, misc). Defaults to enabled —
     * disable if you need every call to hit the network, e.g. in tests.
     */
    cache: Boolean = true,
    /**
     * Run against a throwaway demo sandbox instead of a real account — no
     * credentials or sign-up needed. Everything afterwards is the ordinary
     * flow, so code written against a demo sandbox works unchanged against a
     * real account. Sandboxes expire after a short window and are deleted.
     */
    demoMode: Boolean = false,
    /**
     * Only meaningful with `demoMode = true`. Overrides how long each session
     * token minted for the sandbox lives (default 15 minutes). Set this
     * small (e.g. two minutes) to repeatedly exercise your app's silent
     * session-refresh path on demand. See [AuthConfig.demoSessionTtlMs].
     */
    demoSessionTtlMs: Long = api.discovr.auth.DEFAULT_DEMO_SESSION_TTL_MS,
    /**
     * Only meaningful with `demoMode = true`. Overrides how long the sandbox
     * itself (and its refresh token) lives — default 30 minutes, unchanged
     * unless set. See [AuthConfig.demoRefreshTtlMs].
     */
    demoRefreshTtlMs: Long? = null,
    /** Tune or disable the client-side runaway-loop breaker. Enabled by default. */
    loopGuard: LoopGuardConfig = LoopGuardConfig(),
    /**
     * Remember which profile was selected between launches. Defaults to
     * `false`, like a streaming app: after a relaunch the user is still signed
     * in but picks who's watching again. Set it to `true` to resume on the
     * profile they last used. See [AuthConfig.rememberProfile].
     */
    rememberProfile: Boolean = false,
) : _DiscovrClientBase() {

    override val _auth = _DiscovrAuth(
        clientID = clientId,
        config = AuthConfig(
            basePath = basePath,
            storage = storage,
            debug = debug,
            demoMode = demoMode,
            demoSessionTtlMs = demoSessionTtlMs,
            demoRefreshTtlMs = demoRefreshTtlMs,
            loopGuard = loopGuard,
            rememberProfile = rememberProfile,
        ),
    )

    override val _cache = _DiscovrCache(
        enabled = cache,
        retryScope = { if (_auth.isSignedIn) _auth.getActiveProfileId() else null },
    )

    // Wire the session API: bearerTokenProvider fetches a fresh session token
    // on every request; auto-recovery is handled by sessionApiCall in the base.
    override var _sessionApi: DiscovrApi = DiscovrApi(baseUrl = basePath).apply {
        bearerTokenProvider = { _auth.sessionBearer() }
        requestGuard = { _auth.checkRequestLoop(it) }
    }

    // Wire the identity API: bearer is the long-lived refresh token.
    override val _identityApi: DiscovrApi = DiscovrApi(baseUrl = basePath).apply {
        bearerTokenProvider = { _auth.identityBearer() }
        requestGuard = { _auth.checkRequestLoop(it) }
    }

    private val cacheScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    init {
        // Clear cached page data when the *recommendations* turn over, not on
        // every session mint. `clearForSnapshot` skips any buffered event for a
        // snapshot already cleared synchronously by `selectProfile`/`switchProfile`.
        cacheScope.launch {
            var lastProfileId = _auth.getActiveProfileId()
            _auth.snapshotChanges.collect {
                val currentProfileId = _auth.getActiveProfileId()
                val sameProfile = currentProfileId != null && currentProfileId == lastProfileId
                lastProfileId = currentProfileId
                _cache.clearForSnapshot(_auth.sessionState.value.snapshotId, retryable = sameProfile)
            }
        }
        // Wipe cached data without retrying if a forced sign-out occurs (e.g.
        // expired/revoked refresh token during 401 recovery).
        cacheScope.launch {
            var wasSignedIn = _auth.isSignedIn
            _auth.state.collect { state ->
                if (wasSignedIn && !state.signedIn) {
                    _cache.clear(retryable = false)
                }
                wasSignedIn = state.signedIn
            }
        }
    }

    // ── Auth pass-throughs ────────────────────────────────────────────────────

    /** Live stream of auth state changes. */
    val authState: StateFlow<AuthState> get() = _auth.state

    /**
     * Live stream of session changes. Emits on the initial [selectProfile], a
     * profile switch, and each automatic renewal.
     *
     * Watch `snapshotId` rather than the emission itself to know when page data
     * is stale — most of these are routine credential renewals that leave the
     * user's recommendations exactly where they were.
     */
    val sessionState: StateFlow<SessionState> get() = _auth.sessionState

    /**
     * Emits when the user's recommendations turn over — the signal to rebuild
     * what's on screen.
     *
     * Fires roughly every 30 minutes, as a snapshot ages out. Routine
     * credential renewals don't emit here.
     * Page ids don't change, so refetch the page you're already showing rather
     * than recreating it.
     *
     * Unlike [sessionState] this is a [SharedFlow], not a [StateFlow]: it
     * reports an event, not a state, so a new collector doesn't immediately
     * receive one and refetch data it just loaded.
     */
    val recommendationChanges: SharedFlow<Unit> get() = _auth.snapshotChanges

    /** True if a refresh token is held (signed in). */
    val isSignedIn: Boolean get() = _auth.isSignedIn

    /** True if a profile has been selected and a session token is held. */
    val hasActiveProfile: Boolean get() = _auth.hasActiveProfile

    /** Returns the currently selected profile ID, or null. */
    fun getActiveProfileId(): String? = _auth.getActiveProfileId()

    /**
     * Sign in to a throwaway demo sandbox — no credentials or sign-up needed.
     *
     * Everything afterwards is the ordinary flow (`getProfiles`,
     * `selectProfile`, reads and writes), so code written against a demo
     * sandbox works unchanged against a real account. Sandboxes expire after a
     * short window and are deleted, so treat the data as disposable.
     *
     * Happens automatically on first use when the client is constructed with
     * `demoMode = true`.
     */
    suspend fun signInWithDemo() = _auth.signInWithDemo()

    /**
     * Begin device-code sign-in. Returns display data immediately;
     * collect [authState] to detect completion.
     *
     * [qrSize] is the QR code's size in pixels (100-1000, default 300); a TV
     * screen wants 600-800. The poll pace and the timeout are the server's; await
     * [DeviceCodeResult.completion] to learn that the person declined or the code
     * lapsed.
     */
    suspend fun signInWithDeviceCode(qrSize: Int? = null): DeviceCodeResult =
        _auth.signInWithDeviceCode(qrSize)

    /**
     * Sign in using the platform web browser.
     *
     * Constructs the `/auth/web/authorize` URL and delivers it to [launchUrl].
     * The caller opens it via `CustomTabsIntent` (or `Intent.ACTION_VIEW`)
     * and handles the deep-link redirect back via [handleRedirectUri].
     *
     * @param redirectUri  Custom-scheme URI registered for this client.
     * @param launchUrl    Callback that receives the full authorize URL.
     */
    fun signInWithWebAuth(redirectUri: String, launchUrl: (String) -> Unit) =
        _auth.signInWithWebAuth(redirectUri, launchUrl)

    /**
     * Complete a web-auth sign-in after the platform delivers the redirect URI:
     * redeems the authorization code in it for the refresh token, using the PKCE
     * verifier the SDK kept.
     *
     * @return true if a sign-in completed; false if [uri] is not a sign-in return.
     */
    suspend fun handleRedirectUri(uri: String): Boolean = _auth.handleRedirectUri(uri)

    /**
     * Select a profile and mint a session token bound to it. Must be called
     * after sign-in before any session-tier API calls.
     */
    suspend fun selectProfile(profileId: String) {
        _auth.selectProfile(profileId)
        // Clear synchronously (non-retryable) and record the snapshot ID so the
        // async collector does not fire a duplicate delayed clear right after
        // this call returns, and in-flight calls from a prior profile never retry.
        _cache.clearAndMarkSnapshot(_auth.sessionState.value.snapshotId, retryable = false)
    }

    /**
     * Switch to a different profile. Mints a new session token
     * (which also starts a fresh recommendation snapshot).
     */
    suspend fun switchProfile(profileId: String) {
        _auth.switchProfile(profileId)
        _cache.clearAndMarkSnapshot(_auth.sessionState.value.snapshotId, retryable = false)
    }

    /** Revoke the current device's refresh token and clear local state. */
    suspend fun signOut() {
        // Clear first with retryable = false: local auth state is wiped inside
        // _auth.signOut() before it awaits the server-side revocation call, and
        // in-flight fetches must not retry into a signed-out session.
        _cache.clear(retryable = false)
        _auth.signOut()
    }

    /**
     * Clear the session-level response cache. Cacheable calls (pages, rows,
     * profiles, media, misc) after this will hit the network again. Also
     * called automatically on profile switch, sign-out, and session rotation.
     */
    suspend fun clearCache() = _cache.clear()

    /**
     * Cancel all background work and release resources.
     *
     * Call this when the client is no longer needed — typically in
     * `ViewModel.onCleared()` or when your DI container disposes the client.
     * Stops any in-flight device-code poll and cancels the internal coroutine
     * scope. After calling `close()`, this client must not be used again.
     */
    fun close() {
        cacheScope.cancel()
        _auth.close()
    }

    // ── Convenience title-list wrappers ───────────────────────────────────────

    /** List titles rated `liked` by the active profile, newest rated first. */
    suspend fun getLiked(nextPageToken: String? = null, limit: Int? = null): TitleListResponse =
        getTitles(rating = Rating.liked, nextPageToken = nextPageToken, limit = limit)

    /** List titles rated `disliked` by the active profile, newest rated first. */
    suspend fun getDisliked(nextPageToken: String? = null, limit: Int? = null): TitleListResponse =
        getTitles(rating = Rating.disliked, nextPageToken = nextPageToken, limit = limit)

    /** List titles rated `super_liked` by the active profile, newest rated first. */
    suspend fun getSuperLiked(nextPageToken: String? = null, limit: Int? = null): TitleListResponse =
        getTitles(rating = Rating.super_liked, nextPageToken = nextPageToken, limit = limit)

    /** List titles on the active profile's watchlist, newest added first. */
    suspend fun getWatchlist(nextPageToken: String? = null, limit: Int? = null): TitleListResponse =
        getTitles(watchlist = true, nextPageToken = nextPageToken, limit = limit)

    /** List the active profile's watch history (one entry per title), most recently watched first. */
    suspend fun getHistory(nextPageToken: String? = null, limit: Int? = null): TitleListResponse =
        getTitles(watched = true, nextPageToken = nextPageToken, limit = limit)

    // ── Playback tracker (A18) ────────────────────────────────────────────────

    /**
     * Create a percentage-first [PlaybackTracker] for a movie or TV episode
     * identified by raw media ID or `ref`.
     */
    fun trackPlayback(
        mediaId: String,
        tv: EpisodeRef? = null,
        after: PlaybackTracker? = null,
        onError: ((Throwable) -> Unit)? = null,
        onCompleted: ((ScrobbleResponse) -> Unit)? = null,
        heartbeatIntervalMs: Long = PlaybackTracker.DEFAULT_HEARTBEAT_INTERVAL_MS,
    ): PlaybackTracker = PlaybackTracker(
        mediaRefOrId = mediaId,
        tv = tv,
        after = after,
        onError = onError,
        onCompleted = onCompleted,
        heartbeatIntervalMs = heartbeatIntervalMs,
        send = { id, progress, episodeRef -> scrobble(id, progress, tv = episodeRef) },
        scope = cacheScope,
    )

    /** Create a [PlaybackTracker] from a [MediaItem], preserving its `ref`. */
    fun trackPlayback(
        item: MediaItem,
        tv: EpisodeRef? = null,
        after: PlaybackTracker? = null,
        onError: ((Throwable) -> Unit)? = null,
        onCompleted: ((ScrobbleResponse) -> Unit)? = null,
        heartbeatIntervalMs: Long = PlaybackTracker.DEFAULT_HEARTBEAT_INTERVAL_MS,
    ): PlaybackTracker = trackPlayback(item.refOrId(), tv, after, onError, onCompleted, heartbeatIntervalMs)

    /** Create a [PlaybackTracker] from a [TitleListItem], preserving its `ref`. */
    fun trackPlayback(
        item: TitleListItem,
        tv: EpisodeRef? = null,
        after: PlaybackTracker? = null,
        onError: ((Throwable) -> Unit)? = null,
        onCompleted: ((ScrobbleResponse) -> Unit)? = null,
        heartbeatIntervalMs: Long = PlaybackTracker.DEFAULT_HEARTBEAT_INTERVAL_MS,
    ): PlaybackTracker = trackPlayback(item.refOrId(), tv, after, onError, onCompleted, heartbeatIntervalMs)

    /**
     * Create a [PlaybackTracker] from a [PlaybackItem], preserving its `ref` and
     * automatically defaulting [tv] to `EpisodeRef(item.season, item.episode)`
     * when both are present and [tv] is omitted.
     */
    fun trackPlayback(
        item: PlaybackItem,
        tv: EpisodeRef? = null,
        after: PlaybackTracker? = null,
        onError: ((Throwable) -> Unit)? = null,
        onCompleted: ((ScrobbleResponse) -> Unit)? = null,
        heartbeatIntervalMs: Long = PlaybackTracker.DEFAULT_HEARTBEAT_INTERVAL_MS,
    ): PlaybackTracker {
        val resolvedTv = tv ?: if (item.season != null && item.episode != null) {
            EpisodeRef(season = item.season, episode = item.episode)
        } else {
            null
        }
        return trackPlayback(item.refOrId(), resolvedTv, after, onError, onCompleted, heartbeatIntervalMs)
    }

    /** Create a [PlaybackTracker] from a [SearchResult], preserving its `ref`. */
    fun trackPlayback(
        item: SearchResult,
        tv: EpisodeRef? = null,
        after: PlaybackTracker? = null,
        onError: ((Throwable) -> Unit)? = null,
        onCompleted: ((ScrobbleResponse) -> Unit)? = null,
        heartbeatIntervalMs: Long = PlaybackTracker.DEFAULT_HEARTBEAT_INTERVAL_MS,
    ): PlaybackTracker = trackPlayback(item.refOrId(), tv, after, onError, onCompleted, heartbeatIntervalMs)

    /** Create a [PlaybackTracker] from a [SimilarResult], preserving its `ref`. */
    fun trackPlayback(
        item: SimilarResult,
        tv: EpisodeRef? = null,
        after: PlaybackTracker? = null,
        onError: ((Throwable) -> Unit)? = null,
        onCompleted: ((ScrobbleResponse) -> Unit)? = null,
        heartbeatIntervalMs: Long = PlaybackTracker.DEFAULT_HEARTBEAT_INTERVAL_MS,
    ): PlaybackTracker = trackPlayback(item.refOrId(), tv, after, onError, onCompleted, heartbeatIntervalMs)

    /** Create a [PlaybackTracker] from a [KnownForItem], preserving its `ref`. */
    fun trackPlayback(
        item: KnownForItem,
        tv: EpisodeRef? = null,
        after: PlaybackTracker? = null,
        onError: ((Throwable) -> Unit)? = null,
        onCompleted: ((ScrobbleResponse) -> Unit)? = null,
        heartbeatIntervalMs: Long = PlaybackTracker.DEFAULT_HEARTBEAT_INTERVAL_MS,
    ): PlaybackTracker = trackPlayback(item.refOrId(), tv, after, onError, onCompleted, heartbeatIntervalMs)

    // ── Item-taking overloads (A16) ───────────────────────────────────────────
    // Accept item/tile models directly so attribution via `refOrId()` is
    // automatic while keeping every String signature intact for deep links.

    suspend fun getMedia(item: MediaItem, bypassCache: Boolean = false): MediaResponse = getMedia(item.refOrId(), bypassCache)
    suspend fun getMedia(item: TitleListItem, bypassCache: Boolean = false): MediaResponse = getMedia(item.refOrId(), bypassCache)
    suspend fun getMedia(item: PlaybackItem, bypassCache: Boolean = false): MediaResponse = getMedia(item.refOrId(), bypassCache)
    suspend fun getMedia(item: SearchResult, bypassCache: Boolean = false): MediaResponse = getMedia(item.refOrId(), bypassCache)
    suspend fun getMedia(item: SimilarResult, bypassCache: Boolean = false): MediaResponse = getMedia(item.refOrId(), bypassCache)
    suspend fun getMedia(item: KnownForItem, bypassCache: Boolean = false): MediaResponse = getMedia(item.refOrId(), bypassCache)

    suspend fun getMediaAssets(item: MediaItem, bypassCache: Boolean = false): MediaAssetsResponse = getMediaAssets(item.refOrId(), bypassCache)
    suspend fun getMediaAssets(item: TitleListItem, bypassCache: Boolean = false): MediaAssetsResponse = getMediaAssets(item.refOrId(), bypassCache)
    suspend fun getMediaAssets(item: PlaybackItem, bypassCache: Boolean = false): MediaAssetsResponse = getMediaAssets(item.refOrId(), bypassCache)
    suspend fun getMediaAssets(item: SearchResult, bypassCache: Boolean = false): MediaAssetsResponse = getMediaAssets(item.refOrId(), bypassCache)
    suspend fun getMediaAssets(item: SimilarResult, bypassCache: Boolean = false): MediaAssetsResponse = getMediaAssets(item.refOrId(), bypassCache)
    suspend fun getMediaAssets(item: KnownForItem, bypassCache: Boolean = false): MediaAssetsResponse = getMediaAssets(item.refOrId(), bypassCache)

    suspend fun getSimilarRecommendations(item: MediaItem, language: String? = null, page: Int? = null, bypassCache: Boolean = false): SimilarResponse = getSimilarRecommendations(item.refOrId(), language, page, bypassCache)
    suspend fun getSimilarRecommendations(item: TitleListItem, language: String? = null, page: Int? = null, bypassCache: Boolean = false): SimilarResponse = getSimilarRecommendations(item.refOrId(), language, page, bypassCache)
    suspend fun getSimilarRecommendations(item: PlaybackItem, language: String? = null, page: Int? = null, bypassCache: Boolean = false): SimilarResponse = getSimilarRecommendations(item.refOrId(), language, page, bypassCache)
    suspend fun getSimilarRecommendations(item: SearchResult, language: String? = null, page: Int? = null, bypassCache: Boolean = false): SimilarResponse = getSimilarRecommendations(item.refOrId(), language, page, bypassCache)
    suspend fun getSimilarRecommendations(item: SimilarResult, language: String? = null, page: Int? = null, bypassCache: Boolean = false): SimilarResponse = getSimilarRecommendations(item.refOrId(), language, page, bypassCache)
    suspend fun getSimilarRecommendations(item: KnownForItem, language: String? = null, page: Int? = null, bypassCache: Boolean = false): SimilarResponse = getSimilarRecommendations(item.refOrId(), language, page, bypassCache)

    suspend fun getSeasonDetails(item: MediaItem, seasonNumber: Int, language: String? = null, bypassCache: Boolean = false): SeasonDetailsResponse = getSeasonDetails(item.refOrId(), seasonNumber, language, bypassCache)
    suspend fun getSeasonDetails(item: TitleListItem, seasonNumber: Int, language: String? = null, bypassCache: Boolean = false): SeasonDetailsResponse = getSeasonDetails(item.refOrId(), seasonNumber, language, bypassCache)
    suspend fun getSeasonDetails(item: PlaybackItem, seasonNumber: Int, language: String? = null, bypassCache: Boolean = false): SeasonDetailsResponse = getSeasonDetails(item.refOrId(), seasonNumber, language, bypassCache)
    suspend fun getSeasonDetails(item: SearchResult, seasonNumber: Int, language: String? = null, bypassCache: Boolean = false): SeasonDetailsResponse = getSeasonDetails(item.refOrId(), seasonNumber, language, bypassCache)
    suspend fun getSeasonDetails(item: SimilarResult, seasonNumber: Int, language: String? = null, bypassCache: Boolean = false): SeasonDetailsResponse = getSeasonDetails(item.refOrId(), seasonNumber, language, bypassCache)
    suspend fun getSeasonDetails(item: KnownForItem, seasonNumber: Int, language: String? = null, bypassCache: Boolean = false): SeasonDetailsResponse = getSeasonDetails(item.refOrId(), seasonNumber, language, bypassCache)

    suspend fun getTitleState(item: MediaItem, providers: Boolean? = false): TitleState = getTitleState(item.refOrId(), providers)
    suspend fun getTitleState(item: TitleListItem, providers: Boolean? = false): TitleState = getTitleState(item.refOrId(), providers)
    suspend fun getTitleState(item: PlaybackItem, providers: Boolean? = false): TitleState = getTitleState(item.refOrId(), providers)
    suspend fun getTitleState(item: SearchResult, providers: Boolean? = false): TitleState = getTitleState(item.refOrId(), providers)
    suspend fun getTitleState(item: SimilarResult, providers: Boolean? = false): TitleState = getTitleState(item.refOrId(), providers)
    suspend fun getTitleState(item: KnownForItem, providers: Boolean? = false): TitleState = getTitleState(item.refOrId(), providers)

    suspend fun getSeasonState(item: MediaItem, seasonNumber: Int): SeasonState = getSeasonState(item.refOrId(), seasonNumber)
    suspend fun getSeasonState(item: TitleListItem, seasonNumber: Int): SeasonState = getSeasonState(item.refOrId(), seasonNumber)
    suspend fun getSeasonState(item: PlaybackItem, seasonNumber: Int): SeasonState = getSeasonState(item.refOrId(), seasonNumber)
    suspend fun getSeasonState(item: SearchResult, seasonNumber: Int): SeasonState = getSeasonState(item.refOrId(), seasonNumber)
    suspend fun getSeasonState(item: SimilarResult, seasonNumber: Int): SeasonState = getSeasonState(item.refOrId(), seasonNumber)
    suspend fun getSeasonState(item: KnownForItem, seasonNumber: Int): SeasonState = getSeasonState(item.refOrId(), seasonNumber)

    suspend fun setRating(item: MediaItem, value: Rating): TitleState = setRating(item.refOrId(), value)
    suspend fun setRating(item: TitleListItem, value: Rating): TitleState = setRating(item.refOrId(), value)
    suspend fun setRating(item: PlaybackItem, value: Rating): TitleState = setRating(item.refOrId(), value)
    suspend fun setRating(item: SearchResult, value: Rating): TitleState = setRating(item.refOrId(), value)
    suspend fun setRating(item: SimilarResult, value: Rating): TitleState = setRating(item.refOrId(), value)
    suspend fun setRating(item: KnownForItem, value: Rating): TitleState = setRating(item.refOrId(), value)

    suspend fun clearRating(item: MediaItem): TitleState = clearRating(item.refOrId())
    suspend fun clearRating(item: TitleListItem): TitleState = clearRating(item.refOrId())
    suspend fun clearRating(item: PlaybackItem): TitleState = clearRating(item.refOrId())
    suspend fun clearRating(item: SearchResult): TitleState = clearRating(item.refOrId())
    suspend fun clearRating(item: SimilarResult): TitleState = clearRating(item.refOrId())
    suspend fun clearRating(item: KnownForItem): TitleState = clearRating(item.refOrId())

    suspend fun addToWatchlist(item: MediaItem): TitleState = addToWatchlist(item.refOrId())
    suspend fun addToWatchlist(item: TitleListItem): TitleState = addToWatchlist(item.refOrId())
    suspend fun addToWatchlist(item: PlaybackItem): TitleState = addToWatchlist(item.refOrId())
    suspend fun addToWatchlist(item: SearchResult): TitleState = addToWatchlist(item.refOrId())
    suspend fun addToWatchlist(item: SimilarResult): TitleState = addToWatchlist(item.refOrId())
    suspend fun addToWatchlist(item: KnownForItem): TitleState = addToWatchlist(item.refOrId())

    suspend fun removeFromWatchlist(item: MediaItem): TitleState = removeFromWatchlist(item.refOrId())
    suspend fun removeFromWatchlist(item: TitleListItem): TitleState = removeFromWatchlist(item.refOrId())
    suspend fun removeFromWatchlist(item: PlaybackItem): TitleState = removeFromWatchlist(item.refOrId())
    suspend fun removeFromWatchlist(item: SearchResult): TitleState = removeFromWatchlist(item.refOrId())
    suspend fun removeFromWatchlist(item: SimilarResult): TitleState = removeFromWatchlist(item.refOrId())
    suspend fun removeFromWatchlist(item: KnownForItem): TitleState = removeFromWatchlist(item.refOrId())

    suspend fun markWatched(item: MediaItem, season: Int? = null, episode: Int? = null): TitleState = markWatched(item.refOrId(), season, episode)
    suspend fun markWatched(item: TitleListItem, season: Int? = null, episode: Int? = null): TitleState = markWatched(item.refOrId(), season, episode)
    suspend fun markWatched(item: PlaybackItem, season: Int? = null, episode: Int? = null): TitleState = markWatched(item.refOrId(), season, episode)
    suspend fun markWatched(item: SearchResult, season: Int? = null, episode: Int? = null): TitleState = markWatched(item.refOrId(), season, episode)
    suspend fun markWatched(item: SimilarResult, season: Int? = null, episode: Int? = null): TitleState = markWatched(item.refOrId(), season, episode)
    suspend fun markWatched(item: KnownForItem, season: Int? = null, episode: Int? = null): TitleState = markWatched(item.refOrId(), season, episode)

    suspend fun markUnwatched(item: MediaItem, season: Int? = null, episode: Int? = null): TitleState = markUnwatched(item.refOrId(), season, episode)
    suspend fun markUnwatched(item: TitleListItem, season: Int? = null, episode: Int? = null): TitleState = markUnwatched(item.refOrId(), season, episode)
    suspend fun markUnwatched(item: PlaybackItem, season: Int? = null, episode: Int? = null): TitleState = markUnwatched(item.refOrId(), season, episode)
    suspend fun markUnwatched(item: SearchResult, season: Int? = null, episode: Int? = null): TitleState = markUnwatched(item.refOrId(), season, episode)
    suspend fun markUnwatched(item: SimilarResult, season: Int? = null, episode: Int? = null): TitleState = markUnwatched(item.refOrId(), season, episode)
    suspend fun markUnwatched(item: KnownForItem, season: Int? = null, episode: Int? = null): TitleState = markUnwatched(item.refOrId(), season, episode)

    suspend fun deletePlaybackItem(item: MediaItem): SuccessMessage = deletePlaybackItem(item.refOrId())
    suspend fun deletePlaybackItem(item: TitleListItem): SuccessMessage = deletePlaybackItem(item.refOrId())
    suspend fun deletePlaybackItem(item: PlaybackItem): SuccessMessage = deletePlaybackItem(item.refOrId())
    suspend fun deletePlaybackItem(item: SearchResult): SuccessMessage = deletePlaybackItem(item.refOrId())
    suspend fun deletePlaybackItem(item: SimilarResult): SuccessMessage = deletePlaybackItem(item.refOrId())
    suspend fun deletePlaybackItem(item: KnownForItem): SuccessMessage = deletePlaybackItem(item.refOrId())

    suspend fun scrobble(item: MediaItem, progress: Double, tv: EpisodeRef? = null): ScrobbleResponse = scrobble(item.refOrId(), progress, tv)
    suspend fun scrobble(item: TitleListItem, progress: Double, tv: EpisodeRef? = null): ScrobbleResponse = scrobble(item.refOrId(), progress, tv)
    suspend fun scrobble(item: PlaybackItem, progress: Double, tv: EpisodeRef? = null): ScrobbleResponse = scrobble(item.refOrId(), progress, tv)
    suspend fun scrobble(item: SearchResult, progress: Double, tv: EpisodeRef? = null): ScrobbleResponse = scrobble(item.refOrId(), progress, tv)
    suspend fun scrobble(item: SimilarResult, progress: Double, tv: EpisodeRef? = null): ScrobbleResponse = scrobble(item.refOrId(), progress, tv)
    suspend fun scrobble(item: KnownForItem, progress: Double, tv: EpisodeRef? = null): ScrobbleResponse = scrobble(item.refOrId(), progress, tv)

    suspend fun getPage(tile: NavigationItem, bypassCache: Boolean = false): Page = getPage(tile.refOrId(), bypassCache)
    suspend fun getPage(tile: ProviderItem, bypassCache: Boolean = false): Page = getPage(tile.refOrId(), bypassCache)

    suspend fun getRows(tile: NavigationItem, nextPageToken: String? = null, limit: Int? = null, bypassCache: Boolean = false): GetRowsResponse = getRows(tile.refOrId(), nextPageToken, limit, bypassCache)
    suspend fun getRows(tile: ProviderItem, nextPageToken: String? = null, limit: Int? = null, bypassCache: Boolean = false): GetRowsResponse = getRows(tile.refOrId(), nextPageToken, limit, bypassCache)

    suspend fun getRow(tile: NavigationItem, rowId: String, bypassCache: Boolean = false): Row = getRow(tile.refOrId(), rowId, bypassCache)
    suspend fun getRow(tile: ProviderItem, rowId: String, bypassCache: Boolean = false): Row = getRow(tile.refOrId(), rowId, bypassCache)

    suspend fun getRowItems(tile: NavigationItem, rowId: String, nextPageToken: String? = null, limit: Int? = null, bypassCache: Boolean = false): GetRowItemsResponse = getRowItems(tile.refOrId(), rowId, nextPageToken, limit, bypassCache)
    suspend fun getRowItems(tile: ProviderItem, rowId: String, nextPageToken: String? = null, limit: Int? = null, bypassCache: Boolean = false): GetRowItemsResponse = getRowItems(tile.refOrId(), rowId, nextPageToken, limit, bypassCache)
}


/**
 * The value to pass onward for an item Discovr returned.
 *
 * Every media, navigation, provider and search item carries an `id` and,
 * usually, a `ref` -- the same id with the place it was shown attached. The ref
 * works anywhere the id does and tells Discovr which row or search surfaced the
 * item, which sharpens that profile's recommendations.
 *
 * Prefer these over reaching for `.id` directly:
 *
 * ```kotlin
 * val details = client.getMedia(item.refOrId())
 * val page = client.getPage(tile.refOrId())
 * ```
 *
 * Navigation and provider tiles are keyed by the page they open rather than by
 * their own id, so theirs falls back to `pageId` -- the same call works for
 * every kind of item a row can contain.
 */
public fun MediaItem.refOrId(): String = ref ?: id

/** @see refOrId */
public fun SearchResult.refOrId(): String = ref ?: id

/** @see refOrId */
public fun NavigationItem.refOrId(): String = ref ?: pageId

/** @see refOrId */
public fun ProviderItem.refOrId(): String = ref ?: pageId

/** @see refOrId */
public fun SimilarResult.refOrId(): String = ref ?: id

/** @see refOrId */
public fun KnownForItem.refOrId(): String = ref ?: id

/** @see refOrId */
public fun TitleListItem.refOrId(): String = ref ?: id

/** @see refOrId */
public fun PlaybackItem.refOrId(): String = ref ?: id

/**
 * The plain id behind a `ref`, or the id itself if that's what you were given.
 *
 * Pass the `ref` to anything your user does or any screen they move to. But when
 * all you're holding is that one string -- a navigation argument, a saved
 * "recently viewed" list -- and you need the title's id for a cache key, a
 * shareable link, or a log line, this gets it back:
 *
 * ```kotlin
 * idOf("MV_550@...") // "MV_550"
 * idOf("MV_550")     // "MV_550"
 * ```
 */
public fun idOf(refOrId: String): String = refOrId.substringBefore('@')
