/// `_DiscovrAuth` — internal auth helper for the Discovr API.
///
/// Two tokens, two jobs:
///
/// - **Refresh token** (long-lived, 90 d). Used as the bearer for identity-tier
///   endpoints (`GET /profiles`, `POST /auth/session-token`,
///   `/auth/sessions/*`) and to mint session tokens.
/// - **Session token** (short-lived, 30 min). Used for
///   session-tier endpoints — pages, rows, items, profile-scoped data
///   (`/profile/*`).
///
/// Lifecycle:
///   1. `signInWithDeviceCode()` → stores the refresh token in the Keychain.
///   2. `selectProfile(profileId:)` → exchanges refresh token for session token.
///   3. The app gets bearers via `identityBearer()` / `sessionBearer()` and
///      feeds 401 responses back into `handleSessionErrorBody(_:)` for
///      auto-recovery.
///   4. `signOut()` → revokes the refresh token server-side and clears Keychain.

import Foundation
#if canImport(Security)
import Security
#endif
#if canImport(CryptoKit)
import CryptoKit
#endif
#if canImport(AuthenticationServices) && !os(tvOS)
import AuthenticationServices
#endif

public struct AuthConfig: Sendable {
    public var basePath: String
    public var storagePrefix: String
    public var debug: Bool
    /// Run against a throwaway demo sandbox instead of a real account.
    ///
    /// The client obtains its credential from `POST /auth/demo-session` rather
    /// than a sign-in flow, and everything after that is the ordinary code
    /// path: profiles, session tokens, reads and writes all behave exactly as
    /// they do for a real user, because a demo sandbox *is* a real
    /// (short-lived) account.
    ///
    /// Sandboxes expire after a short window and are then deleted, so treat
    /// the data as disposable.
    public var demoMode: Bool
    /// Only meaningful with `demoMode == true`. Overrides how long each
    /// session token minted for the sandbox lives — milliseconds, default 15
    /// minutes (shorter than the standard 30-minute default everyone else
    /// gets, since a demo sandbox is inherently short-lived anyway). Set this
    /// small (e.g. two minutes) to repeatedly exercise your app's silent
    /// session-refresh path on demand. The server clamps this — it can only
    /// ever be shorter than the standard default, never longer.
    public var demoSessionTtlMs: Int
    /// Only meaningful with `demoMode == true`. Overrides how long the
    /// sandbox itself (and its refresh token) lives — milliseconds, default
    /// 30 minutes, unchanged unless set. Shortening this makes the *whole
    /// sandbox* expire quickly (triggering a signed-out state, not just a
    /// silent refresh) — the server clamps this the same way, shorter only.
    public var demoRefreshTtlMs: Int?
    /// Tune or disable the client-side runaway-loop breaker. Enabled by default.
    public var loopGuard: LoopGuardConfig
    /// Remember which profile was selected between launches. Defaults to
    /// `false`, like a streaming app: after a relaunch the user is still signed
    /// in but has to pick who's watching again, so ``AuthState`` reports
    /// `signedIn: true` with a `nil` `profileId`. Set it to `true` to resume on
    /// the profile they last used.
    public var rememberProfile: Bool
    public init(
        basePath: String = "https://api.discovr.media",
        storagePrefix: String = "discovr_",
        debug: Bool = false,
        demoMode: Bool = false,
        demoSessionTtlMs: Int = 15 * 60 * 1000,
        demoRefreshTtlMs: Int? = nil,
        loopGuard: LoopGuardConfig = LoopGuardConfig(),
        rememberProfile: Bool = false
    ) {
        self.basePath = basePath
        self.storagePrefix = storagePrefix
        self.debug = debug
        self.demoMode = demoMode
        self.demoSessionTtlMs = demoSessionTtlMs
        self.demoRefreshTtlMs = demoRefreshTtlMs
        self.loopGuard = loopGuard
        self.rememberProfile = rememberProfile
    }
}

public struct DeviceCodeResult: Sendable {
    public let deviceCode: String
    public let userCode: String
    /// The QR code as a PNG data URL, ready to use as an image source.
    public let qrCode: String
    /// Where to send someone who can't scan: they type `userCode` on this page. Show it on screen.
    public let verificationUrl: String
    /// How long the code is valid, in milliseconds.
    public let expiresIn: Int
    /// Waits for the flow to end. Returns normally once the person approves, and
    /// throws a typed ``AuthError`` if they decline (`.deviceCodeDenied`), the
    /// code lapses (`.deviceCodeExpired`) or you stop it with `cancel`
    /// (`.cancelled`). Calling it is optional: `authStateStream` still reports a
    /// successful sign-in, and a flow nobody awaits ends quietly.
    public let completion: @Sendable () async throws -> Void
    /// Stop background polling immediately. Safe to call multiple times.
    public let cancel: @Sendable () -> Void
}

/// Why the client is signed out, when it did not happen because the app asked.
///
/// - `user`: `signOut()` was called.
/// - `sessionExpired`: the long-lived credential was rejected (it lapsed or was
///   revoked), so the user has to sign in again.
/// - `demoEnded`: the same, for a demo sandbox, which always lapses. Worth
///   telling apart because the right response differs: offer another demo or a
///   real sign-in, not "your session has expired".
public enum SignOutReason: Sendable, Equatable {
    case user
    case sessionExpired
    case demoEnded
}

public struct AuthState: Sendable, Equatable {
    public let signedIn: Bool
    public let profileId: String?
    /// Set only while `signedIn` is false and the client was signed out during
    /// this run; `nil` when signed in, and on a fresh start with no credential.
    public let signOutReason: SignOutReason?
}

public struct SessionState: Sendable, Equatable {
    public let profileId: String?
    public let expiresAt: Int?
    /// Identifies the recommendations the user is currently browsing. Changes
    /// when they turn over (roughly every 30 minutes) — and only then, so a routine credential renewal doesn't look
    /// like new content.
    public let snapshotId: String?
}

/// `recreatePageWithFilters` used to be a case here. It was never implemented —
/// the interceptor handled it as a plain retry — so navigating to a page from
/// an earlier session was an unrecoverable failure on iOS and Android while
/// TypeScript quietly recovered.
///
/// It's gone rather than implemented: a page id is derived from its filters, so
/// it can't belong to the wrong session, and the server resolves it and returns
/// 200. Everything left here is genuinely about authentication.
public enum RecoveryAction: @unchecked Sendable {
    case retryWithBearer(String)
    case signedOut
    case noOp
}

