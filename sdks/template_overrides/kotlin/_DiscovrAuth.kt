/**
 * `_DiscovrAuth` — internal auth helper for the Discovr API.
 *
 * Two tokens, two jobs:
 *
 * - Refresh token (long-lived, 90 d). Used as the bearer for identity-tier
 *   endpoints (`GET /profiles`, `POST /auth/session-token`,
 *   `/auth/sessions/…`) and to mint session tokens.
 * - Session token (short-lived, 30 min). Used for session-tier
 *   endpoints — pages, rows, items, profile-scoped data (`/profile/…`).
 *
 * Lifecycle:
 *   1. signInWithDeviceCode() → stores the refresh token.
 *   2. selectProfile(profileId) → exchanges refresh token for a session token.
 *   3. The app gets bearers via identityBearer() / sessionBearer() and feeds
 *      401 responses back into handleSessionErrorBody() for auto-recovery.
 *   4. signOut() → revokes the refresh token server-side and clears storage.
 */

package api.discovr.auth

import io.ktor.client.HttpClient
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.request.header
import io.ktor.client.request.request
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpMethod
import io.ktor.http.Url
import io.ktor.http.encodeURLParameter
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.time.Clock
import kotlin.time.ExperimentalTime
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.intOrNull
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.longOrNull
import kotlinx.serialization.json.put

/** Persistent storage for refresh / session tokens. Use EncryptedSharedPreferences on Android. */
interface AuthStorage {
    fun get(key: String): String?
    fun put(key: String, value: String?)
}

data class AuthConfig(
    val basePath: String = "https://api.discovr.media",
    val storagePrefix: String = "discovr_",
    val storage: AuthStorage,
    val debug: Boolean = false,
    /**
     * Run against a throwaway demo sandbox instead of a real account.
     *
     * The client obtains its credential from `POST /auth/demo-session` rather
     * than a sign-in flow, and everything after that is the ordinary code path:
     * profiles, session tokens, reads and writes all behave exactly as they do
     * for a real user, because a demo sandbox *is* a real (short-lived) account.
     *
     * Sandboxes expire after a short window and are then deleted, so treat the
     * data as disposable.
     */
    val demoMode: Boolean = false,
    /**
     * Only meaningful with [demoMode] = true. Overrides how long each session
     * token minted for the sandbox lives (default 15 minutes — shorter than
     * the standard 30-minute default everyone else gets, since a demo sandbox
     * is inherently short-lived anyway). Set this to something small (e.g.
     * two minutes) to repeatedly exercise your app's silent session-refresh
     * path on demand, instead of waiting out the real interval. The server
     * clamps this — it can only ever be shorter than the standard default,
     * never longer.
     */
    val demoSessionTtlMs: Long = DEFAULT_DEMO_SESSION_TTL_MS,
    /**
     * Only meaningful with [demoMode] = true. Overrides how long the sandbox
     * itself (and its refresh token) lives — default 30 minutes, unchanged
     * unless set. Shortening this makes the *whole sandbox* expire quickly
     * (triggering a signed-out state, not just a silent refresh) — the server
     * clamps this the same way, shorter only.
     */
    val demoRefreshTtlMs: Long? = null,
    /** Tune or disable the client-side runaway-loop breaker. Enabled by default. */
    val loopGuard: LoopGuardConfig = LoopGuardConfig(),
    /**
     * Remember which profile was selected between launches. Defaults to
     * `false`, like a streaming app: after a relaunch the user is still signed
     * in but has to pick who's watching again, so [AuthState] reports
     * `signedIn = true` with a null `profileId`. Set it to `true` to resume on
     * the profile they last used.
     */
    val rememberProfile: Boolean = false,
)

/** Typed error hierarchy for the Discovr SDK. */
sealed class DiscovrError(message: String) : Exception(message)
class SessionExpiredError(message: String = "Authentication session expired") : DiscovrError(message)
class SessionConsumedError(message: String = "Authentication session already consumed") : DiscovrError(message)
class ClientNotFoundError(message: String = "Client not found") : DiscovrError(message)
class DeviceCodeExpiredError(message: String = "Device code expired") : DiscovrError(message)
class DeviceCodeConsumedError(message: String = "Device code already consumed") : DiscovrError(message)
/** The person looking at the sign-in screen on their phone declined the device. The flow is over. */
class DeviceCodeDeniedError(message: String = "Device sign-in was declined") : DiscovrError(message)
/**
 * A sign-in flow ended because the person (or your code) chose to stop it, not
 * because anything went wrong: they closed the sign-in window, pressed Cancel, or
 * you stopped a device-code flow with [DeviceCodeResult.cancel]. Usually the
 * right response is to say nothing.
 */
class AuthCancelledError(message: String = "Sign-in was cancelled") : DiscovrError(message)
class TokenInvalidError(message: String = "Token invalid") : DiscovrError(message)
class NotSignedInError(message: String = "Not signed in") : DiscovrError(message)

/**
 * Thrown when the client-side loop guard blocks a request because call volume
 * looks like an unintentional loop.
 *
 * Distinct from a server `429`: this request never left the process. Seeing it
 * means the fix is in your own code — a recomposition loop, or a retry without
 * backoff — not a server quota you need to wait out.
 *
 * Deliberately absent from [mapApiErrorCode]: this is a client-side condition,
 * never a server error code.
 */
class RequestLoopError(
    message: String,
    /** Roughly how long until requests are allowed again, in seconds. */
    val retryInSeconds: Int,
) : DiscovrError(message)

/**
 * Thrown when Discovr rate-limited the request.
 *
 * The counterpart to [RequestLoopError]: that one means your own code looped
 * and the request never left the process, this one means it arrived and the
 * server declined it.
 *
 * The SDK deliberately does not wait and retry for you. Limits are per minute,
 * so an automatic retry either blocks your UI for most of a minute or fires
 * again into a closed window. You know whether the call was a user tapping
 * something or a background prefetch; the SDK doesn't.
 */
