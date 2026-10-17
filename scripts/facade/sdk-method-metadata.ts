/**
 * Structured metadata for SDK methods that don't have OpenAPI operations
 * (auth flows, profile selection, reactive state listeners).
 *
 * Exported as a typed array for SDK documentation generation.
 */

interface SdkMethodParam {
	name: string;
	type: string;
	required: boolean;
	description: string;
}

interface SdkMethodReturns {
	type: string;
	description: string;
}

export interface SdkMethod {
	/** Unique identifier (e.g., "signInWithPopup") */
	id: string;
	/** Auth sub-category for organizing auth methods (e.g., "sign-in-flows", "profile-management") */
	authCategory?: "sign-in-flows" | "profile-management" | "state-and-session";
	/**
	 * Method signature per language. `null` means the method genuinely has no
	 * equivalent in that language — the generated page omits the tab and says so,
	 * rather than showing the nearest-looking alternative under the wrong name.
	 */
	signature: {
		typescript: string | null;
		kotlin: string | null;
		swift: string | null;
	};
	/** One-line summary */
	summary: string;
	/** Full description */
	description: string;
	/** Method parameters */
	params: SdkMethodParam[];
	/** Return value description */
	returns: SdkMethodReturns;
	/** Code snippets per language. `null` mirrors `signature` — no tab is emitted. */
	snippets: {
		typescript: string | null;
		kotlin: string | null;
		swift: string | null;
	};
}