/// Typed failures from sign-in and token handling.
///
/// Cases are the SDK's own vocabulary. The server's wire codes are translated
/// into them and never surfaced, so a server-side rename cannot break a
/// `catch` in an app. A response the SDK doesn't recognise arrives as `.http`
/// carrying the status and a short message, never the raw response body.
public enum AuthError: Error, Sendable, Equatable {
    case notSignedIn
    case noProfileSelected
    /// Any failure without a more specific case. `message` is a short
    /// description, not the raw response body.
    case http(status: Int, message: String)
    /// The sign-in session (web or device flow) timed out or no longer exists.
    case sessionExpired
    /// The sign-in session was already used to mint a token.
    case sessionConsumed
    /// The device code expired or doesn't exist. Request a new one.
    case deviceCodeExpired
    /// The device code was already exchanged for a token.
    case deviceCodeConsumed
    /// The person looking at the sign-in screen on their phone declined the
    /// device. The flow is over.
    case deviceCodeDenied
    /// A sign-in flow ended because the person (or your code) chose to stop it,
    /// not because anything went wrong: they closed the sign-in sheet, pressed
    /// Cancel, or you called `cancel` on a device-code flow. Usually the right
    /// response is to say nothing.
    case cancelled
    /// The Client ID wasn't recognised.
    case clientNotFound
    /// The credentials the SDK sent were rejected. Sign in again.
    case tokenInvalid
    /// Discovr rate-limited the request. `retryInSeconds` is how long until
    /// the current window rolls over.
    ///
    /// The counterpart to `RequestLoopError`: that one means your own code
    /// looped and the request never left the process, this one means it
    /// arrived and the server declined it. The SDK deliberately doesn't wait
    /// and retry for you — limits are per minute or per hour, so an automatic
    /// retry either blocks your UI or fires again into a closed window.
    case rateLimited(retryInSeconds: Int)
}

