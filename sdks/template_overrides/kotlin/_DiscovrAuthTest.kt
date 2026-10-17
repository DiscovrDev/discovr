package api.discovr.auth

import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.TextContent
import io.ktor.http.headersOf
import kotlinx.coroutines.test.runTest
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertFalse
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

/**
 * Tests for `_DiscovrAuth`'s web-auth CSRF `state` handling: generation,
 * persistence via `AuthStorage`, and validation/single-use-clearing on the
 * redirect callback. This exact bug — every `signInWithWebAuth` call 400ing
 * for want of a `state` param — had zero coverage before; these tests exist
 * to make sure it stays fixed.
 */
class DiscovrAuthTest {

    private class FakeAuthStorage : AuthStorage {
        private val map = mutableMapOf<String, String>()
        override fun get(key: String): String? = map[key]
        override fun put(key: String, value: String?) {
            if (value == null) map.remove(key) else map[key] = value
        }
    }

    private fun newAuth(storage: FakeAuthStorage = FakeAuthStorage()): _DiscovrAuth =
        _DiscovrAuth("test-client-id", AuthConfig(storage = storage))

    @Test
    fun signInWithWebAuthPersistsStateAndIncludesItInTheUrl() {
        val storage = FakeAuthStorage()
        val auth = newAuth(storage)
        var launchedUrl: String? = null

        auth.signInWithWebAuth("myapp://callback") { url -> launchedUrl = url }

        val url = assertNotNull(launchedUrl)
        val stateParam = Regex("state=([^&]+)").find(url)?.groupValues?.get(1)
        val persisted = storage.get("discovr_auth_state")
        assertNotNull(stateParam)
        assertNotNull(persisted)
        assertEquals(persisted, stateParam)
        assertEquals(64, persisted.length) // 32 random bytes, hex-encoded
    }

    @Test
    fun signInWithWebAuthSendsAChallengeAndKeepsTheVerifierToItself() {
        val storage = FakeAuthStorage()
        val auth = newAuth(storage)
        var launchedUrl: String? = null

        auth.signInWithWebAuth("myapp://callback") { url -> launchedUrl = url }

        val url = assertNotNull(launchedUrl)
        val verifier = assertNotNull(storage.get("discovr_auth_verifier"))
        val challenge = assertNotNull(Regex("codeChallenge=([^&]+)").find(url)?.groupValues?.get(1))
        assertEquals(43, verifier.length)
        assertEquals(base64Url(sha256(verifier.encodeToByteArray())), challenge)
        assertTrue(url.contains("codeChallengeMethod=S256"))
        // The secret is in storage and in no URL.
        assertFalse(url.contains(verifier))
    }

    // ── the redirect return ────────────────────────────────────────────────

    @Test
    fun aReturnCarryingACodeIsReadAsOne() {
        assertEquals(
            RedirectReturn.Code("the-code", "s1"),
            parseRedirectReturn("myapp://callback?code=the-code&state=s1"),
        )
    }

    @Test
    fun aReturnCarryingAnErrorIsReadAsAFailure() {
        assertEquals(
            RedirectReturn.Failed("authorization-cancelled", "s1"),
            parseRedirectReturn("myapp://callback?error=authorization-cancelled&state=s1"),
        )
    }

    @Test
    fun aLinkThatIsNotASignInReturnIsLeftAlone() {
        assertEquals(RedirectReturn.NotAReturn, parseRedirectReturn("myapp://callback?state=s1"))
        assertEquals(RedirectReturn.NotAReturn, parseRedirectReturn("myapp://callback?code=abc"))
        assertEquals(RedirectReturn.NotAReturn, parseRedirectReturn("myapp://callback"))
    }

    @Test
    fun aCredentialInTheLinkIsNotBelieved() {
        // The old contract delivered the refresh token here. It never will again.
        assertEquals(
            RedirectReturn.NotAReturn,
            parseRedirectReturn("myapp://callback?refreshToken=rt_smuggled&state=s1"),
        )
    }

    @Test
    fun handleRedirectUriReturnsFalseForALinkThatIsNotASignInReturn() = runTest {
        val auth = newAuth()

        assertFalse(auth.handleRedirectUri("myapp://callback?state=whatever"))
        assertFalse(auth.isSignedIn)
    }