export const SDK_METHOD_METADATA: SdkMethod[] = [
	{
		id: "signInWithDemo",
		authCategory: "sign-in-flows",
		signature: {
			typescript: "signInWithDemo(): Promise<SignInResult>",
			kotlin: "suspend fun signInWithDemo()",
			swift: "func signInWithDemo() async throws",
		},
		summary: "Sign in to a throwaway demo sandbox",
		description:
			"A development shortcut: signs in to a disposable sandbox account — no credentials, no sign-up, nothing to configure — so you can click through your app before your own sign-in exists. It isn't meant for your users, so don't ship it in a release build. It comes with profiles and viewing history already populated, so pages and rows have something to recommend from the first call. Everything afterwards is the ordinary flow, so code written against a sandbox works unchanged against a real account. A sandbox lasts 30 minutes and is then deleted, so treat the data as disposable. You can start five an hour from one network address, shared with the web sign-in screen's demo button and a TV's device-code demo, so keep the one you have rather than starting a new one per run. When the sandbox ends the client signs out with the reason demo-ended; it does not start another by itself. Construct the client with demoMode and the first sandbox is started automatically on first use.",
		params: [],
		returns: {
			type: "SignInResult | void",
			description:
				"TypeScript returns the sandbox's refreshToken, publicId, and expiresAt, used exactly like a real sign-in's. Kotlin and Swift return nothing — the SDK stores the credential and you carry on.",
		},
		snippets: {
			typescript: `const client = new DiscovrClient("your-client-id");
await client.signInWithDemo();

const { profiles } = await client.getProfiles();
await client.selectProfile(profiles[0].id);

const page = await client.createPage();`,
			kotlin: `val client = DiscovrClient("your-client-id", storage = prefs)
client.signInWithDemo()

val profiles = client.getProfiles().profiles
client.selectProfile(profiles.first().id)

val page = client.createPage()`,
			swift: `let client = await DiscovrClient(clientId: "your-client-id")
try await client.signInWithDemo()

let profiles = try await client.getProfiles().profiles
try await client.selectProfile(profileId: profiles[0].id)

let page = try await client.createPage()`,
		},
	},
	{
		id: "signInWithPopup",
		authCategory: "sign-in-flows",
		signature: {
			typescript: "signInWithPopup(): Promise<SignInResult>",
			kotlin: null,
			swift: null,
		},
		summary: "Sign in with a popup window (web only)",
		description:
			"Opens a sign-in popup in the browser. The user signs in there and your app is signed in when the popup closes, without your page navigating away. It is the authorization code flow with PKCE, so no credential passes through the popup: the SDK redeems a one-time code itself. Rejects with AuthCancelledError if the user closes the window or presses Cancel. Browser-only — on Android use signInWithWebAuth(), and on iOS use signInWithWebAuth(), which presents the same flow natively.",
		params: [],
		returns: {
			type: "SignInResult",
			description:
				"An object containing refreshToken, publicId, and expiresAt (90-day expiry timestamp).",
		},
		snippets: {
			typescript: `const client = new DiscovrClient("your-client-id");
const result = await client.signInWithPopup();
console.log("Signed in, refresh token:", result.refreshToken);`,
			kotlin: null,
			swift: null,
		},
	},
	{
		id: "signInWithWebAuth",
		authCategory: "sign-in-flows",
		signature: {
			typescript: "signInWithWebAuth(redirectURL: string): Promise<void>",
			kotlin: "fun signInWithWebAuth(redirectUri: String, launchUrl: (String) -> Unit)",
			swift:
				"func signInWithWebAuth(redirectUri: String, presentationAnchor: ASPresentationAnchor) async throws",
		},
		summary: "Sign in with a redirect flow (web and mobile)",
		description:
			"Redirects the current page to the authentication server. The user signs in and is redirected back to your callback URL with a one-time code (authorization code flow with PKCE). Call handleRedirectResult() on the return page to redeem it and complete sign-in.",
		params: [
			{
				name: "redirectURL",
				type: "string",
				required: true,
				description:
					"A callback URL registered for this client ID in the Discovr dashboard. Must be an exact match (query strings are ignored, trailing slashes are not significant). Use an `https://` URL for web apps, a reverse-DNS scheme you own for native apps (`com.example.app://auth/callback` — a dot is required, and no website is needed), or `http://127.0.0.1/callback` for desktop apps, where the port is matched as a wildcard.",
			},
		],
		returns: {
			type: "void",
			description:
				"This method navigates away (redirects the page). Call handleRedirectResult() on the return page.",
		},
		snippets: {
			typescript: `const client = new DiscovrClient("your-client-id");
await client.signInWithWebAuth(window.location.origin + "/auth-callback");
// Page redirects. On return page:
const result = await client.handleRedirectResult();
if (result) console.log("Signed in");`,
			kotlin: `val client = DiscovrClient("your-client-id", storage = prefs)
client.signInWithWebAuth("com.example.app://auth/callback") { url ->
    // Launch the URL via CustomTabsIntent or Intent.ACTION_VIEW
    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
}`,
			swift: `let client = await DiscovrClient(clientId: "your-client-id")
try await client.signInWithWebAuth(
    redirectUri: "com.example.app://auth/callback",
    presentationAnchor: window
)`,
		},
	},
	{
		id: "signInWithDeviceCode",
		authCategory: "sign-in-flows",
		signature: {
			typescript: "signInWithDeviceCode(options?: { qrSize?: number }): Promise<DeviceCodeResult>",
			kotlin: "suspend fun signInWithDeviceCode(qrSize: Int? = null): DeviceCodeResult",
			swift: "func signInWithDeviceCode(qrSize: Int? = nil) async throws -> DeviceCodeResult",
		},
		summary: "Sign in using a device code (second-screen flow)",
		description:
			"Initiates a device-code sign-in flow. Returns a user code and QR code immediately. Display these to the user on the device. They scan the QR or enter the code on another device to authorize, or decline there. The SDK polls in the background, at the pace the server sets, and completes sign-in automatically. Await the result's completion to learn that the person declined or the code ran out.",
		params: [
			{
				name: "qrSize",
				type: "number",
				required: false,
				description:
					"QR code size in pixels, 100 to 1000 (default: 300). A TV screen wants 600 to 800. TypeScript takes this in an options object.",
			},
		],
		returns: {
			type: "DeviceCodeResult",
			description:
				"An object containing userCode (short code for display), qrCode (base64 data URL), verificationUrl (where to send someone who can't scan: they type the code there), deviceCode (internal; keep it on the device), expiresIn (milliseconds), completion (settles when the flow ends: normal on sign-in, DeviceCodeDeniedError, DeviceCodeExpiredError or AuthCancelledError otherwise), and unsubscribe / cancel (stops polling).",
		},
		snippets: {
			typescript: `const client = new DiscovrClient("your-client-id");
const { userCode, qrCode } = await client.signInWithDeviceCode();
console.log("Code:", userCode);
// Render qrCode in your UI

client.onAuthStateChanged(({ signedIn }) => {
  if (signedIn) {
    console.log("User authorized! Proceed with profile selection.");
  }
});`,
			kotlin: `val client = DiscovrClient("your-client-id", storage = prefs)
val code = client.signInWithDeviceCode()
println("Code: \${code.userCode}")
// Display code.qrCode

lifecycleScope.launch {
  client.authState.collect { state ->
    if (state.signedIn) {
      println("Authorized!")
    }
  }
}`,
			swift: `let client = await DiscovrClient(clientId: "your-client-id")
let code = try await client.signInWithDeviceCode()
print("Code: \\(code.userCode)")
// Render code.qrCode

for await state in await client.authStateStream {
  if state.signedIn {
    print("Authorized!")
    break
  }
}`,
		},
	},
	{
		id: "handleRedirectResult",
		authCategory: "sign-in-flows",
		signature: {
			typescript: "handleRedirectResult(): Promise<SignInResult | null>",
			kotlin: "suspend fun handleRedirectUri(uri: String): Boolean",
			swift: null,
		},
		summary: "Complete a redirect flow sign-in",
		description:
			"Completes a sign-in started with signInWithWebAuth(). Call it on the page or deep-link handler the user lands on: it redeems the one-time authorization code in the URL for the refresh token (using the PKCE verifier the SDK kept), stores it, and removes the parameters from the address bar. It claims only a return whose state is the one this SDK stored, so another provider's callback, or a link someone crafted, is left alone and reported as not a sign-in return. Throws AuthCancelledError if the user cancelled. Swift needs no equivalent — its signInWithWebAuth() presents the flow natively and returns only once sign-in has finished.",
		params: [],
		returns: {
			type: "SignInResult | null",
			description:
				"An object with refreshToken, publicId, and expiresAt if successful. null if this page load is not a sign-in return.",
		},
		snippets: {
			typescript: `// On your callback page after redirect:
const client = new DiscovrClient("your-client-id");
const result = await client.handleRedirectResult();
if (result) {
  console.log("Signed in!");
  // Proceed to profile selection
} else {
  console.log("Not a sign-in return");
}`,
			kotlin: `// In your deep-link handler:
val client = DiscovrClient("your-client-id", storage = prefs)
val success = client.handleRedirectUri(intent.data.toString())
if (success) {
  println("Signed in!")
} else {
  println("Not a sign-in return")
}`,
			swift: null,
		},
	},
	{
		id: "selectProfile",
		authCategory: "profile-management",
		signature: {
			typescript: "selectProfile(profileId: string): Promise<void>",
			kotlin: "suspend fun selectProfile(profileId: String)",
			swift: "func selectProfile(profileId: String) async throws",
		},
		summary: "Choose which profile is browsing",
		description:
			"Activates a profile, so everything you fetch afterwards is that viewer's — their recommendations, their watchlist, their playback progress. Call it once after sign-in, before createPage() or any other profile-scoped method. The SDK handles the credential this needs and renews it for you.",
		params: [
			{
				name: "profileId",
				type: "string",
				required: true,
				description: "The ID of the profile to select. Obtain from getProfiles().",
			},
		],
		returns: {
			type: "void",
			description: "Nothing. Once it resolves, the profile is active and you can start fetching.",
		},
		snippets: {
			typescript: `const { profiles } = await client.getProfiles();
await client.selectProfile(profiles[0].id);
// Ready to call session-tier API methods
const page = await client.createPage();`,
			kotlin: `val profiles = client.getProfiles().profiles
client.selectProfile(profiles.first().id)
// Ready
val page = client.createPage()`,
			swift: `let res = try await client.getProfiles()
try await client.selectProfile(profileId: res.profiles[0].id)
let page = try await client.createPage()`,
		},
	},
	{
		id: "switchProfile",
		authCategory: "profile-management",
		signature: {
			typescript: "switchProfile(profileId: string): Promise<void>",
			kotlin: "suspend fun switchProfile(profileId: String)",
			swift: "func switchProfile(profileId: String) async throws",
		},
		summary: "Switch to a different profile",
		description:
			"Changes which viewer is browsing. The new profile starts with its own fresh recommendations — the previous viewer's would be the wrong ones to carry over — and cached responses are dropped for you. Page IDs are unaffected, because they don't belong to a profile. Behaves the same as selectProfile(); use whichever name reads better at the call site.",
		params: [
			{
				name: "profileId",
				type: "string",
				required: true,
				description: "The ID of the profile to switch to.",
			},
		],
		returns: {
			type: "void",
			description:
				"Nothing. Once it resolves, the new profile is active with fresh recommendations.",
		},
		snippets: {
			typescript: `// Already on profileA
await client.switchProfile(profileB.id); // Switch to profileB
// Existing page data is now stale — rebuild your UI
const newPage = await client.createPage();`,
			kotlin: `// Switch profiles
client.switchProfile(anotherProfileId)
// New session started`,
			swift: `try await client.switchProfile(profileId: otherId)
// New session started`,
		},
	},
	{
		id: "signOut",
		authCategory: "state-and-session",
		signature: {
			typescript: "signOut(): Promise<void>",
			kotlin: "suspend fun signOut()",
			swift: "func signOut() async",
		},
		summary: "Sign out the current device",
		description:
			"Signs the user out on this device and clears the credentials stored here. Other devices they're signed in on aren't affected. Your onAuthStateChanged handler fires with signedIn false, so a single subscription is enough to send the app back to its sign-in screen. There is no profile-level sign-out — to leave a profile without signing out, switchProfile() to another one. This wraps the signOutSession endpoint; call the endpoint directly only if you aren't using an SDK.",
		params: [],
		returns: {
			type: "void",
			description: "Refresh token revoked, local storage cleared.",
		},
		snippets: {
			typescript: `await client.signOut();
console.log("Signed out");
// Show login screen`,
			kotlin: `client.signOut()
println("Signed out")`,
			swift: `await client.signOut()
print("Signed out")`,
		},
	},
	{
		id: "onAuthStateChanged",
		authCategory: "state-and-session",
		signature: {
			typescript:
				"onAuthStateChanged(cb: (state: { signedIn: boolean; profileId: string | null; signOutReason: SignOutReason | null }) => void): Unsubscribe",
			kotlin: "val authState: StateFlow<AuthState>  // collect to subscribe",
			swift: "var authStateStream: AsyncStream<AuthState>  // iterate to subscribe",
		},
		summary: "Subscribe to auth state changes",
		description:
			"Subscribes to authentication state changes (sign-in, profile switch, sign-out). Fires immediately with current state, then again on every change. Use this to update your UI's logged-in state and profile display. When signedIn is false, signOutReason says why: user (you called signOut), session-expired (the account's sign-in lapsed or was revoked), or demo-ended (a demoMode sandbox ran out, which only happens while developing); it is null on a fresh start with no credential. A lapsed credential is noticed on the next call that needs it, so a sign-out can arrive in the middle of a session.",
		params: [
			{
				name: "cb (TypeScript)",
				type: "callback",
				required: true,
				description:
					"Function called with { signedIn, profileId, signOutReason } whenever auth state changes.",
			},
		],
		returns: {
			type: "Unsubscribe",
			description:
				"Function to call when you're done listening. (TS only; Kotlin/Swift use Flow/AsyncStream lifecycle.)",
		},
		snippets: {
			typescript: `const unsubscribe = client.onAuthStateChanged(({ signedIn, profileId }) => {
  if (signedIn) {
    console.log("Signed in, profile:", profileId);
  } else {
    console.log("Signed out — show login screen");
  }
});
// Cleanup: unsubscribe();`,
			kotlin: `lifecycleScope.launch {
  client.authState.collect { state ->
    if (state.signedIn) {
      println("Signed in: \${state.profileId}")
    } else {
      println("Signed out")
    }
  }
}`,
			swift: `Task {
  for await state in await client.authStateStream {
    if state.signedIn {
      print("Signed in: \\(state.profileId ?? "none")")
    } else {
      print("Signed out")
    }
  }
}`,
		},
	},
	{
		id: "onSessionRefreshed",
		authCategory: "state-and-session",
		signature: {
			typescript:
				"onSessionRefreshed(cb: (state: { profileId: string | null; expiresAt: number | null; snapshotId: string | null }) => void): Unsubscribe",
			kotlin: "val sessionState: StateFlow<SessionState>  // collect to subscribe",
			swift: "var sessionStateStream: AsyncStream<SessionState>  // iterate to subscribe",
		},
		summary: "Subscribe to session credential changes",
		description:
			"Subscribes to session credential changes. Fires whenever a new session starts — on selectProfile(), on a profile switch, and when the SDK renews an expiring session on your next call. Nearly all of these are routine renewals that change nothing the user can see, so this is for tracking credential state, not content: expiresAt tells you when the current session runs out. To learn when the user's recommendations actually turn over, use onRecommendationsChanged() instead.",
		params: [
			{
				name: "cb (TypeScript)",
				type: "callback",
				required: true,
				description:
					"Function called with { profileId, expiresAt, snapshotId } when a new session is minted.",
			},
		],
		returns: {
			type: "Unsubscribe",
			description:
				"Unsubscribe function (TS only; Kotlin/Swift use Flow/AsyncStream lifecycle). expiresAt is Unix seconds.",
		},
		snippets: {
			typescript: `client.onSessionRefreshed(({ profileId, expiresAt }) => {
  if (!profileId || !expiresAt) return; // signed out
  showSessionIndicator(new Date(expiresAt * 1000));
});`,
			kotlin: `lifecycleScope.launch {
  client.sessionState.collect { session ->
    val expiresAt = session.expiresAt ?: return@collect
    showSessionIndicator(expiresAt)
  }
}`,
			swift: `Task {
  for await session in await client.sessionStateStream {
    guard let expiresAt = session.expiresAt else { continue }
    await showSessionIndicator(Date(timeIntervalSince1970: TimeInterval(expiresAt)))
  }
}`,
		},
	},
	{
		id: "onRecommendationsChanged",
		authCategory: "state-and-session",
		signature: {
			typescript: "onRecommendationsChanged(cb: () => void): Unsubscribe",
			kotlin: "val recommendationChanges: SharedFlow<Unit>  // collect to subscribe",
			swift: "var recommendationChangeStream: AsyncStream<Void>  // iterate to subscribe",
		},
		summary: "Subscribe to recommendation turnovers",
		description:
			"Fires when the user's recommendations actually move, roughly every 30 minutes. Routine credential renewals don't fire it, so every call here means the rows behind your page IDs changed. Page IDs don't change, so refetch the page you're showing (getPage + getRows) rather than recreating it. Don't swap the rows out the instant it fires, though — a reader mid-scroll doesn't want the screen to jump. Flag the page stale and reload it on the user's next navigation. Stop requesting more rows with a token from before the turnover: getRows refuses it with 409 CURSOR_EXPIRED. Row items you already hold keep paging. Unlike onSessionRefreshed() this doesn't fire on subscribe: it reports an event, not a state, so a new subscriber won't immediately refetch data it just loaded.",
		params: [
			{
				name: "cb (TypeScript)",
				type: "callback",
				required: true,
				description: "Function called with no arguments each time the recommendations turn over.",
			},
		],
		returns: {
			type: "Unsubscribe",
			description: "Unsubscribe function (TS only; Kotlin/Swift use Flow/AsyncStream lifecycle).",
		},
		snippets: {
			typescript: `client.onRecommendationsChanged(() => {
  // Same page ID — only the rows behind it moved. Flag it; reload the page
  // the next time the user navigates, not mid-scroll.
  markRecommendationsStale();
});`,
			kotlin: `lifecycleScope.launch {
  client.recommendationChanges.collect {
    markRecommendationsStale()
  }
}`,
			swift: `Task {
  for await _ in await client.recommendationChangeStream {
    markRecommendationsStale()
  }
}`,
		},
	},
	{
		id: "isSignedIn",
		authCategory: "state-and-session",
		signature: {
			typescript: "isSignedIn(): boolean",
			kotlin: "val isSignedIn: Boolean",
			swift: "var isSignedIn: Bool { get async }",
		},
		summary: "Check if a refresh token is held",
		description: "Synchronous check whether the SDK has a valid refresh token (user is signed in).",
		params: [],
		returns: {
			type: "boolean / Bool",
			description: "true if signed in; false otherwise.",
		},
		snippets: {
			typescript: `if (client.isSignedIn()) {
  console.log("Signed in");
} else {
  console.log("Not signed in");
}`,
			kotlin: `if (client.isSignedIn) {
  println("Signed in")
}`,
			swift: `let signedIn = await client.isSignedIn
print(signedIn ? "Signed in" : "Not signed in")`,
		},
	},
	{
		id: "hasActiveProfile",
		authCategory: "state-and-session",
		signature: {
			typescript: "hasActiveProfile(): boolean",
			kotlin: "val hasActiveProfile: Boolean",
			swift: "var hasActiveProfile: Bool { get async }",
		},
		summary: "Check if a profile is selected and session is ready",
		description:
			"true if a profile has been selected and a live session token is held (ready to call API methods). After a relaunch it is false until the first request renews the session, and with the default of not remembering the profile (rememberProfile: false) the profile is gone altogether until the user picks again, so to route a launch use onAuthStateChanged and its profileId.",
		params: [],
		returns: {
			type: "boolean / Bool",
			description: "true if a profile is active and session is ready.",
		},
		snippets: {
			typescript: `if (client.hasActiveProfile()) {
  const page = await client.createPage();
} else {
  console.log("Select a profile first");
}`,
			kotlin: `if (client.hasActiveProfile) {
  val page = client.createPage()
}`,
			swift: `if await client.hasActiveProfile {
  let page = try await client.createPage()
}`,
		},
	},
	{
		id: "getActiveProfileId",
		authCategory: "state-and-session",
		signature: {
			typescript: "getActiveProfileId(): string | null",
			kotlin: "fun getActiveProfileId(): String?",
			swift: "func getActiveProfileId() async -> String?",
		},
		summary: "Get the currently selected profile ID",
		description:
			"Returns the ID of the currently selected profile, or null if no profile is active.",
		params: [],
		returns: {
			type: "string | null / String? / String?",
			description: "The active profile ID, or null if none.",
		},
		snippets: {
			typescript: `const profileId = client.getActiveProfileId();
console.log("Active profile:", profileId);`,
			kotlin: `val profileId = client.getActiveProfileId()
println("Active: $profileId")`,
			swift: `let profileId = await client.getActiveProfileId()
print("Active: \\(profileId ?? "none")")`,
		},
	},
	{
		id: "clearCache",
		authCategory: "state-and-session",
		signature: {
			typescript: "clearCache(): void",
			kotlin: "suspend fun clearCache()",
			swift: "func clearCache() async",
		},
		summary: "Drop the SDK's cached responses",
		description:
			"Empties the SDK's response cache, so the next pages, rows, profiles, media or search call goes to the network. You rarely need this: the cache already clears itself on a profile switch, on sign-out, and whenever recommendations turn over. Reach for it when something outside the SDK changed data you've already fetched, or to force a hard refresh from a pull-to-refresh gesture.",
		params: [],
		returns: {
			type: "void",
			description: "Nothing. The next cacheable call refetches.",
		},
		snippets: {
			typescript: `client.clearCache();
const fresh = await client.getRows(pageId);`,
			kotlin: `client.clearCache()
val fresh = client.getRows(pageId)`,
			swift: `await client.clearCache()
let fresh = try await client.getRows(pageId: pageId)`,
		},
	},
	{
		id: "close",
		authCategory: "state-and-session",
		signature: {
			typescript: "close(): void",
			kotlin: "fun close()",
			swift: null,
		},
		summary: "Release the client when you're done with it",
		description:
			"Releases everything the client is holding and stops its background work. Call it whenever a client is discarded rather than kept for the lifetime of the app — a component unmount, a ViewModel being cleared, a test teardown. Skipping it leaks a listener per instance, which adds up fast in a hot-reloading dev server or a re-mounting test. A long-lived singleton never needs it. After close(), don't reuse the client. Swift has no equivalent: its client releases in deinit.",
		params: [],
		returns: {
			type: "void",
			description: "Nothing. The client must not be used again afterwards.",
		},
		snippets: {
			typescript: `useEffect(() => {
  const client = new DiscovrClient("your-client-id");
  return () => client.close();
}, []);`,
			kotlin: `override fun onCleared() {
    client.close()
    super.onCleared()
}`,
			swift: null,
		},
	},
];