internal actor _DiscovrAuth {
    private let clientID: String
    private let config: AuthConfig

    private var refreshToken: String?
    private var sessionToken: String?
    private var sessionExpiresAt: Int?            // unix seconds
    private var activeProfileId: String?
    private var snapshotId: String?
    /// The credential belongs to a demo sandbox (signed in via ``signInWithDemo()``, or restored as such).
    private var demoSession = false
    private var signOutReason: SignOutReason?
    /// Set once the client has been signed out, for any reason. A demo-mode
    /// client provisions a sandbox the first time it needs a credential, but not
    /// again after losing one: silently starting another sandbox hides the lapse
    /// from the app and spends one of the caller's five demos an hour. Cleared by
    /// an explicit sign-in.
    private var demoProvisioningSuspended = false
    /// Yields when the *snapshot* moves — a different event from "a new
    /// session token exists". `DiscovrClient` clears its response cache off
    /// this, so a routine credential renewal no longer discards good page data.
    private var snapshotContinuations: [UUID: AsyncStream<Void>.Continuation] = [:]
    private var mintTask: Task<String, Error>?
    private var activeDeviceCodeTask: Task<Void, Error>?

    private let loopGuard: _RequestLoopGuard

    /// De-dupes concurrent demo sign-ins so a burst provisions one sandbox, not N.
    private var demoSignInTask: Task<Void, Error>?

    private var stateContinuations: [UUID: AsyncStream<AuthState>.Continuation] = [:]
    private var sessionContinuations: [UUID: AsyncStream<SessionState>.Continuation] = [:]

    internal init(clientID: String, config: AuthConfig = AuthConfig()) {
        self.clientID = clientID
        self.config = config
        self.loopGuard = _RequestLoopGuard(config: config.loopGuard)
        // restore() is called explicitly by DiscovrClient.init after the
        // actor is fully constructed — this avoids the fire-and-forget Task
        // race where the actor may be used before stored tokens are loaded.
    }

    // MARK: - Public surface

    /// Re-mint a session token this many seconds before it actually expires. A
    /// session within this window is treated as "not live" so callers refresh
    /// proactively rather than firing a request that races the expiry.
    private static let sessionRefreshBufferSec = 60

    /// A stalled connection (dead network, unresponsive server) fails instead
    /// of hanging forever. `URLSession.shared`'s default (60s) would already
    /// cover this, but making it explicit keeps it aligned with the same
    /// budget used for the TS/Kotlin SDKs' equivalent auth HTTP clients.
    private static let requestTimeoutSeconds: TimeInterval = 30
    private static let urlSession: URLSession = {
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = requestTimeoutSeconds
        configuration.timeoutIntervalForResource = requestTimeoutSeconds
        return URLSession(configuration: configuration)
    }()

    public var isSignedIn: Bool { refreshToken != nil }

    /// True if a profile is selected and a **live** session token is held — a
    /// session token exists and is not within ``sessionRefreshBufferSec`` of
    /// expiry. A restored-but-expired session (see ``restore()``) returns false,
    /// so callers know they must mint before relying on the session.
    public var hasActiveProfile: Bool { activeProfileId != nil && hasFreshSessionToken() }
    public func getActiveProfileId() -> String? { activeProfileId }

    /// Whether the in-memory session token is present and still comfortably valid
    /// (more than ``sessionRefreshBufferSec`` from expiry). Shared by
    /// ``hasActiveProfile`` and ``ensureSessionToken()`` so both agree on what
    /// "live" means.
    private func hasFreshSessionToken() -> Bool {
        guard sessionToken != nil, let exp = sessionExpiresAt else { return false }
        let now = Int(Date().timeIntervalSince1970)
        return exp - now > Self.sessionRefreshBufferSec
    }

    /// Bearer for identity-tier endpoints.
    ///
    /// The single place a refresh token is demanded, and therefore the single
    /// place demo mode needs to hook: with ``AuthConfig/demoMode`` enabled and
    /// no credential held, a sandbox is provisioned on demand. Callers stay
    /// unaware — which is the design goal, since it means no other method needs
    /// a demo branch.
    ///
    /// `async` because provisioning is a network call; every existing call site
    /// already awaited this.
    public func identityBearer() async throws -> String {
        if let rt = refreshToken { return rt }
        if config.demoMode && !demoProvisioningSuspended {
            try await signInWithDemo()
            if let rt = refreshToken { return rt }
        }
        throw AuthError.notSignedIn
    }

    /// Loop-guard check for generated API requests. Throws before dispatch.
    internal func checkRequestLoop(_ description: String) async throws {
        try await loopGuard.check(description)
    }

    /// Bearer for session-tier endpoints — mints a fresh token if needed.
    public func sessionBearer() async throws -> String {
        try await ensureSessionToken()
    }

    /// Select / switch / refresh the active profile (all the same operation).
    public func selectProfile(_ profileId: String) async throws {
        // Resolves the credential (provisioning a demo sandbox first if the
        // client is in demo mode and has none), so this works identically
        // either way.
        _ = try await identityBearer()
        let minted = try await mintSessionToken(profileId: profileId)
        activeProfileId = profileId
        // Through `applySession`, not by hand: it is the only place that stores
        // the minted `snapshotId` and notifies snapshot listeners. Setting the
        // token inline instead left `snapshotId` holding the *previous*
        // profile's value, which then satisfied the carry-forward guard on the
        // next mint — so on iOS a profile switch handed the new profile the old
        // profile's recommendations, and nothing watching `snapshotId` ever saw
        // the switch.
        applySession(minted)
        emit()
    }

    public func switchProfile(_ profileId: String) async throws {
        try await selectProfile(profileId)
    }

    /// Revoke the refresh token server-side and clear Keychain state.
    public func signOut() async {
        await endSession(.user)
    }

    /// What a lapsed credential is reported as: a demo sandbox always lapses, so
    /// it gets its own reason.
    private func lapseReason() -> SignOutReason {
        config.demoMode || demoSession ? .demoEnded : .sessionExpired
    }

    /// The one place local auth state is torn down. ``signOut()`` calls it for
    /// `.user`; the recovery paths call it with the reason the credential was lost.
    private func endSession(_ reason: SignOutReason) async {
        let rt = refreshToken
        refreshToken = nil; sessionToken = nil; sessionExpiresAt = nil; activeProfileId = nil
        demoSession = false
        signOutReason = reason
        demoProvisioningSuspended = true
        persist()
        emit()
        // DiscovrClient clears its response cache from sessionStateStream
        // (session-tier reads shouldn't survive a session boundary) and, for
        // the public signOut() call, also clears it synchronously beforehand
        // as a belt-and-suspenders measure. But signOut() is also called
        // directly from this actor's own 401-recovery paths
        // (handleSessionErrorBody, request()) — those never go through
        // DiscovrClient's wrapper, so without this emit the cache would
        // silently survive a forced sign-out. profileId/expiresAt are both
        // nil at this point, same as a fresh client that's never minted a
        // session — a valid state to report.
        emitSession()
        if let rt {
            do { _ = try await request(method: "DELETE", path: "/auth/session", body: nil, bearer: rt) }
            catch { log("signOut: server-side revocation failed: \(error)") }
        }
    }

    /// Sign in using `ASWebAuthenticationSession` (iOS / macOS).
    ///
    /// Opens an in-app browser to `/auth/web/authorize`, waits for the
    /// redirect back to `redirectUri`, and completes sign-in automatically.
    ///
    /// This is the OAuth authorization code flow with PKCE. The browser is sent
    /// a random `state` and the SHA-256 of a random verifier that never leaves
    /// this process; what the redirect brings back is a single-use code that is
    /// worthless without that verifier, which the SDK then redeems over a direct
    /// request. The long-lived credential is never in a URL.
    ///
    /// Throws ``AuthError/cancelled`` if the person closes the sheet or presses
    /// Cancel, and the matching ``AuthError`` for any other failure.
    ///
    /// - Parameters:
    ///   - redirectUri: The custom-scheme URI registered for this client
    ///     (e.g. `"com.example.app://auth/callback"`). Must match the client ID
    ///     configuration on the server.
    ///   - presentationAnchor: The `ASPresentationAnchor` (window) to use.
    #if canImport(AuthenticationServices) && !os(tvOS)
    @available(iOS 13.0, macOS 10.15, *)
    public func signInWithWebAuth(
        redirectUri: String,
        presentationAnchor: ASPresentationAnchor
    ) async throws {
        guard let baseURL = URL(string: config.basePath),
              let encodedClient = clientID.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let encodedRedirect = redirectUri.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) else {
            throw AuthError.http(status: 0, message: "Invalid URL")
        }

        let state = generateState()
        let pkce = Self.createPkcePair()
        keychainSet(key("auth_state"), state)
        guard let encodedState = state.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) else {
            throw AuthError.http(status: 0, message: "Invalid URL")
        }

        let demoQueryParam = config.demoMode ? "&demo=true" : ""
        let authorizeURLString = "\(baseURL)/auth/web/authorize?clientID=\(encodedClient)&redirectURL=\(encodedRedirect)&state=\(encodedState)&codeChallenge=\(pkce.challenge)&codeChallengeMethod=S256\(demoQueryParam)"
        guard let authorizeURL = URL(string: authorizeURLString),
              let callbackScheme = URL(string: redirectUri)?.scheme else {
            throw AuthError.http(status: 0, message: "Invalid redirect URI")
        }

        return try await withCheckedThrowingContinuation { continuation in
            // `presentationContextProvider` is a *weak* reference, so the
            // provider needs an owner that outlives `start()`. Assigning a
            // freshly constructed one inline deallocates it on the next line,
            // leaving the property nil — on iOS that means the sign-in sheet has
            // no anchor to present from. The completion handler is retained by
            // the session for the life of the flow, so capturing the provider
            // there keeps it alive exactly as long as it's needed.
            let anchorProvider = PresentationAnchorProvider(anchor: presentationAnchor)
            let session = ASWebAuthenticationSession(url: authorizeURL, callbackURLScheme: callbackScheme) { [anchorProvider] callbackURL, error in
                defer { withExtendedLifetime(anchorProvider) {} }
                if let error = error {
                    // Closing the sheet is the person's choice, not a failure.
                    if (error as? ASWebAuthenticationSessionError)?.code == .canceledLogin {
                        continuation.resume(throwing: AuthError.cancelled)
                    } else {
                        continuation.resume(throwing: error)
                    }
                    return
                }
                guard let callbackURL = callbackURL else {
                    continuation.resume(throwing: AuthError.http(status: 0, message: "No callback URL"))
                    return
                }
                switch self.parseWebAuthCallback(callbackURL, expectedState: state) {
                case .success(let code):
                    // Gate `continuation.resume()` on the credential actually being
                    // redeemed and stored — resuming right after firing the Task
                    // would let a caller observe "success" before it was.
                    Task {
                        self.clearAuthState()
                        do {
                            try await self.redeemAuthCode(code, verifier: pkce.verifier)
                            continuation.resume()
                        } catch {
                            continuation.resume(throwing: error)
                        }
                    }
                case .failure(let err):
                    continuation.resume(throwing: err)
                }
            }
            session.presentationContextProvider = anchorProvider
            session.prefersEphemeralWebBrowserSession = false
            session.start()
        }
    }

    /// Reads an `ASWebAuthenticationSession` callback URL: the authorization
    /// `code`, or the `error` the sign-in ended with, after validating the `state`
    /// nonce set by ``signInWithWebAuth(redirectUri:presentationAnchor:)``.
    /// Extracted as a pure, `nonisolated` function — no actor isolation, no
    /// Keychain access — so it's unit-testable without spinning up a live
    /// interactive session.
    ///
    /// `state` is checked first, for a failure as much as for a success: a return
    /// this flow did not start must not be able to make it report anything.
    nonisolated internal func parseWebAuthCallback(_ callbackURL: URL, expectedState: String?) -> Result<String, AuthError> {
        let items = URLComponents(url: callbackURL, resolvingAgainstBaseURL: false)?.queryItems
        let state = items?.first(where: { $0.name == "state" })?.value
        guard let expectedState, expectedState == state else {
            return .failure(.http(status: 0, message: "State mismatch — possible CSRF attempt"))
        }
        if let error = items?.first(where: { $0.name == "error" })?.value {
            return .failure(Self.authError(status: 0, code: error))
        }
        guard let code = items?.first(where: { $0.name == "code" })?.value, !code.isEmpty else {
            return .failure(.http(status: 0, message: "Missing code"))
        }
        return .success(code)
    }
    #endif

    /// Trade an authorization code and its verifier for the credential, and sign in with it.
    private func redeemAuthCode(_ code: String, verifier: String) async throws {
        let raw = try await request(
            method: "POST",
            path: "/auth/web/token",
            body: ["clientID": clientID, "code": code, "codeVerifier": verifier],
            bearer: nil
        )
        let json = try JSONSerialization.jsonObject(with: raw) as? [String: Any]
        guard let refreshToken = json?["refreshToken"] as? String, !refreshToken.isEmpty else {
            throw AuthError.http(status: 0, message: "Sign-in response missing refreshToken")
        }
        acceptRefreshToken(refreshToken)
    }

    /// Sign in to a throwaway demo sandbox — no credentials, no sign-up.
    ///
    /// Leaves the client in the same state as any other sign-in flow, so all
    /// subsequent code is identical to a real session. The sandbox comes
    /// pre-populated with profiles and viewing history, and expires after a
    /// short window.
    ///
    /// Called automatically on first use when ``AuthConfig/demoMode`` is set;
    /// call it directly to start a sandbox at a moment you choose, or to
    /// abandon the current one and get a fresh one.
    public func signInWithDemo() async throws {
        // A demo sign-in provisions server-side state, so concurrent callers
        // must share one in-flight request rather than each creating a sandbox
        // (and burning the caller's hourly quota in the process).
        if let inFlight = demoSignInTask {
            return try await inFlight.value
        }

        let task = Task<Void, Error> { [weak self] in
            guard let self else { return }
            var body: [String: Any] = ["clientId": self.clientID]
            if let ttlMs = self.config.demoRefreshTtlMs { body["ttlMs"] = ttlMs }
            let data = try await self.request(
                method: "POST", path: "/auth/demo-session", body: body, bearer: nil
            )
            let obj = try JSONSerialization.jsonObject(with: data) as? [String: Any]
            guard let rt = obj?["refreshToken"] as? String, rt.hasPrefix("rt_") else {
                throw AuthError.notSignedIn
            }
            // acceptRefreshToken also clears session/profile state: a sandbox is
            // a different account from whatever came before it.
            await self.acceptRefreshToken(rt, demo: true)
        }
        demoSignInTask = task
        defer { demoSignInTask = nil }
        try await task.value
    }

    /// Begin device-code sign-in. Returns the user code immediately and polls
    /// in the background; subscribe to `authStateStream` to learn when sign-in
    /// completes, or await `completion` to also learn that the person declined
    /// or the code lapsed.
    ///
    /// The `cancel` closure in the returned `DeviceCodeResult` stops background
    /// polling — call it when the user leaves the sign-in screen. The polling
    /// `Task` also responds to Swift structured-concurrency cancellation.
    /// Starting a new device-code flow automatically cancels any previous one.
    ///
    /// `qrSize` is the QR code's size in pixels, clamped to 100-1000. Leave it
    /// out for the server default (300); a TV screen wants 600-800.
    ///
    /// The poll pace is the server's: it returns an `interval` with the code and
    /// repeats it on every pending answer, growing it as the code ages, so a TV
    /// left on the sign-in screen costs less the longer it sits there. The wait
    /// ends when the code does.
    public func signInWithDeviceCode(qrSize: Int? = nil) async throws -> DeviceCodeResult {
        // Cancel any in-flight poll from a previous call.
        activeDeviceCodeTask?.cancel()
        activeDeviceCodeTask = nil

        let raw = try await request(
            method: "POST",
            path: Self.deviceCodePath(qrSize: qrSize),
            body: ["clientID": clientID, "demo": config.demoMode],
            bearer: nil
        )
        let json = try JSONSerialization.jsonObject(with: raw) as? [String: Any] ?? [:]

        let deviceCode = json["deviceCode"] as? String ?? ""
        let userCode   = json["userCode"]   as? String ?? ""
        let qrCode     = (json["authQRCode"] as? String) ?? (json["qrCode"] as? String) ?? ""
        let verificationUrl = json["verificationUrl"] as? String ?? ""
        let expiresIn  = json["expiresIn"] as? Int ?? 0

        let initialInterval = Self.devicePollSeconds(json["interval"])
        let lifetime = expiresIn > 0 ? Double(expiresIn) / 1000 : Self.defaultDeviceCodeLifetimeSeconds

        let pollTask = Task<Void, Error> {
            do {
                var interval = initialInterval
                let deadline = Date().addingTimeInterval(lifetime)
                // First answer after one interval, not immediately: nobody
                // approves within the round trip it took to show the code.
                try await Task.sleep(nanoseconds: Self.nanoseconds(interval))
                while true {
                    try Task.checkCancellation()
                    if Date() >= deadline {
                        self.clearActiveDeviceCodeTask()
                        throw AuthError.deviceCodeExpired
                    }
                    let step: DevicePollStep
                    do {
                        let r = try await self.request(
                            method: "POST",
                            path: "/auth/device-codes/\(deviceCode)/poll",
                            body: [:],
                            bearer: nil
                        )
                        let body = (try? JSONSerialization.jsonObject(with: r) as? [String: Any]) ?? [:]
                        step = Self.devicePollStep(body: body, currentInterval: interval)
                    } catch let err as AuthError {
                        step = Self.devicePollStep(error: err, currentInterval: interval)
                        if case .wait = step, case .rateLimited = err {} else if case .wait = step {
                            self.log("device-code poll error (will retry): \(err)")
                        }
                    } catch {
                        // Cancelled mid-request, or a transient network failure.
                        try Task.checkCancellation()
                        self.log("device-code poll error (will retry): \(error)")
                        step = .wait(interval: interval, wait: interval)
                    }
                    switch step {
                    case .signedIn(let refreshToken):
                        self.acceptRefreshToken(refreshToken)
                        self.clearActiveDeviceCodeTask()
                        return
                    case .ended(let err):
                        self.clearActiveDeviceCodeTask()
                        throw err
                    case .wait(let latest, let wait):
                        // A rate-limit wait is a one-off; the server's pace is the new normal.
                        interval = latest
                        try await Task.sleep(nanoseconds: Self.nanoseconds(wait))
                    }
                }
            } catch is CancellationError {
                // Whoever stopped the task (cancel(), a newer flow) chose to; the
                // caller's `completion` should say so rather than rethrow a Swift internal.
                throw AuthError.cancelled
            }
        }
        activeDeviceCodeTask = pollTask

        let cancel: @Sendable () -> Void = {
            pollTask.cancel()
        }
        let completion: @Sendable () async throws -> Void = {
            try await pollTask.value
        }

        return DeviceCodeResult(
            deviceCode: deviceCode,
            userCode: userCode,
            qrCode: qrCode,
            verificationUrl: verificationUrl,
            expiresIn: expiresIn,
            completion: completion,
            cancel: cancel
        )
    }

    /// What a device waits when the server did not say. A safe pace, not a
    /// contract: the server always sends one.
    private static let defaultDevicePollSeconds: Double = 5
    /// The code's lifetime when the server did not report one.
    private static let defaultDeviceCodeLifetimeSeconds: Double = 600

    static func devicePollSeconds(_ value: Any?) -> Double {
        let seconds = (value as? Double) ?? (value as? Int).map(Double.init)
        if let seconds, seconds > 0 { return seconds }
        return defaultDevicePollSeconds
    }

    private static func nanoseconds(_ seconds: Double) -> UInt64 {
        UInt64(max(0, seconds) * 1_000_000_000)
    }

    /// What one device-code poll tells the loop to do next.
    enum DevicePollStep: Equatable {
        /// The person approved; here is the credential.
        case signedIn(String)
        /// Keep waiting. `interval` is the server's latest pace and becomes the
        /// new normal; `wait` is how long to sleep this once (longer when rate-limited).
        case wait(interval: Double, wait: Double)
        /// The flow is over, and the error says why.
        case ended(AuthError)
    }

    /// Read a poll answer. Shared in shape with the other SDKs and tested without a network.
    static func devicePollStep(body: [String: Any], currentInterval: Double) -> DevicePollStep {
        if let token = body["refreshToken"] as? String, !token.isEmpty {
            return .signedIn(token)
        }
        // Always the latest: the server may have slowed us down.
        let latest: Double
        if let seconds = (body["interval"] as? Double) ?? (body["interval"] as? Int).map(Double.init), seconds > 0 {
            latest = seconds
        } else {
            latest = currentInterval
        }
        return .wait(interval: latest, wait: latest)
    }

    /// Read a poll failure: a dead, declined or used code ends the flow; a 429
    /// waits out its window; the rest are transient and retry.
    static func devicePollStep(error: AuthError, currentInterval: Double) -> DevicePollStep {
        switch error {
        case .deviceCodeExpired, .deviceCodeConsumed, .deviceCodeDenied:
            return .ended(error)
        case .rateLimited(let retryInSeconds):
            // Told to slow down: wait out the window instead of asking again into it.
            return .wait(interval: currentInterval, wait: max(currentInterval, Double(retryInSeconds)))
        default:
            return .wait(interval: currentInterval, wait: currentInterval)
        }
    }

    /// `/auth/device-codes`, with the QR size when one was asked for (the server accepts 100-1000).
    static func deviceCodePath(qrSize: Int?) -> String {
        guard let qrSize else { return "/auth/device-codes" }
        return "/auth/device-codes?size=\(min(1000, max(100, qrSize)))"
    }

    private func clearActiveDeviceCodeTask() {
        activeDeviceCodeTask = nil
    }

    /// Auto-recovery hook for session-tier requests. Pass every 401 response's
    /// raw body here — the actor decides what to do next.
    public func handleSessionErrorBody(_ data: Data) async -> RecoveryAction {
        guard let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            // Same fail-safe as request(): an unparseable body (e.g. an HTML
            // WAF/CDN block page) means we can't tell "session token expired"
            // (recoverable) from "refresh token expired" (unrecoverable) apart —
            // default to the safer outcome instead of falling through to
            // .noOp, which the interceptor turns into an untyped ErrorResponse.
            await endSession(lapseReason())
            return .signedOut
        }
        let error = json["error"] as? String
        let tokenKind = json["tokenKind"] as? String

        switch (error, tokenKind) {
        case ("TOKEN_EXPIRED", "session"):
            sessionToken = nil; sessionExpiresAt = nil
            do { return .retryWithBearer(try await ensureSessionToken()) }
            catch { return .noOp }

        case ("TOKEN_EXPIRED", "refresh"):
            await endSession(lapseReason())
            return .signedOut

        case ("WRONG_TOKEN_KIND", _):
            print("[_DiscovrAuth] WRONG_TOKEN_KIND — SDK sent the wrong token tier. Report this as an SDK bug.")
            return .noOp

        default:
            return .noOp
        }
    }

    /// Recovery hook for **identity-tier** requests made through the generated
    /// API (`getProfiles`, the session list, ...). Pass every 401 response's raw
    /// body here.
    ///
    /// These calls carry the refresh token itself, so a 401 saying it expired has
    /// nothing to recover with: the session ends. Without this, the first call
    /// after a demo sandbox lapsed surfaced as a bare 401 while the client went on
    /// reporting itself signed in; only the SDK's own requests recovered. Same two
    /// cases as ``request(method:path:body:bearer:)``: a refresh-kind
    /// `TOKEN_EXPIRED`, and a 401 whose body cannot be read.
    ///
    /// - Returns: `true` if the client was signed out.
    @discardableResult
    public func handleIdentityErrorBody(_ data: Data) async -> Bool {
        guard let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            await endSession(lapseReason())
            return true
        }
        if json["error"] as? String == "TOKEN_EXPIRED", json["tokenKind"] as? String == "refresh" {
            await endSession(lapseReason())
            return true
        }
        return false
    }

    /// Subscribe to auth-state changes. Yields the current state immediately,
    /// then again on every change.
    public func authStateStream() -> AsyncStream<AuthState> {
        AsyncStream { continuation in
            let id = UUID()
            stateContinuations[id] = continuation
            continuation.yield(currentAuthState())
            continuation.onTermination = { @Sendable _ in
                Task { await self.removeAuthContinuation(id) }
            }
        }
    }

    /// Subscribe to session changes. Yields the current state immediately, then
    /// on every new session — the initial `selectProfile(_:)`, a profile
    /// switch, and each automatic renewal.
    ///
    /// Watch `snapshotId` rather than the event itself to know when page data
    /// is stale. Most of these are routine credential renewals that leave the
    /// user's recommendations exactly where they were.
    public func sessionStateStream() -> AsyncStream<SessionState> {
        AsyncStream { continuation in
            let id = UUID()
            sessionContinuations[id] = continuation
            continuation.yield(
                SessionState(
                    profileId: activeProfileId,
                    expiresAt: sessionExpiresAt,
                    snapshotId: snapshotId
                )
            )
            continuation.onTermination = { @Sendable _ in
                Task { await self.removeSessionContinuation(id) }
            }
        }
    }

    private func removeAuthContinuation(_ id: UUID) {
        stateContinuations.removeValue(forKey: id)
    }

    private func removeSessionContinuation(_ id: UUID) {
        sessionContinuations.removeValue(forKey: id)
    }

    /// Yields whenever the snapshot moves. Backs `DiscovrClient`'s public
    /// ``DiscovrClient/recommendationChangeStream`` and its cache invalidation.
    internal func snapshotChangeStream() -> AsyncStream<Void> {
        AsyncStream { continuation in
            let id = UUID()
            snapshotContinuations[id] = continuation
            continuation.onTermination = { @Sendable _ in
                Task { await self.removeSnapshotContinuation(id) }
            }
        }
    }

    private func removeSnapshotContinuation(_ id: UUID) {
        snapshotContinuations.removeValue(forKey: id)
    }

    // MARK: - Internals

    /// Ceiling on any retry hint we will honour. The value is
    /// network-controlled and apps schedule back-offs on it, so a limit
    /// window's worth of slack is the most that can be meaningful.
    static let maxRetryAfterSeconds = 300

    /// Seconds to wait before retrying a rate-limited request.
    ///
    /// Read from the `Retry-After` header, else from the `retryAfterSeconds`
    /// field of the response body (the two carry the same number). Discovr's
    /// own limiters always send both; the fallback to a minute only applies to
    /// a 429 from something in front of Discovr that sends neither.
    static func retryAfterSeconds(_ response: URLResponse?, body: Data? = nil) -> Int {
        let header = (response as? HTTPURLResponse)?.value(forHTTPHeaderField: "Retry-After")
        if let header, let seconds = Int(header.trimmingCharacters(in: .whitespaces)), seconds > 0 {
            return min(seconds, maxRetryAfterSeconds)
        }
        if let body,
           let json = try? JSONSerialization.jsonObject(with: body) as? [String: Any],
           let seconds = json["retryAfterSeconds"] as? Int, seconds > 0 {
            return min(seconds, maxRetryAfterSeconds)
        }
        return 60
    }

    /// Translates a non-2xx response into the SDK's own error vocabulary.
    ///
    /// The server names failures in the response's `error` field. Those codes
    /// are an implementation detail of the API, so they are mapped here and
    /// not passed on. Anything unrecognised becomes `.http` with the status
    /// and a short message.
    nonisolated static func authError(status: Int, data: Data) -> AuthError {
        let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any]
        return authError(status: status, code: json?["error"] as? String)
    }

    /// The same mapping for a code that arrived some other way than a response
    /// body, such as the `error` parameter on a sign-in redirect.
    nonisolated static func authError(status: Int, code: String?) -> AuthError {
        switch code {
        case "client-not-found", "CLIENT_NOT_FOUND", "MISSING_CLIENT_ID":
            return .clientNotFound
        case "device-code-expired", "device-code-not-found":
            return .deviceCodeExpired
        case "device-code-already-consumed":
            return .deviceCodeConsumed
        case "device-code-denied":
            return .deviceCodeDenied
        case "authorization-cancelled":
            return .cancelled
        case "session-expired", "session-not-found", "TOKEN_EXPIRED":
            return .sessionExpired
        case "session-already-consumed":
            return .sessionConsumed
        case "token-invalid", "TOKEN_INVALID", "WRONG_TOKEN_KIND", "client-mismatch", "code-verifier-invalid":
            return .tokenInvalid
        default:
            // Prose errors ("Resource not found") are written for callers; machine
            // codes we don't know are not, so don't echo them.
            let isCode = code.map { $0.range(of: #"^[A-Za-z0-9_-]+$"#, options: .regularExpression) != nil } ?? true
            return .http(status: status, message: isCode ? "Request failed (HTTP \(status))" : (code ?? ""))
        }
    }

    private struct SessionTokenResponse: Decodable {
        let sessionToken: String
        let snapshotId: String
        let expiresAt: Int
    }

    internal func acceptRefreshToken(_ rt: String, demo: Bool? = nil) {
        refreshToken = rt; sessionToken = nil; sessionExpiresAt = nil; activeProfileId = nil
        demoSession = demo ?? config.demoMode
        demoProvisioningSuspended = false
        persist()
        emit()
    }

    private func ensureSessionToken() async throws -> String {
        guard let pid = activeProfileId else { throw AuthError.noProfileSelected }
        if let st = sessionToken, hasFreshSessionToken() {
            return st
        }
        if let pending = mintTask { return try await pending.value }

        let task = Task<String, Error> {
            defer { mintTask = nil }
            let minted = try await mintSessionToken(profileId: pid)
            applySession(minted)
            return minted.sessionToken
        }
        mintTask = task
        return try await task.value
    }

    /// Applies a freshly minted session, notifying snapshot subscribers only when
    /// the recommendations actually moved. Shared by `selectProfile` and the
    /// renewal path so neither can forget to store the new snapshot id.
    private func applySession(_ minted: SessionTokenResponse) {
        sessionToken = minted.sessionToken
        sessionExpiresAt = minted.expiresAt
        let changed = minted.snapshotId != snapshotId
        snapshotId = minted.snapshotId
        persist()
        emitSession()
        if changed {
            for cont in snapshotContinuations.values { cont.yield(()) }
        }
    }

    private func mintSessionToken(profileId: String) async throws -> SessionTokenResponse {
        guard let rt = refreshToken else { throw AuthError.notSignedIn }
        var body: [String: Any] = ["profileId": profileId]
        // Only demo-mode clients get a ttlMs hint — everyone else keeps the
        // server's own default untouched, exactly as before this option existed.
        if config.demoMode { body["ttlMs"] = config.demoSessionTtlMs }
        // Carrying the snapshot forward is what makes renewing a credential
        // invisible. Dropped on a profile switch, where the previous profile's
        // recommendations would be the wrong ones to keep.
        if let snapshotId, profileId == activeProfileId { body["snapshotId"] = snapshotId }
        let data = try await request(
            method: "POST",
            path: "/auth/session-token",
            body: body,
            bearer: rt
        )
        return try JSONDecoder().decode(SessionTokenResponse.self, from: data)
    }

    private func request(method: String, path: String, body: [String: Any]?, bearer: String?) async throws -> Data {
        try await loopGuard.check("\(method) \(path)")

        guard let url = URL(string: "\(config.basePath)\(path)") else {
            throw AuthError.http(status: 0, message: "Invalid URL")
        }
        var req = URLRequest(url: url)
        req.httpMethod = method
        req.setValue("application/json", forHTTPHeaderField: "Accept")
        if let bearer { req.setValue("Bearer \(bearer)", forHTTPHeaderField: "Authorization") }
        if let body {
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.httpBody = try JSONSerialization.data(withJSONObject: body)
        }
        let (data, response) = try await Self.urlSession.data(for: req)
        let status = (response as? HTTPURLResponse)?.statusCode ?? 0
        guard (200..<300).contains(status) else {
            // Identity-tier calls carry their own limit, so a rate-limited sign-in
            // or profile mint surfaces as the same typed error a data call throws,
            // not as the generic `.http` case at the end of this block.
            if status == 429 {
                throw AuthError.rateLimited(
                    retryInSeconds: Self.retryAfterSeconds(response, body: data)
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
            if status == 401 && bearer != nil && path != "/auth/session" {
                guard let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                    // Same fail-safe as handleSessionErrorBody: an identity-tier 401
                    // with an unparseable body (e.g. an HTML WAF/CDN block page)
                    // still means the refresh token was rejected for this request —
                    // sign out and throw a typed error rather than falling through
                    // to the generic AuthError.http below, which callers have no
                    // reliable way to recognize as an auth failure.
                    await endSession(lapseReason())
                    throw AuthError.tokenInvalid
                }
                let error = json["error"] as? String
                let tokenKind = json["tokenKind"] as? String
                if error == "TOKEN_EXPIRED" && tokenKind == "refresh" {
                    await endSession(lapseReason())
                    throw AuthError.tokenInvalid
                }
            }
            throw Self.authError(status: status, data: data)
        }
        return data
    }

    // MARK: - Persistence (Keychain)

    private func key(_ name: String) -> String { "\(config.storagePrefix)\(name)" }

    /// 32 random bytes, hex-encoded — the CSRF `state` nonce for the web-auth
    /// redirect flow. `SecRandomCopyBytes` is a real CSPRNG; falls back to
    /// `UInt8.random` only if it's ever unavailable or fails, which should not
    /// happen on any platform this SDK ships to.
    ///
    /// `nonisolated`: touches no actor state, so it's both callable
    /// synchronously from `signInWithWebAuth` and directly unit-testable.
    nonisolated internal func generateState() -> String {
        Self.randomBytes(32).map { String(format: "%02x", $0) }.joined()
    }

    nonisolated internal static func randomBytes(_ count: Int) -> [UInt8] {
        var bytes = [UInt8](repeating: 0, count: count)
        #if canImport(Security)
        let status = SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes)
        if status != errSecSuccess {
            for i in bytes.indices { bytes[i] = UInt8.random(in: 0...255) }
        }
        #else
        for i in bytes.indices { bytes[i] = UInt8.random(in: 0...255) }
        #endif
        return bytes
    }

    /// Base64 with the URL-safe alphabet and no padding.
    nonisolated internal static func base64Url(_ bytes: [UInt8]) -> String {
        Data(bytes).base64EncodedString()
            .replacingOccurrences(of: "+", with: "-")
            .replacingOccurrences(of: "/", with: "_")
            .replacingOccurrences(of: "=", with: "")
    }

    #if canImport(CryptoKit)
    /// A fresh PKCE (RFC 7636) verifier and its S256 challenge.
    ///
    /// The verifier is 32 random bytes, base64url: 43 characters, inside the
    /// 43-128 the RFC allows. It stays in the SDK until the sign-in code is
    /// redeemed; only the challenge (its SHA-256) is sent to the server.
    nonisolated internal static func createPkcePair() -> (verifier: String, challenge: String) {
        let verifier = base64Url(randomBytes(32))
        let digest = SHA256.hash(data: Data(verifier.utf8))
        return (verifier, base64Url(Array(digest)))
    }
    #endif

    /// Clears the persisted `state` nonce after a successful (single-use) match.
    private func clearAuthState() {
        keychainSet(key("auth_state"), nil)
    }

    /// Load persisted tokens from Keychain. Called once by `DiscovrClient.init`
    /// after the actor is constructed. Not thread-safe to call concurrently.
    internal func restore() {
        refreshToken = keychainGet(key("refresh_token")).flatMap { $0.hasPrefix("rt_") ? $0 : nil }
        demoSession = refreshToken != nil && keychainGet(key("demo_session")) == "true"
        // Without rememberProfile only the credential comes back: whatever profile
        // an earlier run stored is not this run's to resume.
        if config.rememberProfile {
            sessionToken = keychainGet(key("session_token"))
            sessionExpiresAt = keychainGet(key("session_expires_at")).flatMap { Int($0) }
            activeProfileId = keychainGet(key("active_profile_id"))
            snapshotId = keychainGet(key("snapshot_id"))
        }

        // Drop expired session token (will be re-minted on demand).
        let now = Int(Date().timeIntervalSince1970)
        if let exp = sessionExpiresAt, exp <= now {
            sessionToken = nil
            sessionExpiresAt = nil
        }
        emit()
    }

    private func persist() {
        keychainSet(key("refresh_token"), refreshToken)
        // Without rememberProfile only the credential is stored. The profile keys
        // are cleared rather than skipped, so a profile stored by an earlier build,
        // or an earlier setting, goes on the next write.
        let remember = config.rememberProfile
        keychainSet(key("session_token"), remember ? sessionToken : nil)
        keychainSet(key("session_expires_at"), remember ? sessionExpiresAt.map(String.init) : nil)
        keychainSet(key("active_profile_id"), remember ? activeProfileId : nil)
        keychainSet(key("snapshot_id"), remember ? snapshotId : nil)
        keychainSet(key("demo_session"), demoSession ? "true" : nil)
    }

    private func currentAuthState() -> AuthState {
        // A reason describes the signed-out state, so it clears the moment the
        // client is signed in again.
        if isSignedIn { signOutReason = nil }
        return AuthState(
            signedIn: isSignedIn,
            profileId: activeProfileId,
            signOutReason: isSignedIn ? nil : signOutReason
        )
    }

    private func emit() {
        let state = currentAuthState()
        for cont in stateContinuations.values { cont.yield(state) }
    }

    private func emitSession() {
        let state = SessionState(
            profileId: activeProfileId,
            expiresAt: sessionExpiresAt,
            snapshotId: snapshotId
        )
        for cont in sessionContinuations.values { cont.yield(state) }
    }

    private func log(_ message: String) {
        if config.debug { print("[_DiscovrAuth] \(message)") }
    }

    // MARK: - Public API factory

    /// Returns a `DiscovrAPIConfiguration` configured with a session-tier
    /// interceptor (auto-mints the token and handles 401 recovery).
    ///
    /// `nonisolated`: only reads the immutable, `Sendable` `config` and hands
    /// out a `self` reference — no actor-isolated mutable state involved — so
    /// callers (the generated `_DiscovrClientBase` config accessors) can read
    /// it synchronously instead of needing `await` at every call site.
    nonisolated internal func sessionAPIConfiguration() -> DiscovrAPIConfiguration {
        DiscovrAPIConfiguration(
            basePath: config.basePath,
            interceptor: DiscovrSessionInterceptor(auth: self)
        )
    }

    /// Returns a `DiscovrAPIConfiguration` configured with an identity-tier
    /// interceptor (injects the refresh token, no recovery loop needed).
    nonisolated internal func identityAPIConfiguration() -> DiscovrAPIConfiguration {
        DiscovrAPIConfiguration(
            basePath: config.basePath,
            interceptor: DiscovrIdentityInterceptor(auth: self)
        )
    }

    /// Returns a `DiscovrAPIConfiguration` with no bearer (for public endpoints).
    ///
    /// Still carries an interceptor: it injects no credential, but the loop
    /// guard must cover unauthenticated traffic too — a runaway loop over a
    /// public endpoint hits the servers just as hard as an authenticated one.
    nonisolated internal func publicAPIConfiguration() -> DiscovrAPIConfiguration {
        DiscovrAPIConfiguration(
            basePath: config.basePath,
            interceptor: DiscovrLoopGuardInterceptor(auth: self)
        )
    }

    // MARK: - Keychain helpers

    internal func keychainGet(_ key: String) -> String? {
        #if canImport(Security)
        let q: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
        ]
        var result: AnyObject?
        let status = SecItemCopyMatching(q as CFDictionary, &result)
        guard status == errSecSuccess, let data = result as? Data else { return nil }
        return String(data: data, encoding: .utf8)
        #else
        return nil
        #endif
    }

    internal func keychainSet(_ key: String, _ value: String?) {
        #if canImport(Security)
        let baseQuery: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
        ]
        SecItemDelete(baseQuery as CFDictionary)
        guard let value, let data = value.data(using: .utf8) else { return }
        var add = baseQuery
        add[kSecValueData as String] = data
        SecItemAdd(add as CFDictionary, nil)
        #endif
    }
}