    @Test
    fun handleRedirectUriIgnoresAReturnWhoseStateIsNotOursAndTouchesNothing() = runTest {
        val storage = FakeAuthStorage()
        val auth = newAuth(storage)
        auth.signInWithWebAuth("myapp://callback") { }
        val state = assertNotNull(storage.get("discovr_auth_state"))
        val verifier = assertNotNull(storage.get("discovr_auth_verifier"))

        // Another provider's callback, or a forged link: not ours, and not allowed to cancel ours.
        assertFalse(auth.handleRedirectUri("myapp://callback?code=the-code&state=not-the-real-state"))
        assertFalse(auth.handleRedirectUri("myapp://callback?error=access_denied&state=not-the-real-state"))

        assertFalse(auth.isSignedIn)
        assertEquals(state, storage.get("discovr_auth_state"))
        assertEquals(verifier, storage.get("discovr_auth_verifier"))
    }

    @Test
    fun handleRedirectUriIgnoresAReturnThisAppNeverStarted() = runTest {
        val auth = newAuth()

        assertFalse(auth.handleRedirectUri("myapp://callback?code=the-code&state=abc"))
        assertFalse(auth.isSignedIn)
    }

    @Test
    fun handleRedirectUriRaisesAuthCancelledWhenThePersonCancelled() = runTest {
        val storage = FakeAuthStorage()
        val auth = newAuth(storage)
        auth.signInWithWebAuth("myapp://callback") { }
        val state = assertNotNull(storage.get("discovr_auth_state"))

        assertFailsWith<AuthCancelledError> {
            auth.handleRedirectUri("myapp://callback?error=authorization-cancelled&state=$state")
        }
        assertFalse(auth.isSignedIn)
    }

    // MARK: - retryAfterSeconds

    /**
     * `Retry-After` is network-controlled and apps schedule back-offs on it, so
     * the three SDKs have to agree on what they will accept. They previously
     * didn't: TypeScript used `Number(...)`, which takes `1e9` as a finite
     * positive value and yields a ~31-year wait.
     */
    @Test
    fun retryAfterSecondsUsesTheHeaderWhenItIsAPlainPositiveInteger() {
        assertEquals(14, retryAfterSeconds("14"))
        assertEquals(14, retryAfterSeconds("  14  "))
    }

    @Test
    fun retryAfterSecondsFallsBackOnAnythingUnusable() {
        assertEquals(DEFAULT_RETRY_AFTER_SECONDS, retryAfterSeconds(null))
        assertEquals(DEFAULT_RETRY_AFTER_SECONDS, retryAfterSeconds(""))
        assertEquals(DEFAULT_RETRY_AFTER_SECONDS, retryAfterSeconds("soon"))
        assertEquals(DEFAULT_RETRY_AFTER_SECONDS, retryAfterSeconds("0"))
        assertEquals(DEFAULT_RETRY_AFTER_SECONDS, retryAfterSeconds("-5"))
        // Exponential notation is not an integer count of seconds.
        assertEquals(DEFAULT_RETRY_AFTER_SECONDS, retryAfterSeconds("1e9"))
    }

    @Test
    fun retryAfterSecondsClampsAnAbsurdWait() {
        // A limit window is a minute. Anything past a few of them is a bug or an
        // attack, and either way must not become a 63-year timer.
        assertEquals(MAX_RETRY_AFTER_SECONDS, retryAfterSeconds("2000000000"))
    }

    @Test
    fun retryAfterSecondsReadsTheBodyWhenThereIsNoHeader() {
        assertEquals(14, retryAfterSeconds(null, """{"error":"RATE_LIMITED","retryAfterSeconds":14}"""))
    }

    @Test
    fun retryAfterSecondsPrefersTheHeaderOverTheBody() {
        assertEquals(7, retryAfterSeconds("7", """{"retryAfterSeconds":99}"""))
    }

