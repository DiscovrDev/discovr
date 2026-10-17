@testable import Discovr
import XCTest
#if canImport(CryptoKit)
import CryptoKit
#endif

/// Tests for `_DiscovrAuth`'s web-auth CSRF `state` handling: nonce
/// generation and the extracted, pure `parseWebAuthCallback` — logic that
/// used to live inline in the `ASWebAuthenticationSession` completion
/// closure, untestable there without a live interactive session. This exact
/// bug (state never sent/validated) had zero coverage before.
final class DiscovrAuthTest: XCTestCase {
    private func auth() -> _DiscovrAuth {
        _DiscovrAuth(clientID: "test-client-id")
    }

    // MARK: - deviceCodePath

    func testDeviceCodePathAsksForTheServerDefaultUnlessASizeIsGiven() {
        XCTAssertEqual(_DiscovrAuth.deviceCodePath(qrSize: nil), "/auth/device-codes")
    }

    func testDeviceCodePathPassesASizeThroughClampedToWhatTheServerAccepts() {
        XCTAssertEqual(_DiscovrAuth.deviceCodePath(qrSize: 700), "/auth/device-codes?size=700")
        XCTAssertEqual(_DiscovrAuth.deviceCodePath(qrSize: 50), "/auth/device-codes?size=100")
        XCTAssertEqual(_DiscovrAuth.deviceCodePath(qrSize: 5000), "/auth/device-codes?size=1000")
    }

    // MARK: - device-code polling: what each answer tells the loop to do

    func testAPollAnswerWithACredentialSignsIn() {
        let step = _DiscovrAuth.devicePollStep(
            body: ["refreshToken": "rt_new", "publicId": "p", "expiresAt": 9], currentInterval: 5)
        XCTAssertEqual(step, .signedIn("rt_new"))
    }

    func testAPendingAnswerAdoptsTheServersLatestInterval() {
        // The server slows a code down as it ages; the loop must follow, not keep its first pace.
        let step = _DiscovrAuth.devicePollStep(body: ["status": "pending", "interval": 10], currentInterval: 5)
        XCTAssertEqual(step, .wait(interval: 10, wait: 10))
    }

    func testAPendingAnswerWithNoIntervalKeepsTheCurrentPace() {
        let step = _DiscovrAuth.devicePollStep(body: ["status": "pending"], currentInterval: 5)
        XCTAssertEqual(step, .wait(interval: 5, wait: 5))
    }

    func testADeclinedExpiredOrUsedCodeEndsTheFlowWithItsTypedError() {
        for err in [AuthError.deviceCodeDenied, .deviceCodeExpired, .deviceCodeConsumed] {
            XCTAssertEqual(_DiscovrAuth.devicePollStep(error: err, currentInterval: 5), .ended(err))
        }
    }

    func testARateLimitWaitsOutItsWindowOnceWithoutChangingTheNormalPace() {
        let step = _DiscovrAuth.devicePollStep(error: .rateLimited(retryInSeconds: 30), currentInterval: 5)
        XCTAssertEqual(step, .wait(interval: 5, wait: 30))
    }

    func testARateLimitShorterThanTheIntervalDoesNotSpeedUpPolling() {
        let step = _DiscovrAuth.devicePollStep(error: .rateLimited(retryInSeconds: 2), currentInterval: 10)
        XCTAssertEqual(step, .wait(interval: 10, wait: 10))
    }

    func testAnyOtherFailureIsTransientAndKeepsPolling() {
        let step = _DiscovrAuth.devicePollStep(error: .http(status: 500, message: "x"), currentInterval: 5)
        XCTAssertEqual(step, .wait(interval: 5, wait: 5))
    }

    func testTheServersIntervalIsUsedAndAnAbsentOneFallsBackToASafePace() {
        XCTAssertEqual(_DiscovrAuth.devicePollSeconds(5), 5)
        XCTAssertEqual(_DiscovrAuth.devicePollSeconds(10.0), 10)
        XCTAssertEqual(_DiscovrAuth.devicePollSeconds(nil), 5)
        XCTAssertEqual(_DiscovrAuth.devicePollSeconds(0), 5)
        XCTAssertEqual(_DiscovrAuth.devicePollSeconds(-3), 5)
    }

    // MARK: - generateState

    func testGenerateStateReturns64CharacterHex() {
        let state = auth().generateState()
        XCTAssertEqual(state.count, 64) // 32 random bytes, hex-encoded
        XCTAssertTrue(state.allSatisfy { $0.isHexDigit })
    }