// MARK: - Session interceptor (auto-injects session token + handles 401 recovery)

final class DiscovrSessionInterceptor: OpenAPIInterceptor, @unchecked Sendable {
    private let auth: _DiscovrAuth

    init(auth: _DiscovrAuth) { self.auth = auth }

    public func intercept<T>(urlRequest: URLRequest, urlSession: URLSessionProtocol, requestBuilder: RequestBuilder<T>, completion: @escaping (Result<URLRequest, Error>) -> Void) {
        // `OpenAPIInterceptor` (generator-owned) declares `completion` without
        // `@Sendable`, so Swift 6 strict concurrency won't let it cross into a
        // spawned `Task` — even a same-typed re-bind is rejected, since the
        // compiler can't inspect what the caller's closure actually captures.
        // `nonisolated(unsafe)` is the sanctioned escape hatch for adapting a
        // completion-handler API like this one to structured concurrency: it's
        // safe here because `completion` is invoked exactly once, from a single
        // Task, and touches no other shared mutable state.
        nonisolated(unsafe) let completion = completion
        Task {
            do {
                try await auth.checkRequestLoop(Self.describe(urlRequest))
                let token = try await auth.sessionBearer()
                var req = urlRequest
                req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
                completion(.success(req))
            } catch {
                completion(.failure(error))
            }
        }
    }