    @Test
    fun apiErrorForMapsServerCodesToTypedErrors() {
        fun mapped(code: String, status: Int = 400) = apiErrorFor(status, """{"error":"$code"}""")
        assertTrue(mapped("client-not-found") is ClientNotFoundError)
        assertTrue(mapped("CLIENT_NOT_FOUND") is ClientNotFoundError)
        assertTrue(mapped("MISSING_CLIENT_ID") is ClientNotFoundError)
        assertTrue(mapped("device-code-expired", 401) is DeviceCodeExpiredError)
        assertTrue(mapped("device-code-not-found", 404) is DeviceCodeExpiredError)
        assertTrue(mapped("device-code-already-consumed", 401) is DeviceCodeConsumedError)
        assertTrue(mapped("device-code-denied", 401) is DeviceCodeDeniedError)
        assertTrue(mapped("authorization-cancelled", 400) is AuthCancelledError)
        assertTrue(mapped("session-expired", 401) is SessionExpiredError)
        assertTrue(mapped("session-already-consumed", 401) is SessionConsumedError)
        assertTrue(mapped("token-invalid", 401) is TokenInvalidError)
        assertTrue(mapped("TOKEN_INVALID", 401) is TokenInvalidError)
        assertTrue(mapped("client-mismatch", 403) is TokenInvalidError)
    }

    @Test
    fun apiErrorForDoesNotEchoUnknownMachineCodes() {
        val e = apiErrorFor(409, """{"error":"some-new-server-code"}""")
        assertTrue(e is UnknownApiError)
        assertEquals("Request failed (HTTP 409)", e.message)
        assertEquals(409, (e as UnknownApiError).status)
    }

    @Test
    fun apiErrorForPassesThroughProseMessages() {
        assertEquals("Resource not found", apiErrorFor(404, """{"error":"Resource not found"}""").message)
    }

    @Test
    fun apiErrorForSurvivesAnUnparseableBody() {
        assertEquals("Request failed (HTTP 502)", apiErrorFor(502, "<html>bad gateway</html>").message)
    }

    // ── A lapsed credential, and what the client says about it ─────────────────
    //
    // Only the SDK's own requests used to recover from a refresh-token 401. A call
    // made through the generated identity client (getProfiles, the session list)
    // surfaced as a bare 401 while the client went on reporting itself signed in,
    // so a demo sandbox that lapsed looked like a random failure on whichever
    // call came first. The server revocation that follows a sign-out is pointed
    // at a closed port: it fails fast and the SDK swallows it, as it does offline.

    private fun signedInAuth(
        storage: FakeAuthStorage = FakeAuthStorage(),
        demoMode: Boolean = false,
    ): _DiscovrAuth {
        storage.put("discovr_refresh_token", "rt_existing")
        return _DiscovrAuth(
            "test-client-id",
            AuthConfig(basePath = "http://127.0.0.1:1", storage = storage, demoMode = demoMode),
        )
    }

    private val refreshExpired = """{"error":"TOKEN_EXPIRED","tokenKind":"refresh"}"""

    @Test
    fun aRefreshTokenThatExpiredOnAnIdentityCallSignsTheClientOut() = runTest {
        val auth = signedInAuth()

        assertTrue(auth.handleIdentityErrorBody(refreshExpired))

        assertFalse(auth.isSignedIn)
        assertEquals(SignOutReason.SESSION_EXPIRED, auth.state.value.signOutReason)
    }

    @Test
    fun aDemoSandboxThatLapsedIsReportedAsDemoEnded() = runTest {
        val storage = FakeAuthStorage()
        storage.put("discovr_demo_session", "true")
        val auth = signedInAuth(storage)

        assertTrue(auth.handleIdentityErrorBody(refreshExpired))

        assertEquals(SignOutReason.DEMO_ENDED, auth.state.value.signOutReason)
    }

    @Test
    fun aDemoModeClientReportsALapseAsDemoEnded() = runTest {
        val auth = signedInAuth(demoMode = true)

        assertTrue(auth.handleIdentityErrorBody(refreshExpired))

        assertEquals(SignOutReason.DEMO_ENDED, auth.state.value.signOutReason)
    }

