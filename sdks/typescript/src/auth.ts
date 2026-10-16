/**
 * `_DiscovrAuth` — internal auth helper for the Discovr API.
 *
 * Two tokens, two jobs:
 *
 * - **Refresh token** (long-lived, 90 d). Doubles as the *identity credential*:
 *   used directly as the bearer for identity-tier endpoints
 *   (`GET /profiles`, `POST /auth/session-token`, `DELETE /auth/session`) and
 *   to mint session tokens.
 * - **Session token** (short-lived, 30 min). Used for
 *   session-tier endpoints — pages, rows, items, profile-scoped data
 *   (`/profile/*`).
 *
 * Lifecycle:
 *   1. `signInWithPopup` / `signInWithWebAuth` / `signInWithDeviceCode` →
 *      stores the refresh token.
 *   2. `selectProfile(profileId)` → exchanges refresh token for a session token;
 *      sets the active profile.
 *   3. `sessionApi()` / `identityApi()` pick the bearer per endpoint and renew
 *      the session token on demand. A renewal carries the user's current
 *      recommendation snapshot forward, so it changes nothing they can see.
 *   4. `signOut()` → revokes the refresh token server-side and clears local
 *      storage.
 *
 * Do not import this class directly — use [`DiscovrClient`](./DiscovrClient.ts).
 */

import { Configuration } from "./runtime";
import { DiscovrApi } from "./apis/DiscovrApi";
import {
	AuthCancelledError,
	AuthTimeoutError,
	DeviceCodeConsumedError,
	DeviceCodeDeniedError,
	DeviceCodeExpiredError,
	DiscovrError,
	apiErrorFor,
	mapApiErrorCode,
	NoProfileSelectedError,
	NotSignedInError,
	RateLimitedError,
	TokenInvalidError,
} from "./errors";
import { _RequestLoopGuard, type LoopGuardConfig } from "./_RequestLoopGuard";

export interface AuthConfig {
	/** Base URL for the API. Defaults to https://api.discovr.media. */
	basePath?: string;
	/** Storage key prefix for persisted tokens. Defaults to "discovr_". */
	storagePrefix?: string;
	/** Enable verbose console logging. */
	debug?: boolean;
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
	demoMode?: boolean;
	/**
	 * Only meaningful with `demoMode: true`. Overrides how long each session
	 * token minted for the sandbox lives (default 15 minutes — shorter than the
	 * standard 30-minute default everyone else gets, since a demo sandbox is
	 * inherently short-lived anyway). Set this to something small (e.g. two
	 * minutes) to repeatedly exercise your app's silent session-refresh path on
	 * demand, instead of waiting out the real interval. The server clamps this
	 * — it can only ever be shorter than the standard default, never longer.
	 */
	demoSessionTtlMs?: number;
	/**
	 * Only meaningful with `demoMode: true`. Overrides how long the sandbox
	 * itself (and its refresh token) lives — default 30 minutes, unchanged
	 * unless set. Shortening this makes the *whole sandbox* expire quickly
	 * (triggering `demo-ended`, not just a silent refresh) — the server clamps
	 * this the same way, shorter only.
	 */
	demoRefreshTtlMs?: number;
	/**
	 * Tune or disable the client-side runaway-loop breaker.
	 * See {@link LoopGuardConfig}. Enabled by default.
	 */
	loopGuard?: LoopGuardConfig;
	/**
	 * Remember which profile was selected between launches. Defaults to
	 * `false`, like a streaming app: after a relaunch the user is still signed
	 * in but has to pick who's watching again, so `onAuthStateChanged` reports
	 * `signedIn: true` with a `profileId` of `null`. Set it to `true` to resume
	 * on the profile they last used.
	 */
	rememberProfile?: boolean;
}

/** `/auth/device-codes`, with the QR size when one was asked for (the server accepts 100-1000). */
export function deviceCodePath(qrSize?: number): string {
	if (qrSize === undefined || !Number.isFinite(qrSize)) return "/auth/device-codes";
	return `/auth/device-codes?size=${Math.min(1000, Math.max(100, Math.round(qrSize)))}`;
}

/**
 * How often to poll, and how long to wait, are not options: the server sets
 * the pace (and slows it as a code ages) and the code's own lifetime is the
 * timeout.
 */
/** What a device waits when the server did not say (it always does; this is a safe pace, not a contract). */
const DEFAULT_DEVICE_POLL_INTERVAL_MS = 5000;
/** The code's lifetime when the server did not report one. */
const DEFAULT_DEVICE_CODE_LIFETIME_MS = 10 * 60 * 1000;

function secondsToMs(seconds: unknown): number {
	const n = Number(seconds);
	return Number.isFinite(n) && n > 0 ? n * 1000 : DEFAULT_DEVICE_POLL_INTERVAL_MS;
}

export interface DeviceCodeOptions {
	/** QR code size in pixels, 100-1000 (default 300). A TV screen wants 600-800. */
	qrSize?: number;
}

export interface DeviceCodeResult {
	deviceCode: string;
	userCode: string;
	/** The QR code as a PNG data URL, ready to use as an image source. */
	qrCode: string;
	/** Where to send someone who can't scan: they type `userCode` on this page. Show it on screen. */
	verificationUrl: string;
	/** How long the code is valid, in milliseconds. */
	expiresIn: number;
	/**
	 * Settles when the flow ends: resolves with the sign-in once the person
	 * approves, and rejects with a typed error if they decline
	 * ({@link DeviceCodeDeniedError}), the code lapses
	 * ({@link DeviceCodeExpiredError}), or you stop it with `unsubscribe()`
	 * ({@link AuthCancelledError}). Awaiting it is optional: an ignored rejection
	 * does not surface as an unhandled one, and `onAuthStateChanged` still fires on
	 * success.
	 */
	completion: Promise<SignInResult>;
	/** Stop background polling immediately. Safe to call multiple times. */
	unsubscribe: () => void;
}

export interface SignInResult {
	refreshToken: string;
	publicId: string;
	expiresAt: number;
}

/**
 * Why the client is signed out, when it did not happen because the app asked.
 *
 * - `"user"` — {@link _DiscovrAuth.signOut} was called.
 * - `"session-expired"` — the long-lived credential was rejected (it lapsed or
 *   was revoked), so the user has to sign in again.
 * - `"demo-ended"` — the same, for a demo sandbox, which always lapses. Worth
 *   telling apart because the right response is different: offer another demo
 *   or a real sign-in, not "your session has expired".
 */
export type SignOutReason = "user" | "session-expired" | "demo-ended";

export interface AuthState {
	signedIn: boolean;
	profileId: string | null;
	/**
	 * Set only while `signedIn` is false and the client was signed out during
	 * this run; `null` when signed in, and on a fresh start with no credential.
	 */
	signOutReason: SignOutReason | null;
}

export type AuthStateCallback = (state: AuthState) => void;
export interface SessionState {
	profileId: string | null;
	expiresAt: number | null;
	/**
	 * Identifies the recommendations the user is currently browsing. Changes
	 * when they turn over (roughly every 30 minutes) — and *only* then, so a routine credential renewal doesn't look
	 * like new content.
	 */
	snapshotId: string | null;
}
export type SessionStateCallback = (state: SessionState) => void;
export type Unsubscribe = () => void;