    func testGenerateStateIsNotConstant() {
        let a = auth()
        XCTAssertNotEqual(a.generateState(), a.generateState())
    }

    #if canImport(CryptoKit)
    // MARK: - PKCE

    func testBase64UrlUsesTheUrlSafeAlphabetWithoutPadding() {
        XCTAssertEqual(_DiscovrAuth.base64Url([]), "")
        XCTAssertEqual(_DiscovrAuth.base64Url(Array("f".utf8)), "Zg")
        XCTAssertEqual(_DiscovrAuth.base64Url(Array("foob".utf8)), "Zm9vYg")
        // 0xFB 0xFF is "+/" in standard base64 and "-_" in the URL-safe one.
        XCTAssertEqual(_DiscovrAuth.base64Url([0xFB, 0xFF]), "-_8")
    }

    func testTheChallengeMatchesTheRfc7636AppendixBVector() {
        let digest = SHA256.hash(data: Data("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk".utf8))
        XCTAssertEqual(
            _DiscovrAuth.base64Url(Array(digest)),
            "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"
        )
    }

    func testAPairIsAFortyThreeCharacterVerifierAndItsS256Challenge() {
        let pair = _DiscovrAuth.createPkcePair()

        XCTAssertEqual(pair.verifier.count, 43)
        XCTAssertEqual(pair.challenge.count, 43)
        XCTAssertTrue(pair.verifier.allSatisfy { $0.isLetter || $0.isNumber || $0 == "-" || $0 == "_" })
        XCTAssertEqual(
            pair.challenge,
            _DiscovrAuth.base64Url(Array(SHA256.hash(data: Data(pair.verifier.utf8))))
        )
    }

    func testPairsNeverRepeat() {
        XCTAssertNotEqual(_DiscovrAuth.createPkcePair().verifier, _DiscovrAuth.createPkcePair().verifier)
    }
    #endif

    #if canImport(AuthenticationServices) && !os(tvOS)
    // MARK: - parseWebAuthCallback

    func testParseWebAuthCallbackAcceptsMatchingStateAndReturnsTheCode() {
        let url = URL(string: "myapp://callback?code=the-code&state=xyz")!

        let result = auth().parseWebAuthCallback(url, expectedState: "xyz")

        switch result {
        case .success(let code):
            XCTAssertEqual(code, "the-code")
        case .failure(let error):
            XCTFail("expected success, got \(error)")
        }
    }

    func testParseWebAuthCallbackRejectsStateMismatch() {
        let url = URL(string: "myapp://callback?code=the-code&state=wrong")!

        let result = auth().parseWebAuthCallback(url, expectedState: "xyz")

        guard case .failure(let error) = result, case .http(_, let body) = error else {
            return XCTFail("expected a .http failure")
        }
        XCTAssertEqual(body, "State mismatch — possible CSRF attempt")
    }

    func testParseWebAuthCallbackRejectsMissingState() {
        // A code with no state at all, when one was expected, must not be
        // accepted as a match against expectedState.
        let url = URL(string: "myapp://callback?code=the-code")!

        guard case .failure = auth().parseWebAuthCallback(url, expectedState: "xyz") else {
            return XCTFail("expected failure when state is absent but was expected")
        }
    }

    func testParseWebAuthCallbackChecksStateBeforeReportingAnError() {
        // A return this flow did not start must not be able to make it report anything.
        let url = URL(string: "myapp://callback?error=authorization-cancelled&state=wrong")!

        guard case .failure(let error) = auth().parseWebAuthCallback(url, expectedState: "xyz"),
              case .http(_, let body) = error else {
            return XCTFail("expected a state-mismatch failure")
        }
        XCTAssertEqual(body, "State mismatch — possible CSRF attempt")
    }

    func testParseWebAuthCallbackSurfacesACancelAsATypedError() {
        let url = URL(string: "myapp://callback?error=authorization-cancelled&state=xyz")!

        guard case .failure(let error) = auth().parseWebAuthCallback(url, expectedState: "xyz") else {
            return XCTFail("expected failure")
        }
        XCTAssertEqual(error, .cancelled)
    }

    func testParseWebAuthCallbackMapsOtherServerErrors() {
        let url = URL(string: "myapp://callback?error=client-not-found&state=xyz")!

        guard case .failure(let error) = auth().parseWebAuthCallback(url, expectedState: "xyz") else {
            return XCTFail("expected failure")
        }
        XCTAssertEqual(error, .clientNotFound)
    }