class RateLimitedError(
    message: String,
    /** Seconds until the current limit window rolls over. */
    val retryInSeconds: Int,
) : DiscovrError(message)
class NoProfileSelectedError(message: String = "No profile selected — call selectProfile() first.") : DiscovrError(message)

/**
 * A failure without a more specific type. [message] is a short description,
 * not the raw response body, and [status] is the HTTP status (0 when the
 * failure never reached the server).
 */
class UnknownApiError(message: String, val status: Int = 0) : DiscovrError(message)

/**
 * Back-off used only when a 429 carries no usable hint at all. Discovr's own
 * limiters always send one, so this applies to a 429 from something in front
 * of Discovr.
 */
internal const val DEFAULT_RETRY_AFTER_SECONDS = 60

/**
 * Ceiling on any retry hint we will honour. The value is network-controlled
 * and apps schedule back-offs on it, so a limit window's worth of slack is the
 * most that can be meaningful.
 */
internal const val MAX_RETRY_AFTER_SECONDS = 300

/**
 * Seconds to wait before retrying a rate-limited request: the `Retry-After`
 * header, else the `retryAfterSeconds` field of the response body (the two
 * carry the same number).
 */
internal fun retryAfterSeconds(headerValue: String?, body: String? = null): Int {
    fun usable(v: Int?): Int? = v?.takeIf { it > 0 }?.coerceAtMost(MAX_RETRY_AFTER_SECONDS)
    usable(headerValue?.trim()?.toIntOrNull())?.let { return it }
    val fromBody = body?.let {
        try {
            Json.parseToJsonElement(it).jsonObject["retryAfterSeconds"]?.jsonPrimitive?.intOrNull
        } catch (_: Exception) { null }
    }
    return usable(fromBody) ?: DEFAULT_RETRY_AFTER_SECONDS
}

/**
 * Map a server error code to the SDK's own typed error.
 *
 * The codes are an implementation detail of the API, so they are translated
 * here and never passed on: an unrecognised code becomes [UnknownApiError]
 * with a generic message, not the code itself.
 */
fun mapApiErrorCode(code: String, message: String? = null): DiscovrError = when (code) {
    "client-not-found", "CLIENT_NOT_FOUND", "MISSING_CLIENT_ID" ->
        ClientNotFoundError(message ?: "Client not found")
    "device-code-expired", "device-code-not-found" ->
        DeviceCodeExpiredError(message ?: "Device code expired")
    "device-code-already-consumed" ->
        DeviceCodeConsumedError(message ?: "Device code already consumed")
    "device-code-denied" ->
        DeviceCodeDeniedError(message ?: "Device sign-in was declined")
    "authorization-cancelled" ->
        AuthCancelledError(message ?: "Sign-in was cancelled")
    "session-expired", "session-not-found", "TOKEN_EXPIRED" ->
        SessionExpiredError(message ?: "Authentication session expired")
    "session-already-consumed" ->
        SessionConsumedError(message ?: "Authentication session already consumed")
    "token-invalid", "TOKEN_INVALID", "WRONG_TOKEN_KIND", "client-mismatch", "code-verifier-invalid" ->
        TokenInvalidError(message ?: "Token invalid")
    else -> UnknownApiError(message ?: "Request failed")
}

private val MACHINE_CODE_REGEX = Regex("^[A-Za-z0-9_-]+$")

/**
 * Translate a non-2xx response into a typed error. The server names failures in
 * the body's `error` field; prose there ("Resource not found") is written for
 * callers and passed on, a machine code we don't know is not.
 */
internal fun apiErrorFor(status: Int, body: String): DiscovrError {
    val code = try {
        Json.parseToJsonElement(body).jsonObject["error"]?.jsonPrimitive?.contentOrNull
    } catch (_: Exception) { null }
    if (code != null) {
        val mapped = mapApiErrorCode(code)
        if (mapped !is UnknownApiError) return mapped
        if (!MACHINE_CODE_REGEX.matches(code)) return UnknownApiError(code, status)
    }
    return UnknownApiError("Request failed (HTTP $status)", status)
}

/** What a deep link back from the sign-in browser carries. */
internal sealed interface RedirectReturn {
    /** Not a sign-in return at all (no `code`, no `error`, or not a URL). */
    data object NotAReturn : RedirectReturn
    data class Code(val code: String, val state: String) : RedirectReturn
    /** The sign-in ended without a code; [error] is the server's code, e.g. `authorization-cancelled`. */
    data class Failed(val error: String, val state: String) : RedirectReturn
}

/**
 * Read a redirect deep link. Pure, so the decisions are tested without a browser.
 *
 * A `refreshToken` parameter is deliberately not a thing any more: the credential
 * is never delivered this way, so a link carrying one is not a sign-in return.
 */
internal fun parseRedirectReturn(uri: String): RedirectReturn {
    val params = try { Url(uri).parameters } catch (_: Exception) { return RedirectReturn.NotAReturn }
    val state = params["state"] ?: return RedirectReturn.NotAReturn
    params["error"]?.let { return RedirectReturn.Failed(it, state) }
    val code = params["code"]?.takeIf { it.isNotEmpty() } ?: return RedirectReturn.NotAReturn
    return RedirectReturn.Code(code, state)
}

/** `/auth/device-codes`, with the QR size when one was asked for (the server accepts 100-1000). */
internal fun deviceCodePath(qrSize: Int?): String =
    if (qrSize == null) "/auth/device-codes" else "/auth/device-codes?size=${qrSize.coerceIn(100, 1000)}"