    public func retry<T>(urlRequest: URLRequest, urlSession: URLSessionProtocol, requestBuilder: RequestBuilder<T>, data: Data?, response: URLResponse?, error: Error, completion: @escaping (OpenAPIInterceptorRetry) -> Void) {
        // A 429 is never retried here — limit windows are a minute long, so an
        // automatic retry would either stall the caller or fire into a closed
        // window. It surfaces as `ErrorResponse.error(429, data, response, _)`,
        // which carries the response, so `Retry-After` is readable from it. It
        // can't be a typed `AuthError.rateLimited` on this path for the same
        // reason `.signedOut` can't below: `OpenAPIInterceptorRetry` is generated
        // infrastructure with no slot for a custom error. Identity-tier calls,
        // which don't go through this interceptor, do throw the typed case.
        guard let statusCode = (response as? HTTPURLResponse)?.statusCode, statusCode == 401, let data = data else {
            completion(.dontRetry)
            return
        }
        nonisolated(unsafe) let completion = completion
        Task {
            let action = await auth.handleSessionErrorBody(data)
            switch action {
            case .retryWithBearer:
                // The next intercept call will fetch a fresh bearer automatically.
                completion(.retry)
            case .signedOut:
                // `handleSessionErrorBody` already called `auth.signOut()` — local
                // state and Keychain are cleared and `emit()`/`emitSession()` have
                // fired, so `authStateStream`/`sessionStateStream` subscribers see
                // the sign-out immediately. Unlike the TypeScript and Kotlin SDKs,
                // there is no way to make the *thrown* error a typed `AuthError`
                // here: `OpenAPIInterceptorRetry` (generated infrastructure, not
                // hand-maintained) is a bare `retry`/`dontRetry` enum with no slot
                // for a custom error — choosing `.dontRetry` always surfaces the
                // generated runtime's generic `ErrorResponse`, regardless of what
                // this interceptor does. Making the thrown error typed here would
                // need a change to the openapi-generator Swift template itself
                // (`OpenAPIInterceptorRetry` gaining an `.dontRetry(Error)` case or
                // similar), not something fixable from this file alone.
                completion(.dontRetry)
            default:
                completion(.dontRetry)
            }
        }
    }
}