interface SessionTokenResponse {
	sessionToken: string;
	snapshotId: string;
	expiresAt: number;
}

const REFRESH_TOKEN_PREFIX = "rt_";

/** Default back-off when a 429 arrives without a usable hint. Limits are per-minute. */
const DEFAULT_RETRY_AFTER_SECONDS = 60;

/**
 * Ceiling on any `Retry-After` we will honour.
 *
 * The value arrives over the network, so it is untrusted input to whatever the
 * app does with it: apps surface it to users and schedule back-offs on it. A
 * limit window is a minute, so anything past a few of them is a bug or an
 * attack, and either way "try again in 31 years" is not a thing to render.
 */
const MAX_RETRY_AFTER_SECONDS = 300;

/**
 * Seconds to wait before retrying a rate-limited request: the `Retry-After`
 * header, else the `retryAfterSeconds` field of the response body (the two
 * carry the same number). Discovr's own limiters always send both; the
 * fallback to a minute only applies to a 429 from something in front of
 * Discovr that sends neither.
 */
function retryAfterSeconds(response: Response, bodyText?: string): number {
	// Digits only, matching Kotlin's `toIntOrNull` and Swift's `Int(_:)`. Neither
	// `Number` nor `parseInt` is safe here: `Number("1e9")` is finite and positive
	// (a ~31-year wait), and `parseInt("1e9", 10)` silently yields 1 — an instant
	// retry into a window that is still closed.
	const usable = (raw: string): number | undefined => {
		if (!/^\d+$/.test(raw)) return undefined;
		const seconds = Number(raw);
		return seconds > 0 ? Math.min(seconds, MAX_RETRY_AFTER_SECONDS) : undefined;
	};
	const fromHeader = usable(response.headers?.get?.("Retry-After")?.trim() ?? "");
	if (fromHeader !== undefined) return fromHeader;
	if (bodyText) {
		try {
			const parsed = JSON.parse(bodyText) as { retryAfterSeconds?: unknown };
			if (typeof parsed.retryAfterSeconds === "number") {
				const fromBody = usable(String(parsed.retryAfterSeconds));
				if (fromBody !== undefined) return fromBody;
			}
		} catch {
			// No usable body; fall through to the default.
		}
	}
	return DEFAULT_RETRY_AFTER_SECONDS;
}

/** Everything persisted between page loads, written and read as one value. */
type PersistedSession = {
	refreshToken: string | null;
	sessionToken: string | null;
	sessionExpiresAt: number | null;
	activeProfileId: string | null;
	snapshotId: string | null;
	/** True when the credential belongs to a demo sandbox, so a lapse can say so. */
	demo: boolean;
};

/**
 * Re-mint a session token this many ms before it actually expires. A session
 * within this window is treated as "not live" so callers refresh proactively
 * rather than firing a request that races the expiry.
 */
const SESSION_REFRESH_BUFFER_MS = 60_000;

/** A stalled connection (dead network, unresponsive server) fails instead of hanging forever. */
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * Default session-token TTL for demo-mode clients only — shorter than the
 * standard 30-minute default, since a demo sandbox is inherently short-lived.
 * Not used for non-demo clients, which get the server's own default.
 */
const DEFAULT_DEMO_SESSION_TTL_MS = 15 * 60 * 1000;

/**
 * The new auth model emits structured error codes. The SDK keys recovery
 * decisions off these codes — opaque error messages from the legacy stack are
 * intentionally unsupported.
 */
type ApiErrorCode = "TOKEN_INVALID" | "TOKEN_EXPIRED" | "WRONG_TOKEN_KIND";

interface ApiErrorBody {
	error?: ApiErrorCode | string;
	tokenKind?: "session" | "refresh";
}

export class _DiscovrAuth {
	private readonly clientID: string;
	private readonly basePath: string;
	private readonly storagePrefix: string;
	/** The result of this page load's redirect return, once handled. */
	private redirectReturn: Promise<SignInResult | null> | null = null;
	private readonly debug: boolean;
	private readonly demoMode: boolean;
	private readonly demoSessionTtlMs: number;
	private readonly demoRefreshTtlMs: number | undefined;
	private readonly rememberProfile: boolean;
	private readonly loopGuard: _RequestLoopGuard;
	/** De-dupes concurrent demo sign-ins so a burst of calls provisions one sandbox, not N. */
	private demoSignInInFlight: Promise<SignInResult> | null = null;

	private refreshToken: string | null = null;
	private sessionToken: string | null = null;
	private snapshotId: string | null = null;
	private sessionExpiresAt: number | null = null;
	private activeProfileId: string | null = null;
	/** The credential belongs to a demo sandbox (signed in via {@link signInWithDemo}, or restored as such). */
	private demoSession = false;
	private signOutReason: SignOutReason | null = null;
	/**
	 * Set once the client has been signed out, for any reason. A demo-mode client
	 * provisions a sandbox the first time it needs a credential, but not again
	 * after losing one: silently starting another sandbox hides the lapse from the
	 * app and spends one of the caller's five demos an hour. Cleared by an
	 * explicit sign-in.
	 */
	private demoProvisioningSuspended = false;

	private readonly listeners: AuthStateCallback[] = [];
	private readonly sessionListeners: SessionStateCallback[] = [];
	private readonly snapshotListeners: Array<(changed: boolean) => void> = [];
	private storageListener?: (event: StorageEvent) => void;
	private mintInFlight: Promise<string> | null = null;
	private activeDeviceCodePoll: (() => void) | null = null;

	constructor(clientID: string, config: AuthConfig = {}) {
		this.clientID = clientID;
		this.basePath = config.basePath ?? "https://api.discovr.media";
		this.storagePrefix = config.storagePrefix ?? "discovr_";
		this.debug = config.debug ?? false;
		this.demoMode = config.demoMode ?? false;
		this.demoSessionTtlMs = config.demoSessionTtlMs ?? DEFAULT_DEMO_SESSION_TTL_MS;
		this.demoRefreshTtlMs = config.demoRefreshTtlMs;
		this.rememberProfile = config.rememberProfile ?? false;
		this.loopGuard = new _RequestLoopGuard(config.loopGuard);
		this.restore();
		this.watchStorage();
	}

	// ── Public surface ──────────────────────────────────────────────────

	/**
	 * Configured `DiscovrApi` instance for **session-tier** endpoints
	 * (`/pages/*`, `/profile/*`). Throws if no profile has been selected yet —
	 * call {@link selectProfile} first.
	 */
	public sessionApi(): DiscovrApi {
		const config = new Configuration({
			basePath: this.basePath,
			accessToken: () => this.ensureSessionToken(),
			middleware: [
				{
					pre: async (context) => {
						this.loopGuard.check(`${context.init.method ?? "GET"} ${context.url}`);
					},
					post: async (context) => {
						return await this.handleSessionResponse(context);
					},
				},
			],
		});
		return new DiscovrApi(config);
	}