    @Test
    fun anUnreadableIdentityBodyIsTreatedAsALapseToo() = runTest {
        val auth = signedInAuth()

        assertTrue(auth.handleIdentityErrorBody("<html>blocked</html>"))

        assertFalse(auth.isSignedIn)
    }

    @Test
    fun aUnauthorizedThatIsNotAboutTheRefreshTokenLeavesTheClientSignedIn() = runTest {
        val auth = signedInAuth()

        assertFalse(auth.handleIdentityErrorBody("""{"error":"TOKEN_INVALID"}"""))

        assertTrue(auth.isSignedIn)
        assertNull(auth.state.value.signOutReason)
    }

    @Test
    fun anExplicitSignOutIsReportedAsUser() = runTest {
        val auth = signedInAuth()

        auth.signOut()

        assertEquals(SignOutReason.USER, auth.state.value.signOutReason)
    }

    @Test
    fun aFreshClientHasNoSignOutReason() {
        val auth = newAuth()

        assertFalse(auth.state.value.signedIn)
        assertNull(auth.state.value.signOutReason)
    }

    @Test
    fun theDemoFlagSurvivesARelaunch() = runTest {
        val storage = FakeAuthStorage()
        storage.put("discovr_refresh_token", "rt_existing")
        storage.put("discovr_demo_session", "true")

        // A new client over the same storage, as after an app relaunch. It is not
        // a demo-mode client, so only the stored flag can tell it.
        val relaunched = signedInAuth(storage)
        relaunched.handleIdentityErrorBody(refreshExpired)

        assertEquals(SignOutReason.DEMO_ENDED, relaunched.state.value.signOutReason)
    }

    @Test
    fun aDemoModeClientDoesNotQuietlyStartAnotherSandboxAfterALapse() = runTest {
        val auth = signedInAuth(demoMode = true)
        auth.handleIdentityErrorBody(refreshExpired)

        // The next use reports the lapse instead of spending another of the
        // caller's five hourly sandboxes without telling the app. (A fresh
        // sandbox would have been requested from the unreachable base path and
        // failed with something other than NotSignedInError.)
        assertFailsWith<NotSignedInError> { auth.identityBearer() }
    }

    // ── Whether the selected profile survives a relaunch ──────────────────────
    //
    // It does not by default, like a streaming app: the user stays signed in and
    // picks who's watching again. rememberProfile = true resumes instead.

    private fun storageWithSelectedProfile(): FakeAuthStorage {
        val storage = FakeAuthStorage()
        storage.put("discovr_refresh_token", "rt_existing")
        storage.put("discovr_active_profile_id", "profile-1")
        storage.put("discovr_session_token", "eyJabc")
        storage.put("discovr_session_expires_at", "9999999999")
        storage.put("discovr_snapshot_id", "snap1")
        return storage
    }

    private fun authOver(storage: FakeAuthStorage, rememberProfile: Boolean? = null): _DiscovrAuth =
        _DiscovrAuth(
            "test-client-id",
            if (rememberProfile == null) AuthConfig(storage = storage)
            else AuthConfig(storage = storage, rememberProfile = rememberProfile),
        )

    @Test
    fun theProfileIsNotResumedByDefault() {
        val auth = authOver(storageWithSelectedProfile())

        assertTrue(auth.isSignedIn)
        assertNull(auth.getActiveProfileId())
        assertFalse(auth.hasActiveProfile)
        assertEquals(AuthState(signedIn = true, profileId = null), auth.state.value)
    }

    @Test
    fun theProfileIsResumedWhenRememberProfileIsTrue() {
        val auth = authOver(storageWithSelectedProfile(), rememberProfile = true)

        assertEquals("profile-1", auth.getActiveProfileId())
        assertEquals(AuthState(signedIn = true, profileId = "profile-1"), auth.state.value)
    }

    @Test
    fun aProfileAnEarlierRunStoredIsClearedOnTheNextWrite() {
        val storage = storageWithSelectedProfile()
        val auth = authOver(storage) // default: does not remember

        // Any write to the stored session: here a new sign-in over the same storage.
        auth.acceptRefreshToken("rt_other")

        assertEquals("rt_other", storage.get("discovr_refresh_token"))
        assertNull(storage.get("discovr_active_profile_id"))
        assertNull(storage.get("discovr_session_token"))
        assertNull(storage.get("discovr_session_expires_at"))
        assertNull(storage.get("discovr_snapshot_id"))
    }

