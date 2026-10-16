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
 try await client.addLikedItem(mediaId: "MV_550")
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
        _internalAuth = _DiscovrAuth(
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
        _internalCache = _DiscovrCache(enabled: cache)
        super.init()
        // Restore persisted tokens now that the actor is fully constructed.
        // Must happen after super.init() so self is fully initialized.
        await _internalAuth.restore()

        // Clear cached page data when the *recommendations* turn over, not on
        // every session mint. Clearing per-mint threw away page data that was
        // still perfectly valid every time a credential was renewed.
        let sessionStream = await _internalAuth.snapshotChangeStream()
        let cache = _internalCache
        cacheClearTask = Task {
            for await _ in sessionStream {
                await cache.clear()
            }
        }
    }

    deinit {
        cacheClearTask?.cancel()
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
        // Clear synchronously here too, don't rely solely on cacheClearTask —
        // it consumes sessionStateStream on its own Task, so there's no
        // guarantee it has run by the time this call returns. This closes
        // that window for the common explicit-switch case; cacheClearTask
        // remains the backstop for turnovers that don't go through here.
        await _internalCache.clear()
    }

    /**
     Switch to a different profile. Mints a new session token
     (which also starts a fresh recommendation snapshot).
     */
    public func switchProfile(profileId: String) async throws {
        try await _auth.switchProfile(profileId)
        await _internalCache.clear()
    }

    /** Revoke the current device's refresh token and clear Keychain state. */
    public func signOut() async {
        // Clear first: local auth state is wiped synchronously inside
        // _auth.signOut() before it awaits the server-side revocation call, so
        // a slow/hanging revocation would otherwise leave stale cache entries
        // around for longer than necessary even though nothing can serve them.
        await _cache.clear()
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

public extension HeroItem {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? id }
}

public extension SearchResult {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? id }
}

public extension NavigationItem {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? pageId }
}

public extension ProviderItem {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? pageId }
}

public extension SimilarResult {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? id }
}

public extension KnownForItem {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? id }
}

public extension SimpleListItem {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? id }
}

public extension PlaybackItem {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? id }
}

public extension HistoryItem {
    /// See ``MediaItem/refOrId``.
    var refOrId: String { ref ?? id }
}

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