	/**
	 * Configured `DiscovrApi` instance for **identity-tier** endpoints
	 * (`/profiles`, `/auth/sessions`).
	 */
	public identityApi(): DiscovrApi {
		const config = new Configuration({
			basePath: this.basePath,
			accessToken: () => this.requireRefreshToken(),
			middleware: [
				{
					pre: async (context) => this.guardRequest(context),
					post: async (context) => this.handleIdentityResponse(context),
				},
			],
		});
		return new DiscovrApi(config);
	}

	/**
	 * Unauthenticated `DiscovrApi` instance for **public** endpoints
	 * that require no bearer token (e.g. `/profile-images`, `/gif-search`).
	 */
	public publicApi(): DiscovrApi {
		const config = new Configuration({
			basePath: this.basePath,
			middleware: [{ pre: async (context) => this.guardRequest(context) }],
		});
		return new DiscovrApi(config);
	}

	/** Loop-guard check for generated-API requests. Throws before dispatch. */
	private guardRequest(context: { url: string; init: RequestInit }): void {
		this.loopGuard.check(`${context.init.method ?? "GET"} ${context.url}`);
	}

	/**
	 * Select a profile. Mints a fresh session token bound to it. Calling this
	 * with the same profileId again is a valid way to roll the session
	 * (e.g. to start a new recommendation snapshot).
	 */
	public async selectProfile(profileId: string): Promise<void> {
		// Resolves the credential (provisioning a demo sandbox first if the client
		// is in demo mode and has none), so this works identically either way.
		await this.requireRefreshToken();
		const minted = await this.mintSessionToken(profileId);
		this.activeProfileId = profileId;
		this.setSessionToken(minted.sessionToken, minted.expiresAt, minted.snapshotId);
		this.persist();
		this.emit();
	}

	/**
	 * Switch to a different profile. Same as {@link selectProfile} — the
	 * underlying mint endpoint handles select / switch / refresh uniformly.
	 */
	public switchProfile(profileId: string): Promise<void> {
		return this.selectProfile(profileId);
	}

	/** True if a refresh token is held (regardless of profile selection). */
	public isSignedIn(): boolean {
		return this.refreshToken !== null;
	}

	/**
	 * True if a profile is selected and a **live** session token is held — i.e. a
	 * session token exists and is not within {@link SESSION_REFRESH_BUFFER_MS} of
	 * expiry. A restored-but-expired session (see {@link restore}) returns false,
	 * so callers know they must mint before relying on the session.
	 */
	public hasActiveProfile(): boolean {
		return this.activeProfileId !== null && this.hasFreshSessionToken();
	}

	/**
	 * Whether the in-memory session token is present and still comfortably valid
	 * (more than {@link SESSION_REFRESH_BUFFER_MS} from expiry). Shared by
	 * {@link hasActiveProfile} and {@link ensureSessionToken} so both agree on
	 * what "live" means.
	 */
	private hasFreshSessionToken(): boolean {
		return (
			this.sessionToken !== null &&
			this.sessionExpiresAt !== null &&
			this.sessionExpiresAt * 1000 - Date.now() > SESSION_REFRESH_BUFFER_MS
		);
	}

	public getActiveProfileId(): string | null {
		return this.activeProfileId;
	}

	/**
	 * Subscribe to auth-state changes. Fires immediately with the current
	 * state and again whenever sign-in/out or profile selection changes.
	 */
	public onAuthStateChanged(cb: AuthStateCallback): Unsubscribe {
		this.listeners.push(cb);
		cb(this.authState());
		return () => {
			const i = this.listeners.indexOf(cb);
			if (i >= 0) this.listeners.splice(i, 1);
		};
	}

	/**
	 * Subscribe to session changes. Fires immediately with the current state,
	 * then on every new session — the initial `selectProfile()`, a profile
	 * switch, and each automatic renewal.
	 *
	 * Watch `snapshotId` rather than the event itself to know when page data is
	 * stale. Most of these are routine credential renewals that leave the
	 * user's recommendations exactly where they were.
	 */
	public onSessionRefreshed(cb: SessionStateCallback): Unsubscribe {
		this.sessionListeners.push(cb);
		cb({
			profileId: this.activeProfileId,
			expiresAt: this.sessionExpiresAt,
			snapshotId: this.snapshotId,
		});
		return () => {
			const i = this.sessionListeners.indexOf(cb);
			if (i >= 0) this.sessionListeners.splice(i, 1);
		};
	}

	/**
	 * Subscribe to recommendation turnovers.
	 *
	 * Fires when the user's recommendations actually move, roughly every 30
	 * minutes as a snapshot ages out. Routine
	 * credential renewals don't fire it, so a call here always means the rows
	 * behind your page ids changed and it's worth fetching them again. Page ids
	 * themselves never change, so there's nothing to swap.
	 *
	 * Unlike {@link onSessionRefreshed}, this does *not* fire on subscribe: it
	 * reports an event rather than a state, and firing on subscribe would ask
	 * the app to refetch data it had only just loaded.
	 */
	public onRecommendationsChanged(cb: () => void): Unsubscribe {
		return this._onSnapshotChange((changed) => {
			if (changed) cb();
		});
	}

	/**
	 * Internal: fires on every session mint with whether the *snapshot* moved.
	 *
	 * `DiscovrClient` uses this to decide whether to drop its response cache.
	 * Keeping it separate from {@link onSessionRefreshed} is the point — the
	 * cache used to clear on every mint, which meant a routine credential
	 * renewal threw away perfectly good page data, and any call that triggered
	 * the renewal lost its own result to the generation check.
	 */
	public _onSnapshotChange(cb: (changed: boolean) => void): Unsubscribe {
		this.snapshotListeners.push(cb);
		return () => {
			const i = this.snapshotListeners.indexOf(cb);
			if (i >= 0) this.snapshotListeners.splice(i, 1);
		};
	}

	/**
	 * Revoke this device's refresh token server-side and clear local state.
	 * Best-effort — local state is always cleared even if the network call
	 * fails.
	 */
	public async signOut(): Promise<void> {
		await this.endSession("user");
	}

	/**
	 * What a lapsed credential is reported as: a demo sandbox always lapses, so
	 * it gets its own reason.
	 */
	private lapseReason(): SignOutReason {
		return this.demoMode || this.demoSession ? "demo-ended" : "session-expired";
	}