    @Test
    fun deviceCodePathAsksForTheServerDefaultUnlessASizeIsGiven() {
        assertEquals("/auth/device-codes", deviceCodePath(null))
    }

    @Test
    fun deviceCodePathPassesASizeThroughClampedToWhatTheServerAccepts() {
        assertEquals("/auth/device-codes?size=700", deviceCodePath(700))
        assertEquals("/auth/device-codes?size=100", deviceCodePath(50))
        assertEquals("/auth/device-codes?size=1000", deviceCodePath(5000))
    }

    // ── Device-code polling: what each answer tells the loop to do ──────────

    private fun pollBody(json: String) = Json.parseToJsonElement(json).jsonObject

    @Test
    fun aPollAnswerWithACredentialSignsIn() {
        val step = devicePollStepFor(pollBody("""{"refreshToken":"rt_new","publicId":"p","expiresAt":9}"""), 5_000)
        assertEquals(DevicePollStep.SignedIn("rt_new"), step)
    }

    @Test
    fun aPendingAnswerAdoptsTheServersLatestInterval() {
        // The server slows a code down as it ages; the loop must follow, not keep its first pace.
        val step = devicePollStepFor(pollBody("""{"status":"pending","interval":10}"""), 5_000)
        assertEquals(DevicePollStep.Wait(intervalMs = 10_000, waitMs = 10_000), step)
    }

    @Test
    fun aPendingAnswerWithNoIntervalKeepsTheCurrentPace() {
        val step = devicePollStepFor(pollBody("""{"status":"pending"}"""), 5_000)
        assertEquals(DevicePollStep.Wait(intervalMs = 5_000, waitMs = 5_000), step)
    }

    @Test
    fun aDeclinedExpiredOrUsedCodeEndsTheFlowWithItsTypedError() {
        for (e in listOf(DeviceCodeDeniedError(), DeviceCodeExpiredError(), DeviceCodeConsumedError())) {
            val step = devicePollStepForError(e, 5_000)
            assertTrue(step is DevicePollStep.Ended)
            assertTrue(step.error === e)
        }
    }

    @Test
    fun aRateLimitWaitsOutItsWindowOnceWithoutChangingTheNormalPace() {
        val step = devicePollStepForError(RateLimitedError("slow down", 30), 5_000)
        assertEquals(DevicePollStep.Wait(intervalMs = 5_000, waitMs = 30_000), step)
    }

    @Test
    fun aRateLimitShorterThanTheIntervalDoesNotSpeedUpPolling() {
        val step = devicePollStepForError(RateLimitedError("slow down", 2), 10_000)
        assertEquals(DevicePollStep.Wait(intervalMs = 10_000, waitMs = 10_000), step)
    }

    @Test
    fun anyOtherFailureIsTransientAndKeepsPolling() {
        val step = devicePollStepForError(UnknownApiError("Request failed (HTTP 500)", 500), 5_000)
        assertEquals(DevicePollStep.Wait(intervalMs = 5_000, waitMs = 5_000), step)
    }

    // ── the device id ──────────────────────────────────────────────────────

    private class Seen(val path: String, val body: String?)

    private val deviceIdShape = Regex("^[0-9a-f]{32}$")

    /** A network that records every request and answers each one as `answer` says. */
    private fun network(answer: (Seen) -> String): Pair<MockEngine, MutableList<Seen>> {
        val seen = mutableListOf<Seen>()
        val engine = MockEngine { request ->
            val entry = Seen(request.url.encodedPath, (request.body as? TextContent)?.text)
            seen += entry
            respond(
                content = answer(entry),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json"),
            )
        }
        return engine to seen
    }

    private fun credential() = """{"refreshToken":"rt_abc","publicId":"p","expiresAt":9}"""

    private fun deviceIdIn(body: String?): String? =
        body?.let { Json.parseToJsonElement(it).jsonObject["deviceId"]?.jsonPrimitive?.content }