// MARK: - Identity interceptor (injects refresh token, no recovery loop)

final class DiscovrIdentityInterceptor: OpenAPIInterceptor, @unchecked Sendable {
    private let auth: _DiscovrAuth

    init(auth: _DiscovrAuth) { self.auth = auth }

    public func intercept<T>(urlRequest: URLRequest, urlSession: URLSessionProtocol, requestBuilder: RequestBuilder<T>, completion: @escaping (Result<URLRequest, Error>) -> Void) {
        nonisolated(unsafe) let completion = completion
        Task {
            do {
                try await auth.checkRequestLoop(Self.describe(urlRequest))
                let token = try await auth.identityBearer()
                var req = urlRequest
                req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
                completion(.success(req))
            } catch {
                completion(.failure(error))
            }
        }
    }

    public func retry<T>(urlRequest: URLRequest, urlSession: URLSessionProtocol, requestBuilder: RequestBuilder<T>, data: Data?, response: URLResponse?, error: Error, completion: @escaping (OpenAPIInterceptorRetry) -> Void) {
        // A refresh-token 401 ends the session; nothing here can be retried.
        // As with the session interceptor, the *thrown* error stays the generated
        // runtime's generic `ErrorResponse` (`OpenAPIInterceptorRetry` has no slot
        // for a custom one) — the guarantee is that `authStateStream` reports the
        // sign-out, with its reason, instead of the client staying "signed in".
        guard let statusCode = (response as? HTTPURLResponse)?.statusCode, statusCode == 401, let data = data else {
            completion(.dontRetry)
            return
        }
        nonisolated(unsafe) let completion = completion
        Task {
            await auth.handleIdentityErrorBody(data)
            completion(.dontRetry)
        }
    }
}