	/**
	 * The one place local auth state is torn down. {@link signOut} calls it for
	 * `"user"`; the recovery paths call it with the reason the credential was lost.
	 */
	private async endSession(reason: SignOutReason): Promise<void> {
		const refreshToken = this.refreshToken;
		this.refreshToken = null;
		this.sessionToken = null;
		this.sessionExpiresAt = null;
		this.activeProfileId = null;
		this.demoSession = false;
		this.signOutReason = reason;
		this.demoProvisioningSuspended = true;
		this.persist();
		this.emit();
		// `DiscovrClient` clears its response cache from `onSessionRefreshed`
		// (session-tier reads shouldn't survive a session boundary) and, for the
		// public signOut() call, also clears it synchronously beforehand as a
		// belt-and-suspenders measure. But `signOut()` is also called directly
		// from *this* class's own 401-recovery paths (handleSessionResponse,
		// fetch()) — those never go through DiscovrClient's wrapper, so without
		// this emit the cache would silently survive a forced sign-out and could
		// leak stale, session-scoped responses into whatever runs next.
		// profileId/expiresAt are both null at this point, same as a fresh
		// client that's never minted a session — a valid state to report.
		this.emitSession();

		if (!refreshToken) return;
		try {
			await this.fetch("DELETE", "/auth/session", null, refreshToken);
		} catch (e) {
			this.log("signOut: server-side revocation failed (local state already cleared):", e);
		}
	}

	// ── Sign-in flows ────────────────────────────────────────────────────

	/**
	 * Sign in with a popup window.
	 *
	 * This is the OAuth authorization code flow with PKCE. The popup is sent a
	 * random `state` and the SHA-256 of a random verifier that stays in this
	 * function; what comes back through `postMessage` is a single-use code that is
	 * worthless without that verifier, which is then redeemed over a direct request.
	 * The long-lived credential never passes through the popup, the opener's message
	 * queue or any URL.
	 *
	 * Rejects with {@link AuthCancelledError} when the person closes the window or
	 * presses Cancel, and with the matching typed error when sign-in fails.
	 */
	public async signInWithPopup(): Promise<SignInResult> {
		if (typeof window === "undefined") {
			throw new Error("signInWithPopup requires a browser environment.");
		}
		// Opened first, and before any `await`: a popup opened after one is no
		// longer inside the click that asked for it, and browsers block it. It is
		// pointed at the authorize URL once the PKCE pair exists.
		const popup = window.open("", "discovr-auth", "width=500,height=600");
		if (!popup) {
			throw new Error("Failed to open popup. Allow popups for this site.");
		}
		let pkce: PkcePair;
		try {
			pkce = await createPkcePair();
		} catch (error) {
			popup.close();
			throw error;
		}
		const state = generateState();
		// openerOrigin is passed along to Discovr's sign-in page so it can use it as
		// the postMessage targetOrigin rather than broadcasting to "*".
		popup.location.href = this.authorizeUrl(
			{ state, challenge: pkce.challenge },
			`&openerOrigin=${encodeURIComponent(window.location.origin)}`,
		);

		return new Promise((resolve, reject) => {
			// Declare cleanup first so handler can reference it without a forward-reference.
			const cleanup = () => {
				window.removeEventListener("message", handler);
				clearInterval(closeCheck);
				try {
					popup.close();
				} catch {
					/* ignore */
				}
			};

			const handler = (event: MessageEvent) => {
				// Only the window this call opened, whatever origin it has been sent to
				// since: it is redirected to Discovr's sign-in page, so the origin
				// cannot be checked against basePath. The unguessable `state` below is
				// the second lock, and the code is useless without the verifier anyway.
				if (event.source !== popup) return;
				const data = event.data as Record<string, unknown> | undefined;
				if (!data || data.state !== state) return;
				cleanup();
				if (typeof data.error === "string") {
					reject(mapApiErrorCode(data.error));
					return;
				}
				if (typeof data.code !== "string" || data.code === "") {
					reject(new DiscovrError("unknown-error", "Sign-in response missing code"));
					return;
				}
				this.redeemAuthCode(data.code, pkce.verifier).then(resolve, reject);
			};

			const closeCheck = setInterval(() => {
				if (popup.closed) {
					cleanup();
					reject(new AuthCancelledError());
				}
			}, 1000);

			window.addEventListener("message", handler);
		});
	}

	/**
	 * Sign in using a web redirect flow — constructs the authorize URL and
	 * navigates the current window to it. Call {@link handleRedirectResult} on
	 * the return page to complete sign-in.
	 *
	 * Async because the PKCE challenge is a hash; `await` it (or ignore the promise,
	 * the page is about to be replaced) before relying on the navigation.
	 */
	public async signInWithWebAuth(redirectURL: string): Promise<void> {
		if (typeof window === "undefined") {
			throw new Error("signInWithWebAuth requires a browser environment.");
		}
		const pkce = await createPkcePair();
		const state = generateState();
		// Survives the navigation away and back. The verifier is the secret, and
		// storing it here (same origin as the page that needs it) is the whole point
		// of PKCE for a flow that leaves the page: it is never in a URL.
		this.storeAuthRequest({ state, verifier: pkce.verifier });
		window.location.href = this.authorizeUrl(
			{ state, challenge: pkce.challenge },
			`&redirectURL=${encodeURIComponent(redirectURL)}`,
		);
	}

	/**
	 * Complete a redirect sign-in on the return page.
	 *
	 * Reads `code` and `state` (or `error`) from the URL, redeems the code with the
	 * verifier stored when the flow started, and removes the parameters from the
	 * address bar so a reload cannot try to use them again.
	 *
	 * It claims a page load only if the `state` in the URL is the one this SDK
	 * stored. A URL that merely looks like a return (another OAuth provider's
	 * callback sharing the route, or a link someone crafted) is none of its business:
	 * it returns `null` and touches neither the URL nor the stored request, so a
	 * forged link can neither break the other provider nor cancel a real sign-in.
	 * A matching state cannot be forged, so nothing else needs guarding.
	 *
	 * Calling it again on the same page load (StrictMode, hot reload) returns the
	 * first call's result instead of a spurious `null`.
	 *
	 * @returns the sign-in, or `null` if this page load is not this SDK's sign-in return.
	 * @throws {@link AuthCancelledError} if the person cancelled, and the matching
	 *   typed error for any other failure.
	 */
	public handleRedirectResult(): Promise<SignInResult | null> {
		if (this.redirectReturn) return this.redirectReturn;
		if (typeof window === "undefined" || typeof URLSearchParams === "undefined") {
			return Promise.resolve(null);
		}
		const params = new URLSearchParams(window.location.search);
		const code = params.get("code");
		const state = params.get("state");
		const error = params.get("error");
		if (!state || (!code && !error)) return Promise.resolve(null);

		const stored = this.peekAuthRequest();
		if (!stored || stored.state !== state) return Promise.resolve(null);
		// Ours: single-use from here, whatever happens next.
		this.forgetAuthRequest();
		this.clearAuthParamsFromUrl();

		this.redirectReturn = error
			? Promise.reject(mapApiErrorCode(error))
			: this.redeemAuthCode(code as string, stored.verifier);
		return this.redirectReturn;
	}

	/** The `/auth/web/authorize` URL for one sign-in attempt. */
	private authorizeUrl(request: { state: string; challenge: string }, target: string): string {
		return (
			`${this.basePath}/auth/web/authorize` +
			`?clientID=${encodeURIComponent(this.clientID)}` +
			`&state=${encodeURIComponent(request.state)}` +
			`&codeChallenge=${encodeURIComponent(request.challenge)}` +
			`&codeChallengeMethod=S256` +
			target +
			(this.demoMode ? "&demo=true" : "")
		);
	}