    func testParseWebAuthCallbackDoesNotBelieveACredentialInTheLink() {
        // The old contract delivered the refresh token here. It never will again.
        let url = URL(string: "myapp://callback?refreshToken=rt_smuggled&state=xyz")!

        guard case .failure(let error) = auth().parseWebAuthCallback(url, expectedState: "xyz"),
              case .http(_, let body) = error else {
            return XCTFail("expected a failure")
        }
        XCTAssertEqual(body, "Missing code")
    }

    #endif

    // MARK: - retryAfterSeconds

    private func response(retryAfter: String?) -> HTTPURLResponse {
        var headers: [String: String] = [:]
        if let retryAfter { headers["Retry-After"] = retryAfter }
        return HTTPURLResponse(
            url: URL(string: "https://api.discovr.media/pages")!,
            statusCode: 429,
            httpVersion: nil,
            headerFields: headers
        )!
    }

    /// `Retry-After` is network-controlled and apps schedule back-offs on it, so
    /// all three SDKs have to agree on what they accept. They previously didn't:
    /// TypeScript took `1e9` as a finite positive value and produced a ~31-year
    /// wait, where Swift and Kotlin fell back to the default.
    func testRetryAfterSecondsUsesAPlainPositiveInteger() {
        XCTAssertEqual(_DiscovrAuth.retryAfterSeconds(response(retryAfter: "14")), 14)
        XCTAssertEqual(_DiscovrAuth.retryAfterSeconds(response(retryAfter: "  14  ")), 14)
    }

    func testRetryAfterSecondsFallsBackOnAnythingUnusable() {
        XCTAssertEqual(_DiscovrAuth.retryAfterSeconds(response(retryAfter: nil)), 60)
        XCTAssertEqual(_DiscovrAuth.retryAfterSeconds(response(retryAfter: "")), 60)
        XCTAssertEqual(_DiscovrAuth.retryAfterSeconds(response(retryAfter: "soon")), 60)
        XCTAssertEqual(_DiscovrAuth.retryAfterSeconds(response(retryAfter: "0")), 60)
        XCTAssertEqual(_DiscovrAuth.retryAfterSeconds(response(retryAfter: "-5")), 60)
        XCTAssertEqual(_DiscovrAuth.retryAfterSeconds(response(retryAfter: "1e9")), 60)
    }

    func testRetryAfterSecondsClampsAnAbsurdWait() {
        // A limit window is a minute. Anything past a few of them must not become
        // a 63-year timer.
        XCTAssertEqual(
            _DiscovrAuth.retryAfterSeconds(response(retryAfter: "2000000000")),
            _DiscovrAuth.maxRetryAfterSeconds
        )
    }