    /** One full redirect sign-in: start it, then return the way the system browser would. */
    private suspend fun signInByRedirect(auth: _DiscovrAuth, storage: AuthStorage) {
        auth.signInWithWebAuth("myapp://callback") { }
        val state = assertNotNull(storage.get("discovr_auth_state"))
        assertTrue(auth.handleRedirectUri("myapp://callback?code=the-code&state=$state"))
    }

    @Test
    fun theCodeIsRedeemedWithAWellFormedDeviceIdKeptUnderItsOwnKey() = runTest {
        val storage = FakeAuthStorage()
        val (engine, seen) = network { credential() }
        val auth = _DiscovrAuth("test-client-id", AuthConfig(storage = storage), engine)

        signInByRedirect(auth, storage)

        val sent = assertNotNull(deviceIdIn(seen.single { it.path == "/auth/web/token" }.body))
        assertTrue(deviceIdShape.matches(sent))
        assertEquals(sent, storage.get("discovr_device_id"))
    }

    @Test
    fun theDeviceIdOutlivesASignOutSoAReSignInCanReplaceTheOldCredential() = runTest {
        val storage = FakeAuthStorage()
        val (engine, seen) = network { credential() }
        val auth = _DiscovrAuth("test-client-id", AuthConfig(storage = storage), engine)

        signInByRedirect(auth, storage)
        val first = storage.get("discovr_device_id")
        auth.signOut()
        assertEquals(first, storage.get("discovr_device_id"))
        signInByRedirect(auth, storage)

        val sent = seen.filter { it.path == "/auth/web/token" }.map { deviceIdIn(it.body) }
        assertEquals(listOf(first, first), sent)
    }

    @Test
    fun aStoredValueThatIsNotAValidIdIsReplacedRatherThanSent() = runTest {
        val storage = FakeAuthStorage().also { it.put("discovr_device_id", "not-an-id") }
        val (engine, seen) = network { credential() }
        val auth = _DiscovrAuth("test-client-id", AuthConfig(storage = storage), engine)

        signInByRedirect(auth, storage)

        val sent = assertNotNull(deviceIdIn(seen.single { it.path == "/auth/web/token" }.body))
        assertTrue(deviceIdShape.matches(sent))
        assertEquals(sent, storage.get("discovr_device_id"))
    }

    @Test
    fun storageThatCannotBeWrittenStillGivesOneIdForTheLifetimeOfTheClient() = runTest {
        val real = FakeAuthStorage()
        // Reads and writes of the device id fail; everything else behaves.
        val storage = object : AuthStorage {
            override fun get(key: String): String? =
                if (key.endsWith("device_id")) throw IllegalStateException("denied") else real.get(key)
            override fun put(key: String, value: String?) {
                if (key.endsWith("device_id")) throw IllegalStateException("denied") else real.put(key, value)
            }
        }
        val (engine, seen) = network { credential() }
        val auth = _DiscovrAuth("test-client-id", AuthConfig(storage = storage), engine)

        signInByRedirect(auth, storage)
        auth.signOut()
        signInByRedirect(auth, storage)

        val sent = seen.filter { it.path == "/auth/web/token" }.map { deviceIdIn(it.body) }
        assertEquals(2, sent.size)
        assertTrue(deviceIdShape.matches(assertNotNull(sent[0])))
        assertEquals(sent[0], sent[1])
    }

    @Test
    fun theDevicePollCarriesTheSameDeviceId() = runTest {
        val storage = FakeAuthStorage()
        val (engine, seen) = network { entry ->
            if (entry.path.endsWith("/poll")) credential()
            else """{"deviceCode":"dvc_1","userCode":"1234","authQRCode":"","verificationUrl":"","expiresIn":600000,"interval":1}"""
        }
        val auth = _DiscovrAuth("test-client-id", AuthConfig(storage = storage), engine)

        val flow = auth.signInWithDeviceCode()
        flow.completion.await()

        val sent = assertNotNull(deviceIdIn(seen.first { it.path.endsWith("/poll") }.body))
        assertTrue(deviceIdShape.matches(sent))
        assertEquals(sent, storage.get("discovr_device_id"))
    }
}