	/** Trade an authorization code and its verifier for the credential, and sign in with it. */
	private async redeemAuthCode(code: string, verifier: string): Promise<SignInResult> {
		const res = (await this.fetch(
			"POST",
			"/auth/web/token",
			{ clientID: this.clientID, code, codeVerifier: verifier },
			null,
		)) as Record<string, unknown>;
		if (typeof res.refreshToken !== "string" || res.refreshToken === "") {
			throw new DiscovrError("unknown-error", "Sign-in response missing refreshToken");
		}
		this.acceptRefreshToken(res.refreshToken);
		return {
			refreshToken: res.refreshToken,
			publicId: typeof res.publicId === "string" ? res.publicId : "",
			expiresAt: typeof res.expiresAt === "number" ? res.expiresAt : 0,
		};
	}

	private get authRequestKey(): string {
		return `${this.storagePrefix}auth_request`;
	}

	private storeAuthRequest(request: { state: string; verifier: string }): void {
		try {
			localStorage.setItem(this.authRequestKey, JSON.stringify(request));
		} catch {
			throw new Error("Redirect sign-in needs localStorage, which is unavailable here.");
		}
	}

	/** The request this page started, if there is one. */
	private peekAuthRequest(): { state: string; verifier: string } | null {
		try {
			const raw = localStorage.getItem(this.authRequestKey);
			const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
			return typeof parsed?.state === "string" && typeof parsed.verifier === "string"
				? { state: parsed.state, verifier: parsed.verifier }
				: null;
		} catch {
			return null;
		}
	}

	private forgetAuthRequest(): void {
		try {
			localStorage.removeItem(this.authRequestKey);
		} catch {
			/* nothing stored that we could remove */
		}
	}

	private clearAuthParamsFromUrl(): void {
		try {
			const url = new URL(window.location.href);
			for (const name of ["code", "state", "error"]) url.searchParams.delete(name);
			window.history.replaceState(window.history.state, "", url.toString());
		} catch {
			/* a page that cannot rewrite its own URL still signed in */
		}
	}

	/**
	 * Sign in to a throwaway demo sandbox — no credentials, no sign-up.
	 *
	 * Returns the same {@link SignInResult} as every other sign-in flow, and
	 * leaves the client in the same state, so all subsequent code is identical
	 * to a real session. The sandbox comes pre-populated with profiles and
	 * viewing history, and expires after a short window.
	 *
	 * Called automatically on first use when the client is constructed with
	 * `demoMode: true`; call it directly to start a sandbox at a moment you
	 * choose, or to abandon the current one and get a fresh one.
	 */
	public async signInWithDemo(): Promise<SignInResult> {
		// A demo sign-in provisions server-side state, so concurrent callers must
		// share one in-flight request rather than each creating a sandbox (and
		// burning the caller's hourly quota in the process).
		if (this.demoSignInInFlight) return this.demoSignInInFlight;

		this.demoSignInInFlight = (async () => {
			try {
				const body: Record<string, unknown> = { clientId: this.clientID };
				if (this.demoRefreshTtlMs !== undefined) body.ttlMs = this.demoRefreshTtlMs;
				const res = (await this.fetch("POST", "/auth/demo-session", body, null)) as Record<
					string,
					unknown
				>;

				const refreshToken = String(res.refreshToken ?? "");
				if (!refreshToken.startsWith(REFRESH_TOKEN_PREFIX)) {
					throw new Error("Demo session response did not include a usable refresh token.");
				}

				// A sandbox is a different account from whatever came before it, so
				// any prior session/profile state must not carry over.
				this.refreshToken = refreshToken;
				this.sessionToken = null;
				this.sessionExpiresAt = null;
				this.activeProfileId = null;
				this.demoSession = true;
				this.demoProvisioningSuspended = false;
				this.persist();
				this.emit();

				return {
					refreshToken,
					publicId: "",
					expiresAt: Number(res.expiresAt ?? 0),
				};
			} finally {
				this.demoSignInInFlight = null;
			}
		})();

		return this.demoSignInInFlight;
	}

	/**
	 * Begin device-code sign-in. Returns the user code immediately and polls
	 * in the background; subscribe via {@link onAuthStateChanged} to learn when
	 * the user completes authorization, or await `completion` to also learn that
	 * they declined or the code lapsed.
	 *
	 * The returned `unsubscribe` function stops background polling — call it on
	 * component unmount or when starting a new flow.
	 *
	 * Starting a new device-code flow automatically cancels any previous one.
	 *
	 * `qrSize` is the QR code's size in pixels, clamped to 100-1000. Leave it out
	 * for the server default (300); a TV screen wants 600-800.
	 *
	 * The poll pace is the server's: it returns an `interval` with the code and
	 * repeats it on every pending answer, growing it as the code ages, so a TV left
	 * on the sign-in screen costs less the longer it sits there. The wait ends when
	 * the code does.
	 */
	public async signInWithDeviceCode(options?: DeviceCodeOptions): Promise<DeviceCodeResult> {
		const qrSize = options?.qrSize;
		// Cancel any in-flight poll from a previous call.
		this.activeDeviceCodePoll?.();
		this.activeDeviceCodePoll = null;

		const init = (await this.fetch(
			"POST",
			deviceCodePath(qrSize),
			{ clientID: this.clientID, demo: this.demoMode },
			null,
		)) as Record<string, unknown>;

		const expiresIn = Number(init.expiresIn ?? 0);
		const result: Omit<DeviceCodeResult, "unsubscribe" | "completion"> = {
			deviceCode: String(init.deviceCode),
			userCode: String(init.userCode),
			qrCode: String(init.authQRCode ?? init.qrCode ?? ""),
			verificationUrl: String(init.verificationUrl ?? ""),
			expiresIn,
		};

		let resolveCompletion!: (value: SignInResult) => void;
		let rejectCompletion!: (reason: unknown) => void;
		const completion = new Promise<SignInResult>((resolve, reject) => {
			resolveCompletion = resolve;
			rejectCompletion = reject;
		});
		// A caller who only listens to `onAuthStateChanged` never awaits this, and a
		// declined or lapsed flow must not become their unhandled rejection.
		completion.catch(() => undefined);

		let cancelled = false;
		let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

		const stop = () => {
			cancelled = true;
			if (timeoutHandle !== null) {
				clearTimeout(timeoutHandle);
				timeoutHandle = null;
			}
			if (this.activeDeviceCodePoll === unsubscribe) {
				this.activeDeviceCodePoll = null;
			}
		};
		const unsubscribe = () => {
			if (cancelled) return;
			stop();
			rejectCompletion(new AuthCancelledError());
		};
		const fail = (error: unknown) => {
			stop();
			rejectCompletion(error);
		};

		this.activeDeviceCodePoll = unsubscribe;

		let intervalMs = secondsToMs(init.interval);
		const deadline = Date.now() + (expiresIn > 0 ? expiresIn : DEFAULT_DEVICE_CODE_LIFETIME_MS);
		const poll = async () => {
			if (cancelled) return;
			if (Date.now() >= deadline) {
				fail(new DeviceCodeExpiredError());
				return;
			}
			let waitMs = intervalMs;
			try {
				const r = (await this.fetch(
					"POST",
					`/auth/device-codes/${encodeURIComponent(result.deviceCode)}/poll`,
					{},
					null,
				)) as Record<string, unknown>;
				// Stopped while the request was in flight: do not accept a token the
				// caller no longer wants.
				if (cancelled) return;
				if (typeof r.refreshToken === "string" && r.refreshToken !== "") {
					stop();
					this.acceptRefreshToken(r.refreshToken);
					resolveCompletion({
						refreshToken: r.refreshToken,
						publicId: typeof r.publicId === "string" ? r.publicId : "",
						expiresAt: typeof r.expiresAt === "number" ? r.expiresAt : 0,
					});
					return;
				}
				// Always the latest: the server may have slowed us down.
				if (typeof r.interval === "number" && r.interval > 0) {
					intervalMs = waitMs = secondsToMs(r.interval);
				}
			} catch (e: unknown) {
				// A dead, declined or already-used code ends the flow, and says why.
				if (
					e instanceof DeviceCodeExpiredError ||
					e instanceof DeviceCodeConsumedError ||
					e instanceof DeviceCodeDeniedError
				) {
					fail(e);
					return;
				}
				// Told to slow down: wait out the window instead of asking again into it.
				if (e instanceof RateLimitedError) {
					waitMs = Math.max(intervalMs, e.retryInSeconds * 1000);
				} else {
					this.log("device-code poll error (will retry):", e);
				}
			}
			if (!cancelled) {
				timeoutHandle = setTimeout(() => {
					void poll();
				}, waitMs);
			}
		};
		// First answer after one interval, not immediately: nobody approves within
		// the round trip it took to show the code.
		timeoutHandle = setTimeout(() => {
			void poll();
		}, intervalMs);

		return { ...result, completion, unsubscribe };
	}