    func testRetryAfterSecondsReadsTheBodyWhenThereIsNoHeader() {
        let body = Data(#"{"error":"RATE_LIMITED","retryAfterSeconds":14}"#.utf8)
        XCTAssertEqual(_DiscovrAuth.retryAfterSeconds(response(retryAfter: nil), body: body), 14)
    }

    func testRetryAfterSecondsPrefersTheHeaderOverTheBody() {
        let body = Data(#"{"retryAfterSeconds":99}"#.utf8)
        XCTAssertEqual(_DiscovrAuth.retryAfterSeconds(response(retryAfter: "7"), body: body), 7)
    }

    // MARK: - authError(status:data:)

    private func mapped(_ error: String, status: Int = 400) -> AuthError {
        _DiscovrAuth.authError(status: status, data: Data(#"{"error":"\#(error)"}"#.utf8))
    }

    func testAuthErrorMapsServerCodesToTypedCases() {
        XCTAssertEqual(mapped("client-not-found"), .clientNotFound)
        XCTAssertEqual(mapped("CLIENT_NOT_FOUND"), .clientNotFound)
        XCTAssertEqual(mapped("MISSING_CLIENT_ID"), .clientNotFound)
        XCTAssertEqual(mapped("device-code-expired", status: 401), .deviceCodeExpired)
        XCTAssertEqual(mapped("device-code-not-found", status: 404), .deviceCodeExpired)
        XCTAssertEqual(mapped("device-code-already-consumed", status: 401), .deviceCodeConsumed)
        XCTAssertEqual(mapped("device-code-denied", status: 401), .deviceCodeDenied)
        XCTAssertEqual(mapped("authorization-cancelled", status: 400), .cancelled)
        XCTAssertEqual(mapped("session-expired", status: 401), .sessionExpired)
        XCTAssertEqual(mapped("session-already-consumed", status: 401), .sessionConsumed)
        XCTAssertEqual(mapped("token-invalid", status: 401), .tokenInvalid)
        XCTAssertEqual(mapped("TOKEN_INVALID", status: 401), .tokenInvalid)
        XCTAssertEqual(mapped("client-mismatch", status: 403), .tokenInvalid)
    }

    func testAuthErrorDoesNotEchoUnknownMachineCodes() {
        // A code we don't know is the server's business, not the app's.
        XCTAssertEqual(
            mapped("some-new-server-code", status: 409),
            .http(status: 409, message: "Request failed (HTTP 409)")
        )
    }

    func testAuthErrorPassesThroughProseMessages() {
        XCTAssertEqual(
            mapped("Resource not found", status: 404),
            .http(status: 404, message: "Resource not found")
        )
    }

    func testAuthErrorSurvivesAnUnparseableBody() {
        XCTAssertEqual(
            _DiscovrAuth.authError(status: 502, data: Data("<html>bad gateway</html>".utf8)),
            .http(status: 502, message: "Request failed (HTTP 502)")
        )
    }

    // MARK: - A lapsed credential, and what the client says about it
    //
    // Only the SDK's own requests used to recover from a refresh-token 401. A call
    // made through the generated identity client (getProfiles, the session list)
    // surfaced as a bare 401 while the client went on reporting itself signed in,
    // so a demo sandbox that lapsed looked like a random failure on whichever call
    // came first. Each test uses its own Keychain prefix and signs out at the end,
    // and the server revocation that follows is pointed at a closed port: it fails
    // fast and the SDK swallows it, as it does offline.

    private func signedInAuth(
        prefix: String = "test_\(UUID().uuidString)_",
        demoMode: Bool = false,
        demoSession: Bool = false
    ) async -> _DiscovrAuth {
        let a = _DiscovrAuth(
            clientID: "test-client-id",
            config: AuthConfig(
                basePath: "http://127.0.0.1:1",
                storagePrefix: prefix,
                demoMode: demoMode
            )
        )
        await a.acceptRefreshToken("rt_existing", demo: demoSession)
        return a
    }

    private func currentState(_ a: _DiscovrAuth) async -> AuthState? {
        var iterator = await a.authStateStream().makeAsyncIterator()
        return await iterator.next()
    }

    private let refreshExpired = Data(#"{"error":"TOKEN_EXPIRED","tokenKind":"refresh"}"#.utf8)

    func testARefreshTokenThatExpiredOnAnIdentityCallSignsTheClientOut() async {
        let a = await signedInAuth()

        let signedOut = await a.handleIdentityErrorBody(refreshExpired)

        XCTAssertTrue(signedOut)
        let state = await currentState(a)
        XCTAssertEqual(state?.signedIn, false)
        XCTAssertEqual(state?.signOutReason, .sessionExpired)
    }

    func testADemoSandboxThatLapsedIsReportedAsDemoEnded() async {
        let a = await signedInAuth(demoSession: true)

        _ = await a.handleIdentityErrorBody(refreshExpired)

        let state = await currentState(a)
        XCTAssertEqual(state?.signOutReason, .demoEnded)
    }

    func testADemoModeClientReportsALapseAsDemoEnded() async {
        let a = await signedInAuth(demoMode: true)

        _ = await a.handleIdentityErrorBody(refreshExpired)

        let state = await currentState(a)
        XCTAssertEqual(state?.signOutReason, .demoEnded)
    }

    func testAnUnreadableIdentityBodyIsTreatedAsALapseToo() async {
        let a = await signedInAuth()

        let signedOut = await a.handleIdentityErrorBody(Data("<html>blocked</html>".utf8))

        XCTAssertTrue(signedOut)
        let isSignedIn = await a.isSignedIn
        XCTAssertFalse(isSignedIn)
    }

    func testAUnauthorizedThatIsNotAboutTheRefreshTokenLeavesTheClientSignedIn() async {
        let a = await signedInAuth()

        let signedOut = await a.handleIdentityErrorBody(Data(#"{"error":"TOKEN_INVALID"}"#.utf8))

        XCTAssertFalse(signedOut)
        let state = await currentState(a)
        XCTAssertEqual(state?.signedIn, true)
        XCTAssertNil(state?.signOutReason)
        await a.signOut() // leave no Keychain items behind
    }

    func testAnExplicitSignOutIsReportedAsUser() async {
        let a = await signedInAuth()

        await a.signOut()

        let state = await currentState(a)
        XCTAssertEqual(state?.signOutReason, .user)
    }

    func testAFreshClientHasNoSignOutReason() async {
        let a = auth()

        let state = await currentState(a)

        XCTAssertEqual(state?.signedIn, false)
        XCTAssertNil(state?.signOutReason)
    }

    func testTheDemoFlagSurvivesARelaunch() async {
        let prefix = "test_\(UUID().uuidString)_"
        _ = await signedInAuth(prefix: prefix, demoSession: true)

        // A new client over the same Keychain, as after an app relaunch. It is not
        // a demo-mode client, so only the stored flag can tell it.
        let relaunched = _DiscovrAuth(
            clientID: "test-client-id",
            config: AuthConfig(basePath: "http://127.0.0.1:1", storagePrefix: prefix)
        )
        await relaunched.restore()
        _ = await relaunched.handleIdentityErrorBody(refreshExpired)

        let state = await currentState(relaunched)
        XCTAssertEqual(state?.signOutReason, .demoEnded)
    }

    func testADemoModeClientDoesNotQuietlyStartAnotherSandboxAfterALapse() async {
        let a = await signedInAuth(demoMode: true)
        _ = await a.handleIdentityErrorBody(refreshExpired)

        // The next use reports the lapse instead of spending another of the
        // caller's five hourly sandboxes without telling the app. (A fresh sandbox
        // would have been requested from the unreachable base path and failed with
        // something other than notSignedIn.)
        do {
            _ = try await a.identityBearer()
            XCTFail("expected notSignedIn")
        } catch let error as AuthError {
            XCTAssertEqual(error, .notSignedIn)
        } catch {
            XCTFail("expected AuthError.notSignedIn, got \(error)")
        }
    }

    // MARK: - Whether the selected profile survives a relaunch
    //
    // It does not by default, like a streaming app: the user stays signed in and
    // picks who's watching again. `rememberProfile: true` resumes instead.

    private func seededKeychain(prefix: String) async {
        let seed = _DiscovrAuth(
            clientID: "test-client-id",
            config: AuthConfig(storagePrefix: prefix)
        )
        await seed.keychainSet("\(prefix)refresh_token", "rt_existing")
        await seed.keychainSet("\(prefix)active_profile_id", "profile-1")
        await seed.keychainSet("\(prefix)session_token", "eyJabc")
        await seed.keychainSet("\(prefix)session_expires_at", "9999999999")
        await seed.keychainSet("\(prefix)snapshot_id", "snap1")
    }

    private func relaunched(prefix: String, rememberProfile: Bool? = nil) async -> _DiscovrAuth {
        let a = _DiscovrAuth(
            clientID: "test-client-id",
            config: rememberProfile.map { AuthConfig(storagePrefix: prefix, rememberProfile: $0) }
                ?? AuthConfig(storagePrefix: prefix)
        )
        await a.restore()
        return a
    }

    private func cleanUp(_ a: _DiscovrAuth, prefix: String) async {
        for name in ["refresh_token", "active_profile_id", "session_token", "session_expires_at", "snapshot_id"] {
            await a.keychainSet("\(prefix)\(name)", nil)
        }
    }

    func testTheProfileIsNotResumedByDefault() async {
        let prefix = "test_\(UUID().uuidString)_"
        await seededKeychain(prefix: prefix)

        let a = await relaunched(prefix: prefix)

        let signedIn = await a.isSignedIn
        let profileId = await a.getActiveProfileId()
        let hasProfile = await a.hasActiveProfile
        XCTAssertTrue(signedIn)
        XCTAssertNil(profileId)
        XCTAssertFalse(hasProfile)
        await cleanUp(a, prefix: prefix)
    }

    func testTheProfileIsResumedWhenRememberProfileIsTrue() async {
        let prefix = "test_\(UUID().uuidString)_"
        await seededKeychain(prefix: prefix)

        let a = await relaunched(prefix: prefix, rememberProfile: true)

        let profileId = await a.getActiveProfileId()
        XCTAssertEqual(profileId, "profile-1")
        await cleanUp(a, prefix: prefix)
    }

    func testAProfileAnEarlierRunStoredIsClearedOnTheNextWrite() async {
        let prefix = "test_\(UUID().uuidString)_"
        await seededKeychain(prefix: prefix)
        let a = await relaunched(prefix: prefix) // default: does not remember

        // Any write to the stored session: here a new sign-in over the same Keychain.
        await a.acceptRefreshToken("rt_other")

        let refresh = await a.keychainGet("\(prefix)refresh_token")
        let profile = await a.keychainGet("\(prefix)active_profile_id")
        let session = await a.keychainGet("\(prefix)session_token")
        XCTAssertEqual(refresh, "rt_other")
        XCTAssertNil(profile)
        XCTAssertNil(session)
        await cleanUp(a, prefix: prefix)
    }

    // MARK: - The device id
    //
    // It identifies the install so that signing in again replaces the previous credential. It must
    // outlive a sign-out, and must be exactly what the server accepts (32 lowercase hex characters).

    private func freshAuth(prefix: String) -> _DiscovrAuth {
        _DiscovrAuth(clientID: "test-client-id", config: AuthConfig(storagePrefix: prefix))
    }

    func testTheDeviceIdIsWellFormedAndStable() async {
        let prefix = "test_\(UUID().uuidString)_"
        let a = freshAuth(prefix: prefix)

        let first = await a.deviceId()
        let second = await a.deviceId()

        XCTAssertTrue(_DiscovrAuth.isDeviceId(first), first)
        XCTAssertEqual(first, second)
        await a.keychainSet("\(prefix)device_id", nil)
    }

    func testTheDeviceIdSurvivesARelaunchAndASignOut() async {
        let prefix = "test_\(UUID().uuidString)_"
        let a = freshAuth(prefix: prefix)
        let first = await a.deviceId()

        await a.acceptRefreshToken("rt_one")
        await a.signOut()
        let afterSignOut = await a.deviceId()
        let relaunched = await freshAuth(prefix: prefix).deviceId()

        XCTAssertEqual(afterSignOut, first)
        XCTAssertEqual(relaunched, first)
        await a.keychainSet("\(prefix)device_id", nil)
    }

    func testTheStoragePrefixSeparatesDeviceIds() async {
        let one = "test_\(UUID().uuidString)_"
        let other = "test_\(UUID().uuidString)_"
        let a = freshAuth(prefix: one)
        let b = freshAuth(prefix: other)

        let idOne = await a.deviceId()
        let idOther = await b.deviceId()

        XCTAssertNotEqual(idOne, idOther)
        await a.keychainSet("\(one)device_id", nil)
        await b.keychainSet("\(other)device_id", nil)
    }

    func testAStoredValueThatIsNotAValidIdIsReplacedRatherThanSent() async {
        let prefix = "test_\(UUID().uuidString)_"
        let a = freshAuth(prefix: prefix)
        await a.keychainSet("\(prefix)device_id", "not-an-id")

        let id = await a.deviceId()

        XCTAssertTrue(_DiscovrAuth.isDeviceId(id), id)
        let stored = await a.keychainGet("\(prefix)device_id")
        XCTAssertEqual(stored, id)
        await a.keychainSet("\(prefix)device_id", nil)
    }

    func testOnlyLowercaseHexOfTheRightLengthIsADeviceId() {
        XCTAssertTrue(_DiscovrAuth.isDeviceId(String(repeating: "a", count: 32)))
        XCTAssertTrue(_DiscovrAuth.isDeviceId("0123456789abcdef0123456789abcdef"))
        XCTAssertFalse(_DiscovrAuth.isDeviceId(String(repeating: "A", count: 32)))
        XCTAssertFalse(_DiscovrAuth.isDeviceId(String(repeating: "a", count: 31)))
        XCTAssertFalse(_DiscovrAuth.isDeviceId(String(repeating: "a", count: 33)))
        XCTAssertFalse(_DiscovrAuth.isDeviceId(String(repeating: "g", count: 32)))
        XCTAssertFalse(_DiscovrAuth.isDeviceId(""))
    }

    func testTheCodeIsRedeemedAndEachPollSentWithTheSameDeviceId() async {
        let prefix = "test_\(UUID().uuidString)_"
        let a = freshAuth(prefix: prefix)

        let redeem = await a.redeemBody(code: "the-code", verifier: "the-verifier")
        let poll = await a.pollBody()
        let stored = await a.deviceId()

        XCTAssertEqual(redeem["deviceId"], stored)
        XCTAssertEqual(poll["deviceId"], stored)
        XCTAssertEqual(redeem["clientID"], "test-client-id")
        XCTAssertEqual(redeem["code"], "the-code")
        XCTAssertEqual(redeem["codeVerifier"], "the-verifier")
        await a.keychainSet("\(prefix)device_id", nil)
    }
}