@Serializable
data class DeviceCodeResult(
    val deviceCode: String,
    val userCode: String,
    /** The QR code as a PNG data URL, ready to use as an image source. */
    val qrCode: String,
    /** Where to send someone who can't scan: they type [userCode] on this page. Show it on screen. */
    val verificationUrl: String,
    /** How long the code is valid, in milliseconds. */
    val expiresIn: Long,
    /**
     * Completes when the flow ends: normally once the person approves, and
     * exceptionally with a typed error if they decline ([DeviceCodeDeniedError]),
     * the code lapses ([DeviceCodeExpiredError]) or you stop it with [cancel]
     * ([AuthCancelledError]). Awaiting it is optional; observing [state] still
     * reports a successful sign-in.
     */
    @kotlinx.serialization.Transient
    val completion: Deferred<Unit> = CompletableDeferred(Unit),
    /** Stop background polling immediately. Safe to call multiple times. */
    @kotlinx.serialization.Transient
    val cancel: () -> Unit = {},
)

/** What a device waits when the server did not say. A safe pace, not a contract: the server always sends one. */
private const val DEFAULT_DEVICE_POLL_INTERVAL_MS = 5_000L
/** The code's lifetime when the server did not report one. */
private const val DEFAULT_DEVICE_CODE_LIFETIME_MS = 600_000L

private fun secondsToMs(seconds: Long?): Long =
    if (seconds != null && seconds > 0) seconds * 1000 else DEFAULT_DEVICE_POLL_INTERVAL_MS

/** What one device-code poll tells the loop to do next. */
internal sealed interface DevicePollStep {
    /** The person approved; here is the credential. */
    data class SignedIn(val refreshToken: String) : DevicePollStep
    /**
     * Keep waiting. [intervalMs] is the server's latest pace and becomes the new
     * normal; [waitMs] is how long to sleep this once (longer when rate-limited).
     */
    data class Wait(val intervalMs: Long, val waitMs: Long = intervalMs) : DevicePollStep
    /** The flow is over, and [error] says why. */
    data class Ended(val error: DiscovrError) : DevicePollStep
}

/** Read a poll answer. Shared in shape with the other SDKs and tested without a network. */
internal fun devicePollStepFor(body: JsonObject, currentIntervalMs: Long): DevicePollStep {
    body["refreshToken"]?.jsonPrimitive?.contentOrNull?.takeIf { it.isNotEmpty() }?.let {
        return DevicePollStep.SignedIn(it)
    }
    // Always the latest: the server may have slowed us down.
    val latest = body["interval"]?.jsonPrimitive?.longOrNull?.takeIf { it > 0 }?.let { it * 1000 }
    return (latest ?: currentIntervalMs).let { DevicePollStep.Wait(it) }
}

/** Read a poll failure: a dead, declined or used code ends the flow; a 429 waits out its window; the rest retry. */
internal fun devicePollStepForError(error: Exception, currentIntervalMs: Long): DevicePollStep = when (error) {
    is DeviceCodeExpiredError, is DeviceCodeConsumedError, is DeviceCodeDeniedError ->
        DevicePollStep.Ended(error as DiscovrError)
    // Told to slow down: wait out the window instead of asking again into it.
    is RateLimitedError ->
        DevicePollStep.Wait(currentIntervalMs, maxOf(currentIntervalMs, error.retryInSeconds * 1000L))
    else -> DevicePollStep.Wait(currentIntervalMs)
}

/**
 * Why the client is signed out, when it did not happen because the app asked.
 *
 *  - [USER] — `signOut()` was called.
 *  - [SESSION_EXPIRED] — the long-lived credential was rejected (it lapsed or
 *    was revoked), so the user has to sign in again.
 *  - [DEMO_ENDED] — the same, for a demo sandbox, which always lapses. Worth
 *    telling apart because the right response differs: offer another demo or a
 *    real sign-in, not "your session has expired".
 */
enum class SignOutReason { USER, SESSION_EXPIRED, DEMO_ENDED }

data class AuthState(
    val signedIn: Boolean,
    val profileId: String?,
    /**
     * Set only while [signedIn] is false and the client was signed out during
     * this run; null when signed in, and on a fresh start with no credential.
     */
    val signOutReason: SignOutReason? = null,
)
data class SessionState(
    val profileId: String?,
    val expiresAt: Long?,
    /**
     * Identifies the recommendations the user is currently browsing. Changes
     * when they turn over (roughly every 30 minutes) — and only then, so a routine credential renewal doesn't look
     * like new content.
     */
    val snapshotId: String? = null,
)

@Serializable
private data class SessionTokenResponse(
    val sessionToken: String,
    val snapshotId: String,
    val expiresAt: Long,
)

@Serializable
private data class ApiErrorBody(
    val error: String? = null,
    val tokenKind: String? = null,
    val filters: JsonObject? = null,
)

private val json = Json { ignoreUnknownKeys = true; explicitNulls = false }

/** A stalled connection (dead network, unresponsive server) fails instead of hanging forever. */
private const val REQUEST_TIMEOUT_MS = 30_000L

/**
 * Default session-token TTL for demo-mode clients only — shorter than the
 * standard 30-minute default, since a demo sandbox is inherently short-lived.
 * Not used for non-demo clients, which get the server's own default.
 */
const val DEFAULT_DEMO_SESSION_TTL_MS = 15 * 60 * 1000L