/// Describes a request for loop-guard diagnostics: "METHOD /path".
internal func describeRequestForGuard(_ urlRequest: URLRequest) -> String {
    let method = urlRequest.httpMethod ?? "GET"
    let path = urlRequest.url?.path ?? "?"
    return "\(method) \(path)"
}

extension DiscovrSessionInterceptor {
    static func describe(_ r: URLRequest) -> String { describeRequestForGuard(r) }
}

extension DiscovrIdentityInterceptor {
    static func describe(_ r: URLRequest) -> String { describeRequestForGuard(r) }
}

// MARK: - Public interceptor (no bearer; exists purely to run the loop guard)

final class DiscovrLoopGuardInterceptor: OpenAPIInterceptor, @unchecked Sendable {
    private let auth: _DiscovrAuth

    init(auth: _DiscovrAuth) { self.auth = auth }

    public func intercept<T>(urlRequest: URLRequest, urlSession: URLSessionProtocol, requestBuilder: RequestBuilder<T>, completion: @escaping (Result<URLRequest, Error>) -> Void) {
        nonisolated(unsafe) let completion = completion
        Task {
            do {
                try await auth.checkRequestLoop(describeRequestForGuard(urlRequest))
                completion(.success(urlRequest))
            } catch {
                completion(.failure(error))
            }
        }
    }

    public func retry<T>(urlRequest: URLRequest, urlSession: URLSessionProtocol, requestBuilder: RequestBuilder<T>, data: Data?, response: URLResponse?, error: Error, completion: @escaping (OpenAPIInterceptorRetry) -> Void) {
        completion(.dontRetry)
    }
}

// MARK: - ASWebAuthenticationSession presentation helper

#if canImport(AuthenticationServices) && !os(tvOS)
@available(iOS 13.0, macOS 10.15, *)
private final class PresentationAnchorProvider: NSObject, ASWebAuthenticationPresentationContextProviding, @unchecked Sendable {
    let anchor: ASPresentationAnchor
    nonisolated init(anchor: ASPresentationAnchor) { self.anchor = anchor }
    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor { anchor }
}
#endif