	// ── Internals ────────────────────────────────────────────────────────

	private acceptRefreshToken(token: string): void {
		this.refreshToken = token;
		this.sessionToken = null;
		this.sessionExpiresAt = null;
		this.activeProfileId = null;
		this.demoSession = this.demoMode;
		this.demoProvisioningSuspended = false;
		this.persist();
		this.emit();
	}

	/**
	 * The single place a refresh token is demanded, and therefore the single
	 * place demo mode needs to hook: with `demoMode` enabled and no credential
	 * held, a sandbox is provisioned on demand. Callers stay unaware — which is
	 * the whole design goal, since it means no other method needs a demo branch.
	 */
	private async requireRefreshToken(): Promise<string> {
		if (this.refreshToken) return this.refreshToken;
		if (this.demoMode && !this.demoProvisioningSuspended) {
			await this.signInWithDemo();
			if (this.refreshToken) return this.refreshToken;
		}
		throw new NotSignedInError();
	}

	private async ensureSessionToken(): Promise<string> {
		if (!this.activeProfileId) {
			throw new NoProfileSelectedError();
		}
		if (this.hasFreshSessionToken()) return this.sessionToken!;

		// Dedup concurrent mint attempts
		if (this.mintInFlight) return this.mintInFlight;
		this.mintInFlight = (async () => {
			try {
				const minted = await this.mintSessionToken(this.activeProfileId!);
				this.setSessionToken(minted.sessionToken, minted.expiresAt, minted.snapshotId);
				this.persist();
				return minted.sessionToken;
			} finally {
				this.mintInFlight = null;
			}
		})();
		return this.mintInFlight;
	}

	private async mintSessionToken(profileId: string): Promise<SessionTokenResponse> {
		const refreshToken = await this.requireRefreshToken();
		const body: Record<string, unknown> = { profileId };
		// Carrying the snapshot forward is what makes renewing a credential
		// invisible to the user. Dropped on a profile switch, where the previous
		// profile's recommendations would be the wrong ones to keep.
		if (this.snapshotId && profileId === this.activeProfileId) {
			body.snapshotId = this.snapshotId;
		}
		// Only demo-mode clients get a ttlMs hint — everyone else keeps the
		// server's own default untouched, exactly as before this option existed.
		if (this.demoMode) body.ttlMs = this.demoSessionTtlMs;
		return (await this.fetch(
			"POST",
			"/auth/session-token",
			body,
			refreshToken,
		)) as SessionTokenResponse;
	}

	private setSessionToken(token: string, expiresAt: number, snapshotId?: string): void {
		this.sessionToken = token;
		this.sessionExpiresAt = expiresAt;
		const snapshotChanged = snapshotId !== undefined && snapshotId !== this.snapshotId;
		if (snapshotId !== undefined) this.snapshotId = snapshotId;
		this.emitSession(snapshotChanged);
	}

	/**
	 * Per-request middleware for the session-tier API: catches 401s and
	 * runs the auto-recovery matrix.
	 */
	private async handleSessionResponse(context: {
		response: Response;
		init: RequestInit;
		url: string;
	}): Promise<Response | undefined> {
		const res = context.response;

		// Rate limits reach every session-tier call, so they are handled here
		// rather than at each call site. Thrown as a typed error rather than
		// waited out: a limit window is a minute long, so retrying inside the SDK
		// would either block the caller's UI or fire again into a closed window.
		if (res.status === 429) {
			throw new RateLimitedError(
				"Too many requests — slow down and try again shortly.",
				retryAfterSeconds(
					res,
					await res
						.clone()
						.text()
						.catch(() => ""),
				),
			);
		}

		if (res.status !== 401) return res;

		const cloned = res.clone();
		let body: ApiErrorBody = {};
		try {
			body = (await cloned.json()) as ApiErrorBody;
		} catch {
			// An unparseable body (e.g. an HTML WAF/CDN block page) means we can't
			// tell "session token expired" (recoverable — re-mint and retry) from
			// "refresh token expired" (unrecoverable) apart. Default to the safer
			// outcome: sign out and throw a typed error the app can recognize,
			// rather than falling through to `return res` below, which would hand
			// back the raw failed response for the generated runtime to wrap in an
			// untyped, unrecognizable error — the same "stuck forever" bug the
			// TOKEN_EXPIRED/refresh branch below exists to prevent.
			await this.endSession(this.lapseReason());
			throw new TokenInvalidError("Session authentication failed");
		}

		if (body.error === "TOKEN_EXPIRED" && body.tokenKind === "session") {
			// Re-mint and retry once.
			this.sessionToken = null;
			this.sessionExpiresAt = null;
			const fresh = await this.ensureSessionToken();
			return await fetch(context.url, this.withBearer(context.init, fresh));
		}

		if (body.error === "TOKEN_EXPIRED" && body.tokenKind === "refresh") {
			// Same recovery as the proactive path in fetch() below: sign out AND
			// throw a typed error the consuming app's isAuthError()-style checks
			// recognize. Returning the raw (still-401) response here would let it
			// fall through to the generated runtime's generic ResponseError, which
			// callers have no reliable way to distinguish from any other failure —
			// exactly the "stuck forever" bug fetch() was fixed for, reachable from
			// every session-tier call instead of only session-token minting.
			await this.endSession(this.lapseReason());
			throw new TokenInvalidError("Refresh token expired");
		}

		// There used to be a `SESSION_EXPIRED` branch here that nulled a
		// *valid* session token, minted a whole new session, POSTed /pages to
		// rebuild the page from echoed filters, and replayed the request against
		// the new id.
		//
		// It's gone because the condition is. A page id is derived from filters
		// alone, so it can't belong to the "wrong" session — the server resolves
		// it and returns 200 with re-ranked rows. Every 401 that reaches here now
		// is genuinely about authentication.
		//
		// Worth remembering why it had to go rather than be fixed: one stale page
		// reference discarded a live session, which invalidated every *other*
		// page the app held, each of which then 401'd and rotated the session
		// again. The recovery caused the failure it was recovering from.

		if (body.error === "WRONG_TOKEN_KIND") {
			console.error(
				"[_DiscovrAuth] WRONG_TOKEN_KIND — endpoint expected a different token tier than the SDK sent. This indicates an SDK bug; please report it.",
				{ url: context.url, expected: body },
			);
		}

		return res;
	}