internal class _DiscovrAuth(
    private val clientID: String,
    private val config: AuthConfig,
) {
    // Dispatchers.Default, not .IO: .IO doesn't exist on Kotlin/JS (it's a
    // JVM/Native-only blocking-thread-pool dispatcher), and none of this
    // scope's work — polling, Ktor calls — is actually blocking I/O anyway.
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    private val httpClient = HttpClient {
        install(HttpTimeout) {
            requestTimeoutMillis = REQUEST_TIMEOUT_MS
            connectTimeoutMillis = REQUEST_TIMEOUT_MS
            socketTimeoutMillis = REQUEST_TIMEOUT_MS
        }
    }

    private var refreshToken: String? = null
    private var sessionToken: String? = null
    private var sessionExpiresAt: Long? = null // unix seconds
    private var activeProfileId: String? = null

    /** The credential belongs to a demo sandbox (signed in via [signInWithDemo], or restored as such). */
    private var demoSession = false
    private var signOutReason: SignOutReason? = null

    /**
     * Set once the client has been signed out, for any reason. A demo-mode
     * client provisions a sandbox the first time it needs a credential, but not
     * again after losing one: silently starting another sandbox hides the lapse
     * from the app and spends one of the caller's five demos an hour. Cleared by
     * an explicit sign-in.
     */
    private var demoProvisioningSuspended = false
    private var mintInFlight: Deferred<String>? = null
    private var activeDeviceCodeJob: Job? = null

    private val loopGuard = _RequestLoopGuard(config.loopGuard)

    /** De-dupes concurrent demo sign-ins so a burst provisions one sandbox, not N. */
    private var demoSignInInFlight: Deferred<Unit>? = null

    private val _state = MutableStateFlow(AuthState(signedIn = false, profileId = null))
    val state: StateFlow<AuthState> = _state.asStateFlow()

    private var snapshotId: String? = null

    /**
     * Emits when the *snapshot* moves, which is a different event from "a new
     * session token exists". [DiscovrClient] clears its response cache off
     * this, so a routine credential renewal no longer throws away page data
     * that is still perfectly good.
     */
    private val _snapshotChanges = MutableSharedFlow<Unit>(extraBufferCapacity = 1)
    val snapshotChanges: SharedFlow<Unit> = _snapshotChanges.asSharedFlow()

    private val _sessionState = MutableStateFlow(SessionState(profileId = null, expiresAt = null))
    val sessionState: StateFlow<SessionState> = _sessionState.asStateFlow()

    init { restore(); emit() }

    val isSignedIn: Boolean get() = refreshToken != null

    /**
     * True if a profile is selected and a **live** session token is held — a session
     * token exists and is not within [SESSION_REFRESH_BUFFER_SEC] of expiry. A
     * restored-but-expired session (see [restore]) returns false, so callers know
     * they must mint before relying on the session.
     */
    val hasActiveProfile: Boolean get() = activeProfileId != null && hasFreshSessionToken()
    fun getActiveProfileId(): String? = activeProfileId

    /**
     * Whether the in-memory session token is present and still comfortably valid
     * (more than [SESSION_REFRESH_BUFFER_SEC] from expiry). Shared by
     * [hasActiveProfile] and [ensureSessionToken] so both agree on what "live" means.
     */
    private fun hasFreshSessionToken(): Boolean {
        val exp = sessionExpiresAt ?: return false
        if (sessionToken == null) return false
        val now = Clock.System.now().epochSeconds
        return exp - now > SESSION_REFRESH_BUFFER_SEC
    }

    /**
     * Bearer for identity-tier endpoints.
     *
     * The single place a refresh token is demanded, and therefore the single
     * place demo mode needs to hook: with [AuthConfig.demoMode] enabled and no
     * credential held, a sandbox is provisioned on demand. Callers stay unaware
     * — which is the design goal, since it means no other method needs a demo
     * branch.
     *
     * `suspend` because provisioning is a network call. The generated
     * `bearerTokenProvider` hook is already `suspend () -> String?`, so no call
     * site changes shape.
     */
    suspend fun identityBearer(): String {
        refreshToken?.let { return it }
        if (config.demoMode && !demoProvisioningSuspended) {
            signInWithDemo()
            refreshToken?.let { return it }
        }
        throw NotSignedInError()
    }

    /** Loop-guard check for generated API requests. Throws before dispatch. */
    internal suspend fun checkRequestLoop(description: String) = loopGuard.check(description)

    /** Bearer for session-tier endpoints — mints a fresh token if needed. */
    suspend fun sessionBearer(): String = ensureSessionToken()

    /** Select / switch / refresh the active profile (all the same operation). */
    suspend fun selectProfile(profileId: String) {
        // Resolves the credential (provisioning a demo sandbox first if the
        // client is in demo mode and has none), so this works identically either way.
        identityBearer()
        val minted = mintSessionToken(profileId)
        activeProfileId = profileId
        setSession(minted.sessionToken, minted.expiresAt, minted.snapshotId)
        persist(); emit()
    }

    suspend fun switchProfile(profileId: String) = selectProfile(profileId)

    /** Revoke this device's refresh token server-side and clear local state. */
    suspend fun signOut() = endSession(SignOutReason.USER)

    /**
     * What a lapsed credential is reported as: a demo sandbox always lapses, so
     * it gets its own reason.
     */
    private fun lapseReason(): SignOutReason =
        if (config.demoMode || demoSession) SignOutReason.DEMO_ENDED else SignOutReason.SESSION_EXPIRED

    /**
     * The one place local auth state is torn down. [signOut] calls it for
     * [SignOutReason.USER]; the recovery paths call it with the reason the
     * credential was lost.
     */
    private suspend fun endSession(reason: SignOutReason) {
        val rt = refreshToken
        refreshToken = null; sessionToken = null; sessionExpiresAt = null; activeProfileId = null
        demoSession = false
        signOutReason = reason
        demoProvisioningSuspended = true
        persist(); emit()
        // DiscovrClient clears its response cache from a sessionState collector
        // (session-tier reads shouldn't survive a session boundary) and, for the
        // public signOut() call, also clears it synchronously beforehand as a
        // belt-and-suspenders measure. But signOut() is also called directly
        // from this class's own 401-recovery paths (handleSessionErrorBody,
        // request()) — those never go through DiscovrClient's wrapper, so
        // without this update the cache would silently survive a forced
        // sign-out. profileId/expiresAt are both null at this point, same as a
        // fresh client that's never minted a session — a valid state to report.
        snapshotId = null
        _sessionState.value = SessionState(profileId = null, expiresAt = null)
        if (rt != null) {
            try { request("DELETE", "/auth/session", null, rt) }
            catch (e: Exception) { log("signOut: server-side revocation failed: $e") }
        }
    }

    /**
     * Sign in using a platform web browser (Custom Tabs on Android / system
     * browser on other platforms). Constructs the `/auth/web/authorize` URL
     * and delivers it to [launchUrl] — the caller is responsible for opening
     * it (e.g. via `CustomTabsIntent` or `Intent.ACTION_VIEW`).
     *
     * This is the OAuth authorization code flow with PKCE. The browser is sent a
     * random `state` and the SHA-256 of a random verifier that stays in this SDK;
     * what the deep link brings back is a single-use code that is worthless without
     * that verifier. Call [handleRedirectUri] with the deep link to redeem it and
     * complete sign-in. The long-lived credential is never in a URL.
     *
     * @param redirectUri  The URI registered for this client. Must match
     *   what was used when creating the client ID.
     * @param launchUrl  Callback that receives the full authorize URL to open.
     */
    fun signInWithWebAuth(redirectUri: String, launchUrl: (String) -> Unit) {
        val state = generateState()
        val pkce = createPkcePair()
        // Survives the app being backgrounded while the browser is up. The
        // verifier is the secret; it is in this storage and in no URL.
        config.storage.put(key("auth_state"), state)
        config.storage.put(key("auth_verifier"), pkce.verifier)
        val url = "${config.basePath}/auth/web/authorize" +
            "?clientID=${clientID.encodeURLParameter()}" +
            "&redirectURL=${redirectUri.encodeURLParameter()}" +
            "&state=${state.encodeURLParameter()}" +
            "&codeChallenge=${pkce.challenge.encodeURLParameter()}" +
            "&codeChallengeMethod=S256" +
            (if (config.demoMode) "&demo=true" else "")
        launchUrl(url)
    }

    /**
     * Complete a web-auth sign-in after the browser delivers the redirect.
     * Reads the `code` and `state` (or `error`) from [uri], redeems the code for
     * the refresh token with the PKCE verifier this SDK kept, and signs in.
     *
     * It claims [uri] only if its `state` is the one persisted by
     * [signInWithWebAuth]. A deep link that merely looks like a return (another
     * OAuth provider's callback, or a link someone crafted) is none of its business:
     * it returns false and touches nothing, so it can neither break the other
     * provider nor cancel a real sign-in. A matching state cannot be forged.
     *
     * @return true if a sign-in completed; false if [uri] is not this SDK's sign-in return.
     * @throws AuthCancelledError if the person cancelled, and the matching typed
     *   error for any other failure.
     */
    suspend fun handleRedirectUri(uri: String): Boolean {
        val result = parseRedirectReturn(uri)
        val state = when (result) {
            is RedirectReturn.Code -> result.state
            is RedirectReturn.Failed -> result.state
            RedirectReturn.NotAReturn -> return false
        }
        val expectedState = config.storage.get(key("auth_state"))
        val verifier = config.storage.get(key("auth_verifier"))
        if (expectedState == null || expectedState != state || verifier == null) return false
        // Ours: single-use from here, whatever happens next.
        config.storage.put(key("auth_state"), null)
        config.storage.put(key("auth_verifier"), null)

        if (result is RedirectReturn.Failed) throw mapApiErrorCode(result.error)

        redeemAuthCode((result as RedirectReturn.Code).code, verifier)
        return true
    }

    /** Trade an authorization code and its verifier for the credential, and sign in with it. */
    private suspend fun redeemAuthCode(code: String, verifier: String) {
        val raw = request(
            "POST",
            "/auth/web/token",
            buildJsonObject {
                put("clientID", clientID)
                put("code", code)
                put("codeVerifier", verifier)
            },
            null,
        )
        val refreshToken = json.parseToJsonElement(raw).jsonObject["refreshToken"]?.jsonPrimitive?.contentOrNull
        if (refreshToken.isNullOrEmpty()) throw UnknownApiError("Sign-in response missing refreshToken")
        acceptRefreshToken(refreshToken)
    }

    /**
     * Cancel all background work and release resources.
     *
     * Call this when the auth object is no longer needed (e.g. when the owning
     * `ViewModel` is cleared, or when the `DiscovrClient` is being torn down).
     * Stops any in-flight device-code poll and cancels the internal
     * [CoroutineScope]. After calling `close()`, this object must not be used
     * again.
     */
    fun close() {
        activeDeviceCodeJob?.cancel()
        activeDeviceCodeJob = null
        scope.cancel()
        httpClient.close()
    }

    /** Unauthenticated API instance for public endpoints (no bearer required). */
    fun publicApi(): api.discovr.apis.DiscovrApi =
        api.discovr.apis.DiscovrApi(baseUrl = config.basePath).apply {
            // Public endpoints carry no bearer, but they must still be loop-guarded:
            // a runaway loop over an unauthenticated endpoint hits the servers just
            // as hard as an authenticated one.
            requestGuard = { checkRequestLoop(it) }
        }

    /**
     * Initiate device-code sign-in. Returns the user code immediately and
     * polls in the background; subscribe to [state] to learn when sign-in
     * completes.
     *
     * The [DeviceCodeResult.cancel] function stops background polling — call
     * it when the user leaves the sign-in screen. Starting a new device-code
     * flow automatically cancels any previous one.
     */
    /**
     * Sign in to a throwaway demo sandbox — no credentials, no sign-up.
     *
     * Leaves the client in the same state as any other sign-in flow, so all
     * subsequent code is identical to a real session. The sandbox comes
     * pre-populated with profiles and viewing history, and expires after a
     * short window.
     *
     * Called automatically on first use when [AuthConfig.demoMode] is set; call
     * it directly to start a sandbox at a moment you choose, or to abandon the
     * current one and get a fresh one. Observe [state] to react to completion.
     */
    suspend fun signInWithDemo() {
        // A demo sign-in provisions server-side state, so concurrent callers
        // must share one in-flight request rather than each creating a sandbox
        // (and burning the caller's hourly quota in the process).
        demoSignInInFlight?.let { return it.await() }

        val deferred = scope.async {
            try {
                val requestBody = buildJsonObject {
                    put("clientId", clientID)
                    config.demoRefreshTtlMs?.let { put("ttlMs", it) }
                }
                val raw = request("POST", "/auth/demo-session", requestBody, null)
                val obj = json.parseToJsonElement(raw).jsonObject
                val rt = obj["refreshToken"]?.jsonPrimitive?.content
                    ?: throw IllegalStateException("Demo session response did not include a refresh token.")
                if (!rt.startsWith("rt_")) {
                    throw IllegalStateException("Demo session response did not include a usable refresh token.")
                }
                // acceptRefreshToken also clears session/profile state: a sandbox
                // is a different account from whatever came before it.
                acceptRefreshToken(rt, demo = true)
            } finally {
                demoSignInInFlight = null
            }
        }
        demoSignInInFlight = deferred
        deferred.await()
    }

    /**
     * [qrSize] is the QR code's size in pixels, clamped to 100-1000. Leave it out
     * for the server default (300); a TV screen wants 600-800.
     *
     * The poll pace is the server's: it returns an `interval` with the code and
     * repeats it on every pending answer, growing it as the code ages, so a TV
     * left on the sign-in screen costs less the longer it sits there. The wait ends
     * when the code does; await [DeviceCodeResult.completion] to learn how it ended.
     */
    suspend fun signInWithDeviceCode(qrSize: Int? = null): DeviceCodeResult {
        // Cancel any in-flight poll from a previous call.
        activeDeviceCodeJob?.cancel()
        activeDeviceCodeJob = null

        val raw = request(
            "POST",
            deviceCodePath(qrSize),
            buildJsonObject {
                put("clientID", clientID)
                put("demo", config.demoMode)
            },
            null,
        )
        val obj = json.parseToJsonElement(raw).jsonObject

        val deviceCode = obj["deviceCode"]!!.jsonPrimitive.content
        val userCode = obj["userCode"]!!.jsonPrimitive.content
        val qrCode = obj["authQRCode"]?.jsonPrimitive?.content ?: ""
        val verificationUrl = obj["verificationUrl"]?.jsonPrimitive?.content ?: ""
        val expiresIn = obj["expiresIn"]?.jsonPrimitive?.longOrNull ?: 0L

        val completion = CompletableDeferred<Unit>()
        val job = scope.launch {
            var intervalMs = secondsToMs(obj["interval"]?.jsonPrimitive?.longOrNull)
            val deadline = Clock.System.now().toEpochMilliseconds() +
                (if (expiresIn > 0) expiresIn else DEFAULT_DEVICE_CODE_LIFETIME_MS)
            // First answer after one interval, not immediately: nobody approves
            // within the round trip it took to show the code.
            delay(intervalMs)
            while (isActive) {
                if (Clock.System.now().toEpochMilliseconds() >= deadline) {
                    completion.completeExceptionally(DeviceCodeExpiredError())
                    break
                }
                val step = try {
                    val r = request("POST", "/auth/device-codes/${deviceCode}/poll", buildJsonObject {}, null)
                    devicePollStepFor(json.parseToJsonElement(r).jsonObject, intervalMs)
                } catch (e: CancellationException) {
                    throw e
                } catch (e: Exception) {
                    val next = devicePollStepForError(e, intervalMs)
                    if (next is DevicePollStep.Wait && e !is RateLimitedError) {
                        log("device-code poll error (will retry): $e")
                    }
                    next
                }
                when (step) {
                    is DevicePollStep.SignedIn -> {
                        acceptRefreshToken(step.refreshToken)
                        completion.complete(Unit)
                        break
                    }
                    is DevicePollStep.Ended -> {
                        completion.completeExceptionally(step.error)
                        break
                    }
                    is DevicePollStep.Wait -> {
                        // A rate-limit wait is a one-off; the server's pace is the new normal.
                        intervalMs = step.intervalMs
                        delay(step.waitMs)
                    }
                }
            }
        }
        // Whoever stops the job (cancel(), a newer flow, closing the client) is a
        // cancellation, and the caller's `completion` should say so rather than hang.
        job.invokeOnCompletion { cause ->
            // A cancellation is the caller's choice; anything else that ended the job
            // (storing the credential failed, say) must not leave `completion` hanging.
            if (cause is CancellationException) completion.completeExceptionally(AuthCancelledError())
            else if (cause != null) completion.completeExceptionally(cause)
            if (activeDeviceCodeJob == job) activeDeviceCodeJob = null
        }
        activeDeviceCodeJob = job

        val cancel: () -> Unit = { job.cancel() }

        return DeviceCodeResult(
            deviceCode = deviceCode,
            userCode = userCode,
            qrCode = qrCode,
            verificationUrl = verificationUrl,
            expiresIn = expiresIn,
            completion = completion,
            cancel = cancel,
        )
    }

    /**
     * Auto-recovery hook for session-tier requests. Pass every 401 response's
     * raw body here — the SDK decides what to do next:
     *  - TOKEN_EXPIRED tokenKind=session → re-mint, retry
     *  - TOKEN_EXPIRED tokenKind=refresh → signOut
     *  - WRONG_TOKEN_KIND → log dev error
     */
    suspend fun handleSessionErrorBody(rawJson: String): RecoveryAction {
        val body = try {
            json.decodeFromString<ApiErrorBody>(rawJson)
        } catch (_: Throwable) {
            // Same fail-safe as request(): an unparseable body (e.g. an HTML
            // WAF/CDN block page) means we can't tell "session token expired"
            // (recoverable) from "refresh token expired" (unrecoverable) apart —
            // default to the safer outcome instead of falling through to NoOp,
            // which the caller (sessionApiCall) turns into an untyped
            // DiscovrException the app has no way to recognize as an auth failure.
            endSession(lapseReason())
            return RecoveryAction.SignedOut
        }
        return when {
            body.error == "TOKEN_EXPIRED" && body.tokenKind == "session" -> {
                sessionToken = null; sessionExpiresAt = null
                RecoveryAction.RetryWithBearer(ensureSessionToken())
            }
            body.error == "TOKEN_EXPIRED" && body.tokenKind == "refresh" -> {
                endSession(lapseReason())
                RecoveryAction.SignedOut
            }
            body.error == "WRONG_TOKEN_KIND" -> {
                println("[_DiscovrAuth] WRONG_TOKEN_KIND — SDK sent the wrong token tier. Report this as an SDK bug.")
                RecoveryAction.NoOp
            }
            else -> RecoveryAction.NoOp
        }
    }

    /**
     * Recovery hook for **identity-tier** requests made through the generated
     * API (`getProfiles`, the session list, ...). Pass every 401 response's raw
     * body here.
     *
     * These calls carry the refresh token itself, so a 401 saying it expired
     * has nothing to recover with: the session ends. Without this, the first
     * call after a demo sandbox lapsed surfaced as a bare 401 while the client
     * went on reporting itself signed in; only the SDK's own requests recovered.
     * Same two cases as [request]: a refresh-kind `TOKEN_EXPIRED`, and a 401
     * whose body cannot be read.
     *
     * @return true if the client was signed out and the caller should throw
     *   [TokenInvalidError]; false if this 401 is not about the refresh token.
     */
    suspend fun handleIdentityErrorBody(rawJson: String): Boolean {
        val body = try {
            json.decodeFromString<ApiErrorBody>(rawJson)
        } catch (_: Throwable) {
            endSession(lapseReason())
            return true
        }
        if (body.error == "TOKEN_EXPIRED" && body.tokenKind == "refresh") {
            endSession(lapseReason())
            return true
        }
        return false
    }

    /**
     * `RecreatePageWithFilters` used to live here. It was never implemented —
     * [_DiscovrClientBase] handled it as a plain retry — so navigating to a
     * page from an earlier session was an unrecoverable failure on Android and
     * iOS while TypeScript quietly recovered.
     *
     * It's gone rather than implemented: a page id is derived from its filters,
     * so it can't belong to the wrong session, and the server resolves it and
     * returns 200. Everything left here is genuinely about authentication.
     */
    sealed class RecoveryAction {
        data class RetryWithBearer(val bearer: String) : RecoveryAction()
        data object SignedOut : RecoveryAction()
        data object NoOp : RecoveryAction()
    }

    // ── Internals ────────────────────────────────────────────────────────

    /** Internal so a test can drive "a new credential was accepted" without a network. */
    internal fun acceptRefreshToken(rt: String, demo: Boolean = config.demoMode) {
        refreshToken = rt; sessionToken = null; sessionExpiresAt = null; activeProfileId = null
        demoSession = demo
        demoProvisioningSuspended = false
        persist(); emit()
    }

    private suspend fun ensureSessionToken(): String {
        val pid = activeProfileId ?: throw NoProfileSelectedError()
        val st = sessionToken
        if (st != null && hasFreshSessionToken()) return st

        val pending = mintInFlight
        if (pending != null) return pending.await()

        val deferred = scope.async {
            try {
                val minted = mintSessionToken(pid)
                setSession(minted.sessionToken, minted.expiresAt, minted.snapshotId)
                persist()
                minted.sessionToken
            } finally { mintInFlight = null }
        }
        mintInFlight = deferred
        return deferred.await()
    }

    private suspend fun mintSessionToken(
        profileId: String,
    ): SessionTokenResponse {
        val requestBody = buildJsonObject {
            put("profileId", profileId)
            // Only demo-mode clients get a ttlMs hint — everyone else keeps the
            // server's own default untouched, exactly as before this option existed.
            if (config.demoMode) put("ttlMs", config.demoSessionTtlMs)
            // Carrying the snapshot forward is what makes renewing a credential
            // invisible. Dropped on a profile switch, where the previous
            // profile's recommendations would be the wrong ones to keep.
            snapshotId?.takeIf { profileId == activeProfileId }?.let { put("snapshotId", it) }
        }
        val raw = request("POST", "/auth/session-token", requestBody, identityBearer())
        return json.decodeFromString(raw)
    }

    private fun setSession(token: String, expiresAt: Long, newSnapshotId: String? = null) {
        sessionToken = token; sessionExpiresAt = expiresAt
        val changed = newSnapshotId != null && newSnapshotId != snapshotId
        if (newSnapshotId != null) snapshotId = newSnapshotId
        _sessionState.value =
            SessionState(profileId = activeProfileId, expiresAt = expiresAt, snapshotId = snapshotId)
        if (changed) _snapshotChanges.tryEmit(Unit)
    }

    private suspend fun request(method: String, path: String, body: JsonObject?, bearer: String?): String {
        loopGuard.check("$method $path")
        val response = httpClient.request("${config.basePath}$path") {
            this.method = HttpMethod.parse(method)
            header("Accept", "application/json")
            if (bearer != null) header("Authorization", "Bearer $bearer")
            if (body != null) {
                header("Content-Type", "application/json")
                setBody(json.encodeToString(JsonObject.serializer(), body))
            }
        }
        val code = response.status.value
        val text = response.bodyAsText()
        if (code !in 200..299) {
            // Identity-tier calls carry their own limit, so a rate-limited sign-in
            // or profile mint surfaces as the same typed error a data call throws,
            // not as the generic exception at the end of this block.
            if (code == 429) {
                throw RateLimitedError(
                    "Too many requests to $path — slow down and try again shortly.",
                    retryAfterSeconds(response.headers["Retry-After"], text),
                )
            }

            // A 401 here means the refresh token itself was rejected — this is the
            // identity tier, so there's no session token to fall back to and no
            // request to retry. handleSessionErrorBody already recovers from this
            // exact shape reactively (mid-session, once a request is already using
            // the session token and gets bounced); this is the other path — minting
            // a session token proactively (mintSessionToken/ensureSessionToken) —
            // which never goes through that hook, so it needs the same recovery
            // here. Skip for the sign-out revocation call itself
            // (DELETE /auth/session) — signOut() already clears local state before
            // this fires, so recovering here would just recurse into a second,
            // no-op signOut().
            // Only when a refresh token was sent: a sign-in call (the code exchange, a
            // device poll) carries none, so its 401 is about the code, and must not
            // sign out a session it knows nothing about.
            if (code == 401 && bearer != null && path != "/auth/session") {
                val body = try {
                    json.decodeFromString<ApiErrorBody>(text)
                } catch (_: Throwable) {
                    // Same fail-safe as handleSessionErrorBody: an identity-tier 401
                    // with an unparseable body (e.g. an HTML WAF/CDN block page) still
                    // means the refresh token was rejected for this request — sign
                    // out and throw a typed error rather than falling through to the
                    // generic error below, which callers have no reliable
                    // way to recognize as an auth failure.
                    endSession(lapseReason())
                    throw TokenInvalidError("Refresh token rejected")
                }
                if (body.error == "TOKEN_EXPIRED" && body.tokenKind == "refresh") {
                    endSession(lapseReason())
                    throw TokenInvalidError("Refresh token expired")
                }
            }
            throw apiErrorFor(code, text)
        }
        return text
    }

    private fun restore() {
        config.storage.get(key("refresh_token"))?.takeIf { it.startsWith("rt_") }?.let { refreshToken = it }
        demoSession = refreshToken != null && config.storage.get(key("demo_session")) == "true"
        // Without rememberProfile only the credential comes back: whatever profile
        // an earlier run stored is not this run's to resume.
        if (!config.rememberProfile) return
        config.storage.get(key("session_token"))?.let { sessionToken = it }
        config.storage.get(key("session_expires_at"))?.toLongOrNull()?.let { sessionExpiresAt = it }
        config.storage.get(key("active_profile_id"))?.let { activeProfileId = it }
        config.storage.get(key("snapshot_id"))?.let { snapshotId = it }
        // Drop expired session token (re-minted on demand).
        val now = Clock.System.now().epochSeconds
        if (sessionExpiresAt != null && sessionExpiresAt!! <= now) { sessionToken = null; sessionExpiresAt = null }
    }

    private fun persist() {
        config.storage.put(key("refresh_token"), refreshToken)
        // Without rememberProfile only the credential is stored. The profile keys
        // are cleared rather than skipped, so a profile stored by an earlier build,
        // or an earlier setting, goes on the next write.
        val remember = config.rememberProfile
        config.storage.put(key("session_token"), if (remember) sessionToken else null)
        config.storage.put(key("session_expires_at"), if (remember) sessionExpiresAt?.toString() else null)
        config.storage.put(key("active_profile_id"), if (remember) activeProfileId else null)
        config.storage.put(key("snapshot_id"), if (remember) snapshotId else null)
        config.storage.put(key("demo_session"), if (demoSession) "true" else null)
    }

    private fun key(name: String) = "${config.storagePrefix}$name"

    /**
     * 32 random bytes, hex-encoded — the CSRF `state` nonce for the web-auth
     * redirect flow. Backed by [secureRandomBytes], a real per-platform CSPRNG
     * (`java.security.SecureRandom` / `SecRandomCopyBytes` / `crypto.getRandomValues`)
     * — `kotlin.random.Random.Default` is not one on every target (it wraps
     * `java.util.Random`, an invertible LCG, on the JVM).
     */
    private fun generateState(): String {
        val bytes = secureRandomBytes(32)
        val sb = StringBuilder(bytes.size * 2)
        for (b in bytes) {
            val i = b.toInt() and 0xFF
            sb.append(HEX_CHARS[i shr 4])
            sb.append(HEX_CHARS[i and 0x0F])
        }
        return sb.toString()
    }

    private fun emit() {
        // A reason describes the signed-out state, so it clears the moment the
        // client is signed in again.
        if (isSignedIn) signOutReason = null
        _state.value = AuthState(
            signedIn = isSignedIn,
            profileId = activeProfileId,
            signOutReason = if (isSignedIn) null else signOutReason,
        )
    }

    private fun log(msg: String) { if (config.debug) println("[_DiscovrAuth] $msg") }

    private companion object {

        /** Lowercase hex alphabet used by [generateState]. */
        const val HEX_CHARS = "0123456789abcdef"

        /**
         * Re-mint a session token this many seconds before it actually expires. A
         * session within this window is treated as "not live" so callers refresh
         * proactively rather than firing a request that races the expiry.
         */
        const val SESSION_REFRESH_BUFFER_SEC = 60L
    }
}
