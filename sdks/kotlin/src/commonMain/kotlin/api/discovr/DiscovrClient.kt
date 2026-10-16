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
 * client.addLikedItem("MV_550")
 * ```
 */

package api.discovr

import api.discovr.apis.DiscovrApi
import api.discovr.models.HeroItem
import api.discovr.models.HistoryItem
import api.discovr.models.KnownForItem
import api.discovr.models.MediaItem
import api.discovr.models.NavigationItem
import api.discovr.models.PlaybackItem
import api.discovr.models.ProviderItem
import api.discovr.models.SearchResult
import api.discovr.models.SimilarResult
import api.discovr.models.SimpleListItem
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

    override val _cache = _DiscovrCache(enabled = cache)

    // Wire the session API: bearerTokenProvider fetches a fresh session token
    // on every request; auto-recovery is handled by sessionApiCall in the base.
    override val _sessionApi: DiscovrApi = DiscovrApi(baseUrl = basePath).apply {
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
        // every session mint. Clearing per-mint threw away page data that was
        // still perfectly valid every time a credential was renewed.
        cacheScope.launch {
            _auth.snapshotChanges.collect { _cache.clear() }
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
        // Clear synchronously here too, don't rely solely on the sessionState
        // collector below — it delivers on cacheScope's own dispatcher, so
        // there's no guarantee it has run by the time this call returns. This
        // closes that window for the common explicit-switch case; the collector
        // remains the backstop for turnovers that don't go through here.
        _cache.clear()
    }

    /**
     * Switch to a different profile. Mints a new session token
     * (which also starts a fresh recommendation snapshot).
     */
    suspend fun switchProfile(profileId: String) {
        _auth.switchProfile(profileId)
        _cache.clear()
    }

    /** Revoke the current device's refresh token and clear local state. */
    suspend fun signOut() {
        // Clear first: local auth state is wiped synchronously inside
        // _auth.signOut() before it awaits the server-side revocation call, so
        // a slow/hanging revocation would otherwise leave stale cache entries
        // around for longer than necessary even though nothing can serve them.
        _cache.clear()
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
public fun HeroItem.refOrId(): String = ref ?: id

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
public fun SimpleListItem.refOrId(): String = ref ?: id

/** @see refOrId */
public fun PlaybackItem.refOrId(): String = ref ?: id

/** @see refOrId */
public fun HistoryItem.refOrId(): String = ref ?: id

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