	/**
	 * Per-request middleware for the identity-tier API (`getProfiles`, the
	 * session list, ...). These calls carry the refresh token itself, so a 401
	 * saying it expired has nothing to recover with: end the session and throw
	 * the typed error.
	 *
	 * Without this, a call made through the generated identity client — the
	 * first one after a demo sandbox lapsed, say — surfaced as a bare 401 while
	 * the client went on reporting itself signed in. Only the SDK's own requests
	 * (session-token minting) recovered. Same two cases as {@link fetch}: a
	 * refresh-kind `TOKEN_EXPIRED`, and a 401 whose body cannot be read.
	 */
	private async handleIdentityResponse(context: {
		response: Response;
		url: string;
	}): Promise<Response | undefined> {
		const res = context.response;
		if (res.status !== 401) return res;

		let body: ApiErrorBody = {};
		try {
			body = (await res.clone().json()) as ApiErrorBody;
		} catch {
			await this.endSession(this.lapseReason());
			throw new TokenInvalidError("Refresh token rejected");
		}
		if (body.error === "TOKEN_EXPIRED" && body.tokenKind === "refresh") {
			await this.endSession(this.lapseReason());
			throw new TokenInvalidError("Refresh token expired");
		}
		return res;
	}

	private withBearer(init: RequestInit, token: string): RequestInit {
		const headers = new Headers(init.headers ?? {});
		headers.set("Authorization", `Bearer ${token}`);
		return { ...init, headers };
	}

	private async fetch(
		method: string,
		path: string,
		body: unknown,
		bearer: string | null,
	): Promise<unknown> {
		this.loopGuard.check(`${method} ${path}`);

		const headers: Record<string, string> = { Accept: "application/json" };
		if (body !== null && body !== undefined) headers["Content-Type"] = "application/json";
		if (bearer) headers["Authorization"] = `Bearer ${bearer}`;

		let res: Response;
		try {
			res = await fetch(`${this.basePath}${path}`, {
				method,
				headers,
				body: body !== null && body !== undefined ? JSON.stringify(body) : undefined,
				signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
			});
		} catch (e) {
			// AbortSignal.timeout() rejects fetch with a DOMException named
			// "TimeoutError", not "AbortError" (verified on Node 22 — the runtime
			// this SDK ships to) — "AbortError" is what a manually-aborted
			// AbortController produces, a different case this SDK never triggers
			// itself. Checking only "AbortError" here left AuthTimeoutError
			// permanently unreachable; every real timeout fell through to the raw,
			// untyped DOMException instead.
			if (e instanceof DOMException && (e.name === "AbortError" || e.name === "TimeoutError")) {
				throw new AuthTimeoutError(`${method} ${path} timed out after ${REQUEST_TIMEOUT_MS}ms`);
			}
			throw e;
		}
		if (!res.ok) {
			// Identity-tier calls carry their own limit, so a rate-limited sign-in
			// or profile mint surfaces as the same typed error a data call would
			// throw — not as the untyped `Error` at the end of this block.
			const txt = await res.text();
			if (res.status === 429) {
				throw new RateLimitedError(
					`Too many requests to ${path} — slow down and try again shortly.`,
					retryAfterSeconds(res, txt),
				);
			}

			// A 401 here means the refresh token itself was rejected — this is the
			// identity tier, so there's no session token to fall back to and no
			// request to retry. `handleSessionResponse` already recovers from this
			// exact shape reactively (mid-session, once a request is already using
			// the session token and gets bounced); this is the other path — minting
			// a session token proactively (`mintSessionToken`/`ensureSessionToken`)
			// — which never goes through that middleware, so it needs the same
			// recovery here. Skip for the sign-out revocation call itself
			// (`DELETE /auth/session`) — signOut() already clears local state before
			// this fires, so recovering here would just recurse into a second,
			// no-op signOut().
			// Only when a refresh token was sent: a sign-in call (the code exchange, a
			// device poll) has none, so its 401 is about the code, not about a session
			// that this would sign out.
			if (res.status === 401 && bearer !== null && path !== "/auth/session") {
				let parsed: ApiErrorBody = {};
				try {
					parsed = JSON.parse(txt) as ApiErrorBody;
				} catch {
					// Same fail-safe as handleSessionResponse: an identity-tier 401
					// with an unparseable body (e.g. an HTML WAF/CDN block page) still
					// means the refresh token was rejected for this request — sign out
					// and throw a typed error rather than falling through to the plain
					// Error below, which the app has no reliable way to recognize as
					// an auth failure.
					await this.endSession(this.lapseReason());
					throw new TokenInvalidError("Refresh token rejected");
				}
				if (parsed.error === "TOKEN_EXPIRED" && parsed.tokenKind === "refresh") {
					await this.endSession(this.lapseReason());
					throw new TokenInvalidError("Refresh token expired");
				}
			}
			throw apiErrorFor(res.status, txt);
		}
		const ct = res.headers.get("content-type") ?? "";
		return ct.includes("application/json") ? await res.json() : await res.text();
	}

	/**
	 * Keep this instance in step with other tabs on the same origin.
	 *
	 * Without this, two tabs run independently: each restores once at
	 * construction and then only ever writes. They overwrite each other's
	 * tokens, drift onto different snapshots, and — worst of it — a sign-out in
	 * one tab leaves the other holding a credential it believes is live until
	 * its next identity call fails.
	 *
	 * `storage` only fires in *other* tabs, so this never reacts to its own
	 * writes.
	 */
	private watchStorage(): void {
		if (typeof window === "undefined" || typeof window.addEventListener !== "function") return;

		this.storageListener = (event: StorageEvent) => {
			// `key === null` means the whole store was cleared.
			if (event.key !== null && !event.key.startsWith(this.storagePrefix)) return;

			const wasSignedIn = this.isSignedIn();
			const previousProfileId = this.activeProfileId;
			const previousSnapshotId = this.snapshotId;

			this.restore();

			if (this.isSignedIn() !== wasSignedIn || this.activeProfileId !== previousProfileId) {
				this.emit();
			}
			// Report a snapshot move so the other tab's cached page data is
			// dropped, same as if this tab had rotated it itself.
			this.emitSession(this.snapshotId !== previousSnapshotId);
		};
		window.addEventListener("storage", this.storageListener);
	}

	/**
	 * Release the cross-tab listener.
	 *
	 * A `storage` listener is registered on `window`, which outlives any client
	 * that forgets to let go of it: without this, every `new DiscovrClient()` in
	 * a hot-reloading dev server or a re-mounting test leaves another live
	 * listener behind, each still restoring state and emitting sessions. Kotlin
	 * has `close()` and Swift releases in `deinit`; this is the same seam.
	 */
	public close(): void {
		if (this.storageListener && typeof window !== "undefined") {
			window.removeEventListener("storage", this.storageListener);
		}
		this.storageListener = undefined;
		this.listeners.length = 0;
		this.sessionListeners.length = 0;
		this.snapshotListeners.length = 0;
	}

	private restore(): void {
		if (typeof localStorage === "undefined") return;

		let stored: Partial<PersistedSession> = {};
		const raw = localStorage.getItem(`${this.storagePrefix}session`);
		if (raw) {
			try {
				stored = JSON.parse(raw) as Partial<PersistedSession>;
			} catch {
				// Corrupt or written by an older layout — treat as signed out rather
				// than half-restoring something we can't read.
				stored = {};
			}
		}

		// Assign unconditionally rather than only-if-present: this also runs when
		// another tab signs out and clears the key, and a conditional restore
		// would leave this tab holding tokens that no longer exist.
		const previousRefreshToken = this.refreshToken;
		const rt = stored.refreshToken;
		this.refreshToken = typeof rt === "string" && rt.startsWith(REFRESH_TOKEN_PREFIX) ? rt : null;
		this.demoSession = stored.demo === true && this.refreshToken !== null;

		if (!this.rememberProfile) {
			// The credential is shared, the profile is not: whatever profile an
			// earlier run (or another tab) stored is not this run's to resume. Keep
			// this instance's own selection while it is signed in as the same
			// account, and drop it when the credential goes or changes hands, so a
			// sign-out or a different sign-in in another tab still lands.
			if (this.refreshToken === null || this.refreshToken !== previousRefreshToken) {
				this.sessionToken = null;
				this.sessionExpiresAt = null;
				this.activeProfileId = null;
				this.snapshotId = null;
			}
			return;
		}

		this.sessionToken = stored.sessionToken ?? null;
		this.sessionExpiresAt = stored.sessionExpiresAt ?? null;
		this.activeProfileId = stored.activeProfileId ?? null;
		this.snapshotId = stored.snapshotId ?? null;

		// Drop expired session token (will be re-minted on demand).
		if (this.sessionExpiresAt && this.sessionExpiresAt * 1000 <= Date.now()) {
			this.sessionToken = null;
			this.sessionExpiresAt = null;
		}
	}

	/**
	 * Persist the whole session as **one** key.
	 *
	 * `storage` fires once per key changed, so writing five keys made other tabs
	 * run `restore()` five times against a store that was still being written —
	 * long enough to read a new session token beside its predecessor's expiry.
	 * One key means other tabs only ever observe a complete session.
	 */
	private persist(): void {
		if (typeof localStorage === "undefined") return;
		const key = `${this.storagePrefix}session`;
		if (!this.refreshToken && !this.sessionToken && !this.activeProfileId) {
			localStorage.removeItem(key);
			return;
		}
		// Without `rememberProfile` only the credential is stored. The profile
		// fields are written as null rather than left out so a profile stored by
		// an earlier build, or earlier setting, is cleared on the next write.
		const remember = this.rememberProfile;
		localStorage.setItem(
			key,
			JSON.stringify({
				refreshToken: this.refreshToken,
				sessionToken: remember ? this.sessionToken : null,
				sessionExpiresAt: remember ? this.sessionExpiresAt : null,
				activeProfileId: remember ? this.activeProfileId : null,
				snapshotId: remember ? this.snapshotId : null,
				demo: this.demoSession,
			}),
		);
	}

	private authState(): AuthState {
		const signedIn = this.isSignedIn();
		// A reason describes the signed-out state, so it clears the moment the
		// client is signed in again.
		if (signedIn) this.signOutReason = null;
		return {
			signedIn,
			profileId: this.activeProfileId,
			signOutReason: signedIn ? null : this.signOutReason,
		};
	}

	private emit(): void {
		const state = this.authState();
		for (const cb of [...this.listeners]) {
			try {
				cb(state);
			} catch (e) {
				this.log("listener error:", e);
			}
		}
	}

	/**
	 * @param snapshotChanged Whether the user's recommendations actually turned
	 *   over. Consumers use this to decide whether cached page data is stale —
	 *   a plain credential renewal leaves it perfectly good.
	 */
	private emitSession(snapshotChanged = false): void {
		const state: SessionState = {
			profileId: this.activeProfileId,
			expiresAt: this.sessionExpiresAt,
			snapshotId: this.snapshotId,
		};
		for (const cb of [...this.snapshotListeners]) {
			try {
				cb(snapshotChanged);
			} catch (e) {
				this.log("snapshot listener error:", e);
			}
		}
		for (const cb of [...this.sessionListeners]) {
			try {
				cb(state);
			} catch (e) {
				this.log("session listener error:", e);
			}
		}
	}

	private log(...args: unknown[]): void {
		if (this.debug) console.log("[_DiscovrAuth]", ...args);
	}
}

function generateState(): string {
	if (typeof crypto === "undefined" || !crypto.getRandomValues) {
		throw new Error("[DiscovrAuth] Secure random is unavailable in this environment.");
	}
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export interface PkcePair {
	/** A random secret that stays in the SDK until the code is redeemed. */
	verifier: string;
	/** `base64url(SHA-256(verifier))`: what the server stores and later checks the verifier against. */
	challenge: string;
}

function base64Url(bytes: Uint8Array): string {
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * A fresh PKCE verifier and its S256 challenge.
 *
 * The verifier is 32 random bytes (43 characters, inside the 43-128 RFC 7636
 * allows). Needs Web Crypto's `subtle`, which browsers only expose on secure
 * origins (https, or localhost).
 */
export async function createPkcePair(): Promise<PkcePair> {
	if (typeof crypto === "undefined" || !crypto.getRandomValues || !crypto.subtle) {
		throw new Error(
			"[DiscovrAuth] Sign-in needs Web Crypto, which browsers only provide on https or localhost.",
		);
	}
	const random = new Uint8Array(32);
	crypto.getRandomValues(random);
	const verifier = base64Url(random);
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
	return { verifier, challenge: base64Url(new Uint8Array(digest)) };
}

export default _DiscovrAuth;
