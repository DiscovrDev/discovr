/**
 * Tests for the demo-mode request shapes `_DiscovrAuth` sends: `clientId` on
 * `POST /auth/demo-session` (now required by the server) and the `ttlMs`
 * hints on both demo-session creation and session-token minting.
 *
 * `fetch` is mocked directly rather than exercised against a real server —
 * this is a request-shape test, not an integration test.
 */

import { createHash } from "node:crypto";
import _DiscovrAuth, { createPkcePair, deviceCodePath } from "../auth";
import {
	AuthCancelledError,
	DeviceCodeDeniedError,
	DeviceCodeExpiredError,
	apiErrorFor,
} from "../errors";

function jsonResponse(body: unknown, ok = true, status?: number): Response {
	return {
		ok,
		status: status ?? (ok ? 200 : 400),
		headers: new Headers({ "content-type": "application/json" }),
		json: async () => body,
		text: async () => JSON.stringify(body),
		clone() {
			return jsonResponse(body, ok, status);
		},
	} as unknown as Response;
}

describe("_DiscovrAuth demo-mode request shapes", () => {
	let fetchMock: jest.Mock;

	beforeEach(() => {
		fetchMock = jest.fn();
		global.fetch = fetchMock as unknown as typeof fetch;
	});

	function lastRequestBody(): Record<string, unknown> {
		const [, init] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1] as [string, RequestInit];
		return JSON.parse(init.body as string) as Record<string, unknown>;
	}

	it("signInWithDemo sends its own clientId, with no ttlMs when unconfigured", async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ refreshToken: "rt_abc", expiresAt: 123 }));
		const auth = new _DiscovrAuth("my-client-id", { demoMode: true });

		await auth.signInWithDemo();

		expect(lastRequestBody()).toEqual({ clientId: "my-client-id" });
	});

	it("signInWithDemo includes ttlMs when demoRefreshTtlMs is configured", async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ refreshToken: "rt_abc", expiresAt: 123 }));
		const auth = new _DiscovrAuth("my-client-id", {
			demoMode: true,
			demoRefreshTtlMs: 60_000,
		});

		await auth.signInWithDemo();

		expect(lastRequestBody()).toEqual({ clientId: "my-client-id", ttlMs: 60_000 });
	});

	it("selectProfile requests a session token with the default 15-minute demo ttl", async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse({ refreshToken: "rt_abc", expiresAt: 123 }))
			.mockResolvedValueOnce(
				jsonResponse({ sessionToken: "eyJabc", snapshotId: "snap1", expiresAt: 456 }),
			);
		const auth = new _DiscovrAuth("my-client-id", { demoMode: true });
		await auth.signInWithDemo();

		await auth.selectProfile("profile-1");

		expect(lastRequestBody()).toEqual({ profileId: "profile-1", ttlMs: 15 * 60 * 1000 });
	});

	it("selectProfile honours an explicit demoSessionTtlMs override", async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse({ refreshToken: "rt_abc", expiresAt: 123 }))
			.mockResolvedValueOnce(
				jsonResponse({ sessionToken: "eyJabc", snapshotId: "snap1", expiresAt: 456 }),
			);
		const auth = new _DiscovrAuth("my-client-id", {
			demoMode: true,
			demoSessionTtlMs: 120_000,
		});
		await auth.signInWithDemo();

		await auth.selectProfile("profile-1");

		expect(lastRequestBody()).toEqual({ profileId: "profile-1", ttlMs: 120_000 });
	});

	it("a non-demo client's session-token request carries no ttlMs at all", async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ sessionToken: "eyJabc", snapshotId: "snap1", expiresAt: 456 }),
		);
		const auth = new _DiscovrAuth("my-client-id");
		// Bypass the full sign-in flow — this test is about the session-token
		// request shape, not how a credential was obtained.
		(auth as unknown as { refreshToken: string }).refreshToken = "rt_existing";

		await auth.selectProfile("profile-1");

		expect(lastRequestBody()).toEqual({ profileId: "profile-1" });
	});
});

describe("_DiscovrAuth refresh-token-expired recovery", () => {
	let fetchMock: jest.Mock;

	beforeEach(() => {
		fetchMock = jest.fn();
		global.fetch = fetchMock as unknown as typeof fetch;
	});

	function errorResponse(status: number, body: unknown): Response {
		return {
			ok: false,
			status,
			headers: new Headers({ "content-type": "application/json" }),
			json: async () => body,
			text: async () => JSON.stringify(body),
			clone() {
				return errorResponse(status, body);
			},
		} as unknown as Response;
	}

	/**
	 * `mintSessionToken` (proactive minting, e.g. via `selectProfile` or a silent
	 * refresh) hits `POST /auth/session-token` directly — it never goes through
	 * `handleSessionResponse`'s reactive 401 recovery, which only wraps
	 * requests already using a session token. Regression test for the "loading
	 * forever" bug: a refresh token expiring mid-visit left the SDK throwing an
	 * untyped `Error` here, which the client's `isAuthError()` check didn't
	 * recognize, so sign-out — and the app's "demo expired" screen — never fired.
	 */
	it("signs out and throws a recognizable error when the refresh token itself has expired", async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse({ refreshToken: "rt_abc", expiresAt: 123 }))
			.mockResolvedValueOnce(errorResponse(401, { error: "TOKEN_EXPIRED", tokenKind: "refresh" }))
			.mockResolvedValueOnce(jsonResponse({}));
		const auth = new _DiscovrAuth("my-client-id", { demoMode: true });
		await auth.signInWithDemo();
		expect(auth.isSignedIn()).toBe(true);

		await expect(auth.selectProfile("profile-1")).rejects.toMatchObject({
			name: "TokenInvalidError",
		});

		expect(auth.isSignedIn()).toBe(false);
		// demo-session mint, the failing session-token mint, and one (and only
		// one) DELETE /auth/session revocation — no recursive signOut loop.
		expect(fetchMock).toHaveBeenCalledTimes(3);
		const [, deleteInit] = fetchMock.mock.calls[2] as [string, RequestInit];
		expect(deleteInit.method).toBe("DELETE");
	});

	/**
	 * Same recovery, the *reactive* half: a session-tier request (already using
	 * a session token) gets bounced with this exact 401 shape mid-flight —
	 * `handleSessionResponse`'s middleware path, not `mintSessionToken`'s direct
	 * one above. Regression test for the same "loading forever" bug on the path
	 * that's actually hit on every `/profile/*`/`/pages/*` call, not just
	 * session-token minting: `signOut()` ran, but the still-401 response was
	 * returned as-is instead of a recognizable typed error being thrown, so it
	 * fell through to the generated runtime's generic (unrecognized) error.
	 */
	it("handleSessionResponse signs out and throws a recognizable error on refresh-token expiry", async () => {
		const auth = new _DiscovrAuth("my-client-id");
		(auth as unknown as { refreshToken: string }).refreshToken = "rt_existing";
		fetchMock.mockResolvedValueOnce(jsonResponse({})); // signOut()'s best-effort DELETE

		const handleSessionResponse = (
			auth as unknown as {
				handleSessionResponse: (context: {
					response: Response;
					init: RequestInit;
					url: string;
				}) => Promise<Response | undefined>;
			}
		).handleSessionResponse.bind(auth);

		await expect(
			handleSessionResponse({
				response: errorResponse(401, { error: "TOKEN_EXPIRED", tokenKind: "refresh" }),
				init: { method: "GET" },
				url: "https://api.discovr.media/pages/abc/rows",
			}),
		).rejects.toMatchObject({ name: "TokenInvalidError" });

		expect(auth.isSignedIn()).toBe(false);
	});

	function nonJsonErrorResponse(status: number, text: string): Response {
		return {
			ok: false,
			status,
			headers: new Headers({ "content-type": "text/html" }),
			json: async () => {
				throw new SyntaxError("Unexpected token < in JSON");
			},
			text: async () => text,
			clone() {
				return nonJsonErrorResponse(status, text);
			},
		} as unknown as Response;
	}

	/**
	 * A 401 with a non-JSON body (e.g. an HTML WAF/CDN block page in front of
	 * the API) used to be silently swallowed by the `catch { /* ignore *\/ }`
	 * around the JSON parse, falling through to a plain untyped `Error` — the
	 * same "stuck forever" failure mode as the two tests above, just reachable
	 * from a response shape the structured-error branches never anticipated.
	 */
	it("signs out and throws a recognizable error on an unparseable 401 body (proactive path)", async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse({ refreshToken: "rt_abc", expiresAt: 123 }))
			.mockResolvedValueOnce(nonJsonErrorResponse(401, "<html>blocked by WAF</html>"))
			.mockResolvedValueOnce(jsonResponse({}));
		const auth = new _DiscovrAuth("my-client-id", { demoMode: true });
		await auth.signInWithDemo();

		await expect(auth.selectProfile("profile-1")).rejects.toMatchObject({
			name: "TokenInvalidError",
		});

		expect(auth.isSignedIn()).toBe(false);
	});

	it("signs out and throws a recognizable error on an unparseable 401 body (reactive path)", async () => {
		const auth = new _DiscovrAuth("my-client-id");
		(auth as unknown as { refreshToken: string }).refreshToken = "rt_existing";
		fetchMock.mockResolvedValueOnce(jsonResponse({})); // signOut()'s best-effort DELETE

		const handleSessionResponse = (
			auth as unknown as {
				handleSessionResponse: (context: {
					response: Response;
					init: RequestInit;
					url: string;
				}) => Promise<Response | undefined>;
			}
		).handleSessionResponse.bind(auth);

		await expect(
			handleSessionResponse({
				response: nonJsonErrorResponse(401, "<html>blocked by WAF</html>"),
				init: { method: "GET" },
				url: "https://api.discovr.media/pages/abc/rows",
			}),
		).rejects.toMatchObject({ name: "TokenInvalidError" });

		expect(auth.isSignedIn()).toBe(false);
	});
});

describe("_DiscovrAuth request timeout", () => {
	let fetchMock: jest.Mock;

	beforeEach(() => {
		fetchMock = jest.fn();
		global.fetch = fetchMock as unknown as typeof fetch;
	});

	/**
	 * `AbortSignal.timeout()` rejects `fetch` with a `DOMException` named
	 * "TimeoutError" (verified on Node 22, this SDK's target runtime) — not
	 * "AbortError", which only a manually-aborted `AbortController` produces.
	 * The classification check only looked for "AbortError", so every real
	 * timeout fell through to the raw `DOMException` instead of the typed
	 * `AuthTimeoutError` callers are meant to be able to catch.
	 */
	it("classifies an AbortSignal.timeout rejection as AuthTimeoutError", async () => {
		fetchMock.mockRejectedValueOnce(new DOMException("The operation timed out.", "TimeoutError"));
		const auth = new _DiscovrAuth("my-client-id", { demoMode: true });

		await expect(auth.signInWithDemo()).rejects.toMatchObject({ name: "AuthTimeoutError" });
	});
});

describe("_DiscovrAuth signOut session-state emission", () => {
	/**
	 * `DiscovrClient`'s response cache is wired to clear on `onSessionRefreshed`
	 * (`this._auth.onSessionRefreshed(() => this._cache.clear())`), not
	 * `onAuthStateChanged`. `signOut()` is called both from the public
	 * `DiscovrClient.signOut()` (which also clears the cache synchronously,
	 * belt-and-suspenders) *and* directly from this class's own 401-recovery
	 * paths (`handleSessionResponse`, `fetch()`), which never go through that
	 * wrapper. Before this fix, `signOut()` only fired `emit()` (auth-state
	 * listeners) — the recovery paths' forced sign-outs never fired
	 * `onSessionRefreshed`, so a consuming `DiscovrClient`'s cache would
	 * silently survive a forced sign-out and could leak stale, session-scoped
	 * responses afterward.
	 */
	it("fires onSessionRefreshed so a wrapping client's cache-clear listener runs", async () => {
		const auth = new _DiscovrAuth("my-client-id");
		const sessionStates: Array<{
			profileId: string | null;
			expiresAt: number | null;
			snapshotId: string | null;
		}> = [];
		auth.onSessionRefreshed((state) => sessionStates.push(state));
		sessionStates.length = 0; // drop the synchronous initial emission on subscribe

		await auth.signOut();

		expect(sessionStates).toEqual([{ profileId: null, expiresAt: null, snapshotId: null }]);
	});
});

/** The browser pieces the web sign-in flows touch, shimmed for the node test environment. */
function installBrowser() {
	const store = new Map<string, string>();
	const listeners = new Set<(event: MessageEvent) => void>();
	const popup = {
		closed: false,
		close: jest.fn(() => (popup.closed = true)),
		location: { href: "" },
	};
	const replaceState = jest.fn();
	const win = {
		location: {
			href: "https://app.example.com/start",
			search: "",
			origin: "https://app.example.com",
		},
		history: { state: null, replaceState },
		open: jest.fn((): typeof popup | null => popup),
		addEventListener: (type: string, fn: (event: MessageEvent) => void) => {
			if (type === "message") listeners.add(fn);
		},
		removeEventListener: (type: string, fn: (event: MessageEvent) => void) => {
			if (type === "message") listeners.delete(fn);
		},
	};
	(globalThis as unknown as Record<string, unknown>).localStorage = {
		getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
		setItem: (k: string, v: string) => void store.set(k, v),
		removeItem: (k: string) => void store.delete(k),
	};
	(globalThis as unknown as Record<string, unknown>).window = win;
	return {
		store,
		popup,
		win,
		replaceState,
		/** Deliver a postMessage the way the browser does, from `source`. */
		message: (data: unknown, source: unknown = popup) =>
			listeners.forEach((fn) => fn({ data, source } as unknown as MessageEvent)),
		listenerCount: () => listeners.size,
		restore: () => {
			delete (globalThis as unknown as Record<string, unknown>).localStorage;
			delete (globalThis as unknown as Record<string, unknown>).window;
		},
	};
}

const sha256Url = (value: string) => createHash("sha256").update(value).digest("base64url");

describe("_DiscovrAuth web sign-in (authorization code with PKCE)", () => {
	let browser: ReturnType<typeof installBrowser>;
	let fetchMock: jest.Mock;
	const tokenResponse = () =>
		jsonResponse({ refreshToken: "rt_redeemed", publicId: "pub-1", expiresAt: 123 });
	const redeemCalls = () =>
		fetchMock.mock.calls.filter(([url]: [string]) => url.endsWith("/auth/web/token"));

	beforeEach(() => {
		browser = installBrowser();
		fetchMock = jest.fn(async () => tokenResponse());
		global.fetch = fetchMock as unknown as typeof fetch;
	});
	afterEach(() => browser.restore());

	describe("createPkcePair", () => {
		it("makes a 43-character verifier and its S256 challenge", async () => {
			const { verifier, challenge } = await createPkcePair();

			expect(verifier).toMatch(/^[A-Za-z0-9_-]{43}$/);
			expect(challenge).toBe(sha256Url(verifier));
			expect(challenge).toMatch(/^[A-Za-z0-9_-]{43}$/);
		});

		it("never repeats", async () => {
			const pairs = await Promise.all(Array.from({ length: 20 }, () => createPkcePair()));
			expect(new Set(pairs.map((p) => p.verifier)).size).toBe(20);
		});

		it("matches the RFC 7636 appendix B test vector", () => {
			// verifier -> challenge, as published; guards the base64url encoding.
			expect(sha256Url("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk")).toBe(
				"E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
			);
		});
	});

	describe("redirect flow", () => {
		const startRedirect = async (auth = new _DiscovrAuth("my-client-id")) => {
			await auth.signInWithWebAuth("https://example.com/callback");
			const url = new URL(browser.win.location.href);
			const stored = JSON.parse(browser.store.get("discovr_auth_request")!) as {
				state: string;
				verifier: string;
			};
			return { auth, url, ...stored };
		};

		it("sends the state and a challenge, and keeps the verifier to itself", async () => {
			const { url, state, verifier } = await startRedirect();

			expect(url.searchParams.get("state")).toBe(state);
			expect(state).toHaveLength(64); // 32 random bytes, hex-encoded
			expect(url.searchParams.get("codeChallenge")).toBe(sha256Url(verifier));
			expect(url.searchParams.get("codeChallengeMethod")).toBe("S256");
			expect(url.searchParams.get("redirectURL")).toBe("https://example.com/callback");
			// The secret is stored locally and is in no URL.
			expect(url.href).not.toContain(verifier);
		});

		it("redeems the code with the stored verifier, signs in, and clears the request and the URL", async () => {
			const { auth, state, verifier } = await startRedirect();
			browser.win.location.search = `?code=the-code&state=${state}&other=keep`;
			browser.win.location.href = `https://app.example.com/cb?code=the-code&state=${state}&other=keep`;

			const result = await auth.handleRedirectResult();

			expect(result).toEqual({ refreshToken: "rt_redeemed", publicId: "pub-1", expiresAt: 123 });
			expect(redeemCalls()).toHaveLength(1);
			const body = JSON.parse(redeemCalls()[0][1].body);
			expect(body).toEqual({
				clientID: "my-client-id",
				code: "the-code",
				codeVerifier: verifier,
				deviceId: expect.stringMatching(/^[0-9a-f]{32}$/),
			});
			expect(auth.isSignedIn()).toBe(true);
			expect(browser.store.has("discovr_auth_request")).toBe(false);
			// A reload must not try to use the code again; unrelated params stay.
			const cleaned = new URL(browser.replaceState.mock.calls[0][2]);
			expect(cleaned.searchParams.has("code")).toBe(false);
			expect(cleaned.searchParams.has("state")).toBe(false);
			expect(cleaned.searchParams.get("other")).toBe("keep");
		});

		it("ignores a return whose state is not ours, touching neither the URL nor the stored request", async () => {
			const { auth } = await startRedirect();
			browser.win.location.search = "?code=the-code&state=not-the-real-state";

			await expect(auth.handleRedirectResult()).resolves.toBeNull();
			// Another provider's callback, or a forged link: it must not cancel the real sign-in.
			browser.win.location.search = "?error=access_denied&state=not-the-real-state";
			const second = new _DiscovrAuth("my-client-id");
			await expect(second.handleRedirectResult()).resolves.toBeNull();
			expect(redeemCalls()).toHaveLength(0);
			expect(browser.store.has("discovr_auth_request")).toBe(true);
			expect(browser.replaceState).not.toHaveBeenCalled();
		});

		it("ignores a return this page never started", async () => {
			browser.win.location.search = "?code=the-code&state=abc";

			await expect(new _DiscovrAuth("my-client-id").handleRedirectResult()).resolves.toBeNull();
		});

		it("answers a second call on the same page load with the first call's result", async () => {
			const { auth, state } = await startRedirect();
			browser.win.location.search = `?code=the-code&state=${state}`;

			const [first, second] = [auth.handleRedirectResult(), auth.handleRedirectResult()];

			expect(await second).toEqual(await first);
			expect(redeemCalls()).toHaveLength(1);
		});

		it("returns null when this page load is not a sign-in return", async () => {
			const { auth } = await startRedirect();
			browser.win.location.search = "";

			await expect(auth.handleRedirectResult()).resolves.toBeNull();
			expect(redeemCalls()).toHaveLength(0);
		});

		it("raises AuthCancelledError when the person cancelled", async () => {
			const { auth, state } = await startRedirect();
			browser.win.location.search = `?error=authorization-cancelled&state=${state}`;

			await expect(auth.handleRedirectResult()).rejects.toBeInstanceOf(AuthCancelledError);
			expect(auth.isSignedIn()).toBe(false);
		});

		it("raises the typed error for a failed redemption and does not sign in", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse({ error: "code-verifier-invalid" }, false, 401));
			const { auth, state } = await startRedirect();
			browser.win.location.search = `?code=the-code&state=${state}`;

			await expect(auth.handleRedirectResult()).rejects.toMatchObject({
				name: "TokenInvalidError",
			});
			expect(auth.isSignedIn()).toBe(false);
		});

		it("does not read a token out of the URL any more", async () => {
			const { auth, state } = await startRedirect();
			// The old contract delivered the credential here. It must not be believed.
			browser.win.location.search = `?refreshToken=rt_smuggled&state=${state}`;

			await expect(auth.handleRedirectResult()).resolves.toBeNull();
			expect(auth.isSignedIn()).toBe(false);
		});
	});

	describe("popup flow", () => {
		const authorizeUrl = () => new URL(browser.popup.location.href);
		/** The SDK points the window at the authorize URL once the (async) hash is done. */
		const popupReady = async () => {
			for (let i = 0; i < 200 && browser.popup.location.href === ""; i += 1) {
				await new Promise((r) => setImmediate(r));
			}
		};

		it("opens the window before awaiting anything, so the browser treats it as the click's", () => {
			const auth = new _DiscovrAuth("my-client-id");

			void auth.signInWithPopup().catch(() => undefined);

			// Synchronously, in the same tick as the call. A popup opened after an
			// `await` is no longer in the click that asked for it, and is blocked.
			expect(browser.win.open).toHaveBeenCalledTimes(1);
		});

		it("points the window at the authorize URL with a challenge, the opener origin, and no secret", async () => {
			const auth = new _DiscovrAuth("my-client-id");
			const pending = auth.signInWithPopup().catch(() => undefined);
			await popupReady();

			const url = authorizeUrl();
			expect(url.searchParams.get("clientID")).toBe("my-client-id");
			expect(url.searchParams.get("codeChallenge")).toMatch(/^[A-Za-z0-9_-]{43}$/);
			expect(url.searchParams.get("codeChallengeMethod")).toBe("S256");
			expect(url.searchParams.get("openerOrigin")).toBe("https://app.example.com");
			expect(url.href).not.toContain("codeVerifier");
			browser.popup.closed = true;
			await pending;
		});

		it("redeems the code it is sent with the verifier that matches its challenge", async () => {
			const auth = new _DiscovrAuth("my-client-id");
			const pending = auth.signInWithPopup();
			await popupReady();
			const url = authorizeUrl();

			browser.message({ code: "the-code", state: url.searchParams.get("state") });
			const result = await pending;

			expect(result).toEqual({ refreshToken: "rt_redeemed", publicId: "pub-1", expiresAt: 123 });
			const body = JSON.parse(redeemCalls()[0][1].body);
			expect(body.code).toBe("the-code");
			expect(sha256Url(body.codeVerifier)).toBe(url.searchParams.get("codeChallenge"));
			expect(browser.popup.close).toHaveBeenCalled();
			expect(browser.listenerCount()).toBe(0);
			expect(auth.isSignedIn()).toBe(true);
		});

		describe("device id", () => {
			/** Run one popup sign-in to completion and return the redeem request body. */
			const signInOnce = async (auth: _DiscovrAuth) => {
				// One popup object stands in for every window the SDK opens; hand it back blank.
				browser.popup.location.href = "";
				browser.popup.closed = false;
				const pending = auth.signInWithPopup();
				await popupReady();
				browser.message({ code: "the-code", state: authorizeUrl().searchParams.get("state") });
				await pending;
				const calls = redeemCalls();
				return JSON.parse(calls[calls.length - 1][1].body) as Record<string, unknown>;
			};

			it("sends a well-formed id with the code, and keeps it under its own key", async () => {
				const body = await signInOnce(new _DiscovrAuth("my-client-id"));

				expect(body.deviceId).toMatch(/^[0-9a-f]{32}$/);
				expect(browser.store.get("discovr_device_id")).toBe(body.deviceId);
			});

			it("is the same id after signing out and in again, so the server can replace the old credential", async () => {
				const auth = new _DiscovrAuth("my-client-id");
				const first = await signInOnce(auth);

				await auth.signOut();
				const second = await signInOnce(auth);

				expect(second.deviceId).toBe(first.deviceId);
				// Sign-out cleared the session, not the device's identity.
				expect(browser.store.get("discovr_device_id")).toBe(first.deviceId);
			});

			it("is shared by every client on the same storage, and honours the storage prefix", async () => {
				const a = await signInOnce(new _DiscovrAuth("my-client-id"));
				const b = await signInOnce(new _DiscovrAuth("my-client-id"));
				expect(b.deviceId).toBe(a.deviceId);

				const other = new _DiscovrAuth("my-client-id", { storagePrefix: "other_" });
				const c = await signInOnce(other);
				expect(c.deviceId).not.toBe(a.deviceId);
				expect(browser.store.get("other_device_id")).toBe(c.deviceId);
			});

			it("replaces a stored value that is not a valid id instead of sending it", async () => {
				browser.store.set("discovr_device_id", "not-an-id");

				const body = await signInOnce(new _DiscovrAuth("my-client-id"));

				expect(body.deviceId).toMatch(/^[0-9a-f]{32}$/);
				expect(browser.store.get("discovr_device_id")).toBe(body.deviceId);
			});

			it("holds one id for the client's lifetime when storage is unavailable", async () => {
				// Only the device id is unreadable and unwritable; the session still persists.
				const denied = (key: string) => {
					if (key.endsWith("device_id")) throw new Error("denied");
				};
				(globalThis as unknown as Record<string, unknown>).localStorage = {
					getItem: (k: string) => {
						denied(k);
						return browser.store.has(k) ? browser.store.get(k)! : null;
					},
					setItem: (k: string, v: string) => {
						denied(k);
						browser.store.set(k, v);
					},
					removeItem: (k: string) => void browser.store.delete(k),
				};
				const auth = new _DiscovrAuth("my-client-id");

				const first = await signInOnce(auth);
				await auth.signOut();
				const second = await signInOnce(auth);

				expect(first.deviceId).toMatch(/^[0-9a-f]{32}$/);
				expect(second.deviceId).toBe(first.deviceId);
			});
		});

		it("ignores a message from any window but its own popup, and one with the wrong state", async () => {
			const auth = new _DiscovrAuth("my-client-id");
			const pending = auth.signInWithPopup();
			await popupReady();
			const state = authorizeUrl().searchParams.get("state");

			browser.message({ code: "forged", state }, { not: "the popup" });
			browser.message({ code: "forged", state: "wrong-state" });
			expect(redeemCalls()).toHaveLength(0);
			expect(browser.listenerCount()).toBe(1);

			browser.message({ code: "the-code", state });
			await expect(pending).resolves.toMatchObject({ refreshToken: "rt_redeemed" });
			expect(redeemCalls()).toHaveLength(1);
		});

		it("raises AuthCancelledError when the person presses Cancel", async () => {
			const auth = new _DiscovrAuth("my-client-id");
			const pending = auth.signInWithPopup();
			await popupReady();

			browser.message({
				error: "authorization-cancelled",
				state: authorizeUrl().searchParams.get("state"),
			});

			await expect(pending).rejects.toBeInstanceOf(AuthCancelledError);
			expect(redeemCalls()).toHaveLength(0);
		});

		it("raises AuthCancelledError when the window is closed without a message", async () => {
			jest.useFakeTimers();
			try {
				const auth = new _DiscovrAuth("my-client-id");
				const pending = auth.signInWithPopup();
				pending.catch(() => undefined);
				await jest.advanceTimersByTimeAsync(0);

				browser.popup.closed = true;
				await jest.advanceTimersByTimeAsync(1000);

				await expect(pending).rejects.toBeInstanceOf(AuthCancelledError);
			} finally {
				jest.useRealTimers();
			}
		});

		it("fails with the typed error when the sign-in reports one", async () => {
			const auth = new _DiscovrAuth("my-client-id");
			const pending = auth.signInWithPopup();
			await popupReady();

			browser.message({
				error: "client-not-found",
				state: authorizeUrl().searchParams.get("state"),
			});

			await expect(pending).rejects.toMatchObject({ name: "ClientNotFoundError" });
		});

		it("does not sign in if the code cannot be redeemed", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse({ error: "session-expired" }, false, 401));
			const auth = new _DiscovrAuth("my-client-id");
			const pending = auth.signInWithPopup();
			await popupReady();

			browser.message({ code: "stale", state: authorizeUrl().searchParams.get("state") });

			await expect(pending).rejects.toMatchObject({ name: "SessionExpiredError" });
			expect(auth.isSignedIn()).toBe(false);
		});

		it("says so when the browser blocks the window", async () => {
			browser.win.open.mockReturnValueOnce(null);

			await expect(new _DiscovrAuth("my-client-id").signInWithPopup()).rejects.toThrow(
				"Failed to open popup",
			);
		});

		it("never accepts a credential from the message, only a code", async () => {
			const auth = new _DiscovrAuth("my-client-id");
			const pending = auth.signInWithPopup().catch((e) => e);
			await popupReady();

			browser.message({
				refreshToken: "rt_smuggled",
				state: authorizeUrl().searchParams.get("state"),
			});

			expect(await pending).toMatchObject({ message: "Sign-in response missing code" });
			expect(auth.isSignedIn()).toBe(false);
		});
	});
});

/**
 * Snapshot carry-forward, and the gate that decides whether cached page data
 * survives a mint.
 *
 * None of this had a test. The mocks returned the removed `sessionId` field, so
 * `minted.snapshotId` was `undefined` in every case and the carry-forward branch
 * never ran — the suite passed identically whether the SDK read `snapshotId` or
 * reverted to `sessionId`, and a regression making every renewal start a fresh
 * snapshot would have shipped green.
 */
describe("_DiscovrAuth snapshot handling", () => {
	let fetchMock: jest.Mock;

	beforeEach(() => {
		fetchMock = jest.fn();
		global.fetch = fetchMock as unknown as typeof fetch;
	});

	function mintResponse(snapshotId: string): Response {
		return jsonResponse({
			sessionToken: "eyJabc",
			snapshotId,
			expiresAt: Math.floor(Date.now() / 1000) + 1800,
		});
	}

	function requestBodyAt(index: number): Record<string, unknown> {
		const [, init] = fetchMock.mock.calls[index] as [string, RequestInit];
		return JSON.parse(init.body as string) as Record<string, unknown>;
	}

	function signedInAuth(): _DiscovrAuth {
		const auth = new _DiscovrAuth("my-client-id");
		(auth as unknown as { refreshToken: string }).refreshToken = "rt_existing";
		return auth;
	}

	it("echoes the snapshot it holds back on the next mint for the same profile", async () => {
		fetchMock
			.mockResolvedValueOnce(mintResponse("snap1"))
			.mockResolvedValueOnce(mintResponse("snap1"));
		const auth = signedInAuth();

		await auth.selectProfile("profile-1");
		await auth.selectProfile("profile-1");

		// Second mint carries the snapshot the first one established.
		expect(requestBodyAt(1).snapshotId).toBe("snap1");
	});

	it("does not carry a snapshot across a profile switch", async () => {
		fetchMock
			.mockResolvedValueOnce(mintResponse("snap1"))
			.mockResolvedValueOnce(mintResponse("snap2"));
		const auth = signedInAuth();

		await auth.selectProfile("profile-1");
		await auth.selectProfile("profile-2");

		// The other profile's snapshot would be the wrong recommendations.
		expect(requestBodyAt(1).snapshotId).toBeUndefined();
	});

	it("never asks the server for a fresh snapshot", async () => {
		// Snapshots turn over on expiry and nothing else. On-demand refresh is a
		// paid capability, so the SDK must not carry a lever for it — this pins
		// that no mint body ever asks, on any path.
		fetchMock
			.mockResolvedValueOnce(mintResponse("snap1"))
			.mockResolvedValueOnce(mintResponse("snap2"));
		const auth = signedInAuth();

		await auth.selectProfile("profile-1");
		await auth.selectProfile("profile-2");

		expect(requestBodyAt(0).newSnapshot).toBeUndefined();
		expect(requestBodyAt(1).newSnapshot).toBeUndefined();
	});

	it("reports changed=false for a renewal that keeps the snapshot", async () => {
		fetchMock
			.mockResolvedValueOnce(mintResponse("snap1"))
			.mockResolvedValueOnce(mintResponse("snap1"));
		const auth = signedInAuth();
		const changes: boolean[] = [];
		auth._onSnapshotChange((changed) => changes.push(changed));

		await auth.selectProfile("profile-1");
		await auth.selectProfile("profile-1");

		// The whole point of the gate: a routine renewal must not be reported as a
		// turnover, or the client throws away page data that is still good — and,
		// because the mint happens inside the fetch that triggered it, rejects that
		// fetch's own successful result.
		expect(changes[changes.length - 1]).toBe(false);
	});

	it("reports changed=true when the snapshot actually moves", async () => {
		fetchMock
			.mockResolvedValueOnce(mintResponse("snap1"))
			.mockResolvedValueOnce(mintResponse("snap2"));
		const auth = signedInAuth();
		const changes: boolean[] = [];
		auth._onSnapshotChange((changed) => changes.push(changed));

		await auth.selectProfile("profile-1");
		await auth.selectProfile("profile-1");

		expect(changes[changes.length - 1]).toBe(true);
	});

	it("stops notifying after close()", async () => {
		fetchMock
			.mockResolvedValueOnce(mintResponse("snap1"))
			.mockResolvedValueOnce(mintResponse("snap2"));
		const auth = signedInAuth();
		const changes: boolean[] = [];
		auth._onSnapshotChange((changed) => changes.push(changed));

		await auth.selectProfile("profile-1");
		const before = changes.length;
		auth.close();
		await auth.selectProfile("profile-1");

		expect(changes.length).toBe(before);
	});

	/**
	 * `onRecommendationsChanged` is the public half of this channel.
	 *
	 * It exists so apps stop writing the `if (snapshotId === current) return`
	 * bookkeeping by hand against `onSessionRefreshed` — which fires on every
	 * credential renewal, and so needs filtering before it can answer "did the
	 * content move?".
	 */
	describe("onRecommendationsChanged", () => {
		it("does not fire on subscribe", () => {
			const auth = signedInAuth();
			const fired: number[] = [];
			auth.onRecommendationsChanged(() => fired.push(1));

			// It reports an event, not a state. Firing here would tell an app that
			// just rendered a page to immediately fetch it again.
			expect(fired).toHaveLength(0);
		});

		it("stays silent on a renewal that keeps the same recommendations", async () => {
			fetchMock
				.mockResolvedValueOnce(mintResponse("snap1"))
				.mockResolvedValueOnce(mintResponse("snap1"));
			const auth = signedInAuth();
			const fired: number[] = [];

			await auth.selectProfile("profile-1");
			auth.onRecommendationsChanged(() => fired.push(1));
			await auth.selectProfile("profile-1");

			expect(fired).toHaveLength(0);
		});

		it("fires once when the recommendations actually turn over", async () => {
			fetchMock
				.mockResolvedValueOnce(mintResponse("snap1"))
				.mockResolvedValueOnce(mintResponse("snap2"));
			const auth = signedInAuth();
			const fired: number[] = [];

			await auth.selectProfile("profile-1");
			auth.onRecommendationsChanged(() => fired.push(1));
			await auth.selectProfile("profile-1");

			expect(fired).toHaveLength(1);
		});

		it("stops firing after unsubscribe", async () => {
			fetchMock
				.mockResolvedValueOnce(mintResponse("snap1"))
				.mockResolvedValueOnce(mintResponse("snap2"));
			const auth = signedInAuth();
			const fired: number[] = [];

			await auth.selectProfile("profile-1");
			const unsubscribe = auth.onRecommendationsChanged(() => fired.push(1));
			unsubscribe();
			await auth.selectProfile("profile-1");

			expect(fired).toHaveLength(0);
		});
	});
});

/**
 * Rate limits.
 *
 * Both tiers previously fell through to an untyped error, so an app had no way
 * to tell "you're going too fast, wait ~14s" from "something broke" — and the
 * default retry policy would fire again into the same closed window.
 */
describe("_DiscovrAuth rate limiting", () => {
	let fetchMock: jest.Mock;

	beforeEach(() => {
		fetchMock = jest.fn();
		global.fetch = fetchMock as unknown as typeof fetch;
	});

	function rateLimited(retryAfter?: string): Response {
		return {
			ok: false,
			status: 429,
			headers: new Headers(retryAfter ? { "Retry-After": retryAfter } : {}),
			json: async () => ({ error: "RATE_LIMITED", retryAfterSeconds: Number(retryAfter) }),
			text: async () => JSON.stringify({ error: "RATE_LIMITED" }),
			clone() {
				return rateLimited(retryAfter);
			},
		} as unknown as Response;
	}

	it("throws a typed error carrying the wait, on the identity tier", async () => {
		fetchMock.mockResolvedValueOnce(rateLimited("14"));
		const auth = new _DiscovrAuth("my-client-id");
		(auth as unknown as { refreshToken: string }).refreshToken = "rt_existing";

		await expect(auth.selectProfile("profile-1")).rejects.toMatchObject({
			name: "RateLimitedError",
			retryInSeconds: 14,
		});
	});

	it("throws a typed error on the session tier", async () => {
		const auth = new _DiscovrAuth("my-client-id");
		(auth as unknown as { refreshToken: string }).refreshToken = "rt_existing";

		const handleSessionResponse = (
			auth as unknown as {
				handleSessionResponse: (context: {
					response: Response;
					init: RequestInit;
					url: string;
				}) => Promise<Response | undefined>;
			}
		).handleSessionResponse.bind(auth);

		await expect(
			handleSessionResponse({
				response: rateLimited("30"),
				init: { method: "GET" },
				url: "https://api.discovr.media/pages/abc/rows",
			}),
		).rejects.toMatchObject({ name: "RateLimitedError", retryInSeconds: 30 });
	});

	it("falls back to the window length when Retry-After is missing or junk", async () => {
		const auth = new _DiscovrAuth("my-client-id");
		(auth as unknown as { refreshToken: string }).refreshToken = "rt_existing";
		const handleSessionResponse = (
			auth as unknown as {
				handleSessionResponse: (c: {
					response: Response;
					init: RequestInit;
					url: string;
				}) => Promise<Response | undefined>;
			}
		).handleSessionResponse.bind(auth);

		// `1e9` is the one that mattered: `Number("1e9")` is finite and positive, so
		// a naive check accepted it and produced a ~31-year wait. Kotlin and Swift
		// both rejected it, so this was a TypeScript-only divergence on a
		// network-controlled value.
		for (const header of [undefined, "not-a-number", "0", "-5", "1e9"]) {
			await expect(
				handleSessionResponse({
					response: rateLimited(header),
					init: { method: "GET" },
					url: "https://api.discovr.media/pages/abc/rows",
				}),
			).rejects.toMatchObject({ retryInSeconds: 60 });
		}
	});

	it("clamps an absurd Retry-After rather than scheduling a decades-long wait", async () => {
		// A limit window is a minute. Apps surface this number and schedule
		// back-offs on it, so a server bug (or a hostile proxy) must not be able to
		// park a client for years.
		const auth = new _DiscovrAuth("my-client-id");
		(auth as unknown as { refreshToken: string }).refreshToken = "rt_existing";
		const handleSessionResponse = (
			auth as unknown as {
				handleSessionResponse: (c: {
					response: Response;
					init: RequestInit;
					url: string;
				}) => Promise<Response | undefined>;
			}
		).handleSessionResponse.bind(auth);

		await expect(
			handleSessionResponse({
				response: rateLimited("2000000000"),
				init: { method: "GET" },
				url: "https://api.discovr.media/pages/abc/rows",
			}),
		).rejects.toMatchObject({ retryInSeconds: 300 });
	});

	it("does not sign the user out — a limit is not an auth failure", async () => {
		fetchMock.mockResolvedValueOnce(rateLimited("10"));
		const auth = new _DiscovrAuth("my-client-id");
		(auth as unknown as { refreshToken: string }).refreshToken = "rt_existing";

		await expect(auth.selectProfile("profile-1")).rejects.toThrow();
		expect(auth.isSignedIn()).toBe(true);
	});
});

describe("apiErrorFor", () => {
	const mapped = (code: string, status = 400) =>
		apiErrorFor(status, JSON.stringify({ error: code }));

	it("maps server codes to the SDK's typed errors", () => {
		expect(mapped("client-not-found").name).toBe("ClientNotFoundError");
		expect(mapped("CLIENT_NOT_FOUND").name).toBe("ClientNotFoundError");
		expect(mapped("MISSING_CLIENT_ID").name).toBe("ClientNotFoundError");
		expect(mapped("device-code-expired", 401).name).toBe("DeviceCodeExpiredError");
		expect(mapped("device-code-not-found", 404).name).toBe("DeviceCodeExpiredError");
		expect(mapped("device-code-already-consumed", 401).name).toBe("DeviceCodeConsumedError");
		expect(mapped("device-code-denied", 401).name).toBe("DeviceCodeDeniedError");
		expect(mapped("authorization-cancelled", 400).name).toBe("AuthCancelledError");
		expect(mapped("session-expired", 401).name).toBe("SessionExpiredError");
		expect(mapped("session-already-consumed", 401).name).toBe("SessionConsumedError");
		expect(mapped("token-invalid", 401).name).toBe("TokenInvalidError");
		expect(mapped("TOKEN_INVALID", 401).name).toBe("TokenInvalidError");
		expect(mapped("client-mismatch", 403).name).toBe("TokenInvalidError");
	});

	it("does not echo an unknown machine code", () => {
		const e = mapped("some-new-server-code", 409);
		expect(e.message).toBe("Request failed (HTTP 409)");
		expect(e.message).not.toContain("some-new-server-code");
	});

	it("passes prose messages through", () => {
		expect(apiErrorFor(404, JSON.stringify({ error: "Resource not found" })).message).toBe(
			"Resource not found",
		);
	});

	it("survives an unparseable body", () => {
		expect(apiErrorFor(502, "<html>bad gateway</html>").message).toBe("Request failed (HTTP 502)");
	});
});

describe("retry hint from the response body", () => {
	function limited(body: unknown, header?: string): Response {
		const text = JSON.stringify(body);
		return {
			ok: false,
			status: 429,
			headers: new Headers(header ? { "Retry-After": header } : {}),
			json: async () => body,
			text: async () => text,
			clone() {
				return limited(body, header);
			},
		} as unknown as Response;
	}

	async function throwOn(response: Response) {
		const auth = new _DiscovrAuth("my-client-id");
		(auth as unknown as { refreshToken: string }).refreshToken = "rt_existing";
		const handle = (
			auth as unknown as {
				handleSessionResponse: (c: {
					response: Response;
					init: RequestInit;
					url: string;
				}) => Promise<Response | undefined>;
			}
		).handleSessionResponse.bind(auth);
		return handle({ response, init: { method: "GET" }, url: "https://api.discovr.media/pages" });
	}

	it("reads retryAfterSeconds when there is no header", async () => {
		await expect(
			throwOn(limited({ error: "RATE_LIMITED", retryAfterSeconds: 14 })),
		).rejects.toMatchObject({ retryInSeconds: 14 });
	});

	it("prefers the header over the body", async () => {
		await expect(throwOn(limited({ retryAfterSeconds: 99 }, "7"))).rejects.toMatchObject({
			retryInSeconds: 7,
		});
	});
});

/**
 * A credential that lapses mid-session, and what the client says about it.
 *
 * Only the SDK's own requests used to recover from a refresh-token 401. A call
 * made through the generated identity client (`getProfiles`, the session list)
 * got a bare 401 back while the client went on reporting itself signed in, so a
 * demo sandbox that lapsed looked like a random failure on whichever call came
 * first.
 */
describe("_DiscovrAuth lapsed credential", () => {
	let fetchMock: jest.Mock;
	let calls: string[];

	function res(status: number, body: unknown): Response {
		return {
			ok: status >= 200 && status < 300,
			status,
			headers: new Headers({ "content-type": "application/json" }),
			json: async () => body,
			text: async () => JSON.stringify(body),
			clone() {
				return res(status, body);
			},
		} as unknown as Response;
	}

	const refreshExpired = { error: "TOKEN_EXPIRED", tokenKind: "refresh" };

	beforeEach(() => {
		calls = [];
		fetchMock = jest.fn(async (url: string, init?: RequestInit) => {
			const path = new URL(url).pathname;
			calls.push(`${init?.method ?? "GET"} ${path}`);
			if (path === "/auth/demo-session") {
				return res(201, { refreshToken: "rt_demo", expiresAt: 123 });
			}
			if (path === "/auth/session") return res(200, {}); // best-effort revoke
			// Everything else is a call made with the credential that has lapsed.
			return res(401, refreshExpired);
		});
		global.fetch = fetchMock as unknown as typeof fetch;
	});

	function states(auth: _DiscovrAuth): Array<{ signedIn: boolean; reason: string | null }> {
		const seen: Array<{ signedIn: boolean; reason: string | null }> = [];
		auth.onAuthStateChanged((s) => seen.push({ signedIn: s.signedIn, reason: s.signOutReason }));
		return seen;
	}

	it("a demo sandbox that lapsed on an identity call signs the client out as demo-ended", async () => {
		const auth = new _DiscovrAuth("my-client-id");
		await auth.signInWithDemo();
		const seen = states(auth);

		await expect(auth.identityApi().getProfiles()).rejects.toMatchObject({
			name: "TokenInvalidError",
		});

		expect(auth.isSignedIn()).toBe(false);
		expect(seen[seen.length - 1]).toEqual({ signedIn: false, reason: "demo-ended" });
	});

	it("a real account's lapsed credential is session-expired, not demo-ended", async () => {
		const auth = new _DiscovrAuth("my-client-id");
		(auth as unknown as { refreshToken: string }).refreshToken = "rt_real";
		const seen = states(auth);

		await expect(auth.identityApi().getProfiles()).rejects.toMatchObject({
			name: "TokenInvalidError",
		});

		expect(seen[seen.length - 1]).toEqual({ signedIn: false, reason: "session-expired" });
	});

	it("an unreadable 401 is treated as a lapse too, not left half signed in", async () => {
		fetchMock.mockImplementation(async (url: string) => {
			if (new URL(url).pathname === "/auth/session") return res(200, {});
			return {
				...res(401, {}),
				json: async () => {
					throw new Error("<html>blocked</html>");
				},
				clone() {
					return this;
				},
			} as unknown as Response;
		});
		const auth = new _DiscovrAuth("my-client-id");
		(auth as unknown as { refreshToken: string }).refreshToken = "rt_real";

		await expect(auth.identityApi().getProfiles()).rejects.toMatchObject({
			name: "TokenInvalidError",
		});
		expect(auth.isSignedIn()).toBe(false);
	});

	it("leaves a 401 that is not about the refresh token alone", async () => {
		fetchMock.mockImplementation(async () => res(401, { error: "TOKEN_INVALID" }));
		const auth = new _DiscovrAuth("my-client-id");
		(auth as unknown as { refreshToken: string }).refreshToken = "rt_real";

		await expect(auth.identityApi().getProfiles()).rejects.not.toMatchObject({
			name: "TokenInvalidError",
		});
		expect(auth.isSignedIn()).toBe(true);
	});

	it("reports an explicit signOut() as user, and signing in again clears the reason", async () => {
		const auth = new _DiscovrAuth("my-client-id");
		await auth.signInWithDemo();
		const seen = states(auth);

		await auth.signOut();
		expect(seen[seen.length - 1]).toEqual({ signedIn: false, reason: "user" });

		await auth.signInWithDemo();
		expect(seen[seen.length - 1]).toEqual({ signedIn: true, reason: null });
	});

	it("starts with no reason, since nothing has been signed out yet", () => {
		const seen = states(new _DiscovrAuth("my-client-id"));
		expect(seen).toEqual([{ signedIn: false, reason: null }]);
	});

	it("does not quietly start another sandbox after a demo-mode client lapses", async () => {
		const auth = new _DiscovrAuth("my-client-id", { demoMode: true });
		await auth.signInWithDemo();
		await expect(auth.identityApi().getProfiles()).rejects.toMatchObject({
			name: "TokenInvalidError",
		});
		const demoSessionsBefore = calls.filter((c) => c === "POST /auth/demo-session").length;

		// The next use reports the lapse instead of spending another of the
		// caller's five hourly sandboxes without telling the app.
		await expect(auth.selectProfile("profile-1")).rejects.toMatchObject({
			name: "NotSignedInError",
		});
		expect(calls.filter((c) => c === "POST /auth/demo-session")).toHaveLength(demoSessionsBefore);

		// An explicit sign-in is what starts the next one.
		await auth.signInWithDemo();
		expect(auth.isSignedIn()).toBe(true);
	});

	it("still provisions a sandbox on first use for a demo-mode client", async () => {
		const auth = new _DiscovrAuth("my-client-id", { demoMode: true });
		fetchMock.mockImplementation(async (url: string) =>
			new URL(url).pathname === "/auth/demo-session"
				? res(201, { refreshToken: "rt_demo", expiresAt: 123 })
				: res(200, { sessionToken: "eyJabc", snapshotId: "s1", expiresAt: 9_999_999_999 }),
		);

		await auth.selectProfile("profile-1");

		expect(auth.isSignedIn()).toBe(true);
	});

	describe("across a relaunch", () => {
		let store: Map<string, string>;

		beforeEach(() => {
			store = new Map();
			(globalThis as unknown as { localStorage: Storage }).localStorage = {
				getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
				setItem: (k: string, v: string) => {
					store.set(k, v);
				},
				removeItem: (k: string) => {
					store.delete(k);
				},
			} as unknown as Storage;
		});

		afterEach(() => {
			delete (globalThis as unknown as { localStorage?: unknown }).localStorage;
		});

		it("remembers that the credential belongs to a demo sandbox", async () => {
			const first = new _DiscovrAuth("my-client-id");
			await first.signInWithDemo();

			// A new client over the same storage, as after an app relaunch. It is
			// not a demo-mode client, so only the stored flag can tell it.
			const relaunched = new _DiscovrAuth("my-client-id");
			const seen = states(relaunched);
			await expect(relaunched.identityApi().getProfiles()).rejects.toMatchObject({
				name: "TokenInvalidError",
			});

			expect(seen[seen.length - 1]).toEqual({ signedIn: false, reason: "demo-ended" });
		});
	});
});

/**
 * Whether the selected profile survives a relaunch.
 *
 * It does not by default, like a streaming app: the user stays signed in and
 * picks who's watching again. `rememberProfile: true` resumes instead.
 */
describe("_DiscovrAuth rememberProfile", () => {
	let store: Map<string, string>;

	beforeEach(() => {
		store = new Map();
		(globalThis as unknown as { localStorage: Storage }).localStorage = {
			getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
			setItem: (k: string, v: string) => {
				store.set(k, v);
			},
			removeItem: (k: string) => {
				store.delete(k);
			},
		} as unknown as Storage;
		global.fetch = jest.fn(async () =>
			jsonResponse({
				sessionToken: "eyJabc",
				snapshotId: "snap1",
				expiresAt: Math.floor(Date.now() / 1000) + 1800,
			}),
		) as unknown as typeof fetch;
	});

	afterEach(() => {
		delete (globalThis as unknown as { localStorage?: unknown }).localStorage;
	});

	async function selectedProfileOn(
		config: ConstructorParameters<typeof _DiscovrAuth>[1],
	): Promise<void> {
		const first = new _DiscovrAuth("my-client-id", config);
		(first as unknown as { refreshToken: string }).refreshToken = "rt_existing";
		await first.selectProfile("profile-1");
		expect(first.getActiveProfileId()).toBe("profile-1");
	}

	function relaunch(config: ConstructorParameters<typeof _DiscovrAuth>[1]) {
		const states: Array<{ signedIn: boolean; profileId: string | null }> = [];
		const client = new _DiscovrAuth("my-client-id", config);
		client.onAuthStateChanged((s) => states.push({ signedIn: s.signedIn, profileId: s.profileId }));
		return { client, states };
	}

	it("does not resume the profile by default: still signed in, no profile", async () => {
		await selectedProfileOn({});

		const { client, states } = relaunch({});

		expect(states).toEqual([{ signedIn: true, profileId: null }]);
		expect(client.hasActiveProfile()).toBe(false);
	});

	it("stores only the credential by default", async () => {
		await selectedProfileOn({});

		const stored = JSON.parse(store.get("discovr_session")!) as Record<string, unknown>;
		expect(stored.refreshToken).toBe("rt_existing");
		expect(stored.activeProfileId).toBeNull();
		expect(stored.sessionToken).toBeNull();
		expect(stored.snapshotId).toBeNull();
	});

	it("resumes the profile when rememberProfile is true", async () => {
		await selectedProfileOn({ rememberProfile: true });

		const { client, states } = relaunch({ rememberProfile: true });

		expect(states).toEqual([{ signedIn: true, profileId: "profile-1" }]);
		expect(client.getActiveProfileId()).toBe("profile-1");
	});

	it("drops a profile an earlier run stored, and clears it from storage on the next write", async () => {
		await selectedProfileOn({ rememberProfile: true });

		// The same storage, opened by a client that no longer remembers.
		const { client, states } = relaunch({});
		expect(states).toEqual([{ signedIn: true, profileId: null }]);

		await client.selectProfile("profile-2");
		const stored = JSON.parse(store.get("discovr_session")!) as Record<string, unknown>;
		expect(stored.activeProfileId).toBeNull();
	});

	it("keeps the profile chosen in this run when another tab writes the shared credential", async () => {
		const first = new _DiscovrAuth("my-client-id", {});
		(first as unknown as { refreshToken: string }).refreshToken = "rt_existing";
		await first.selectProfile("profile-1");

		// What the cross-tab `storage` listener does: re-read storage.
		(first as unknown as { restore: () => void }).restore();

		expect(first.getActiveProfileId()).toBe("profile-1");
	});

	it("drops the profile chosen in this run when another tab signs out", async () => {
		const first = new _DiscovrAuth("my-client-id", {});
		(first as unknown as { refreshToken: string }).refreshToken = "rt_existing";
		await first.selectProfile("profile-1");

		store.clear(); // another tab signed out
		(first as unknown as { restore: () => void }).restore();

		expect(first.getActiveProfileId()).toBeNull();
		expect(first.isSignedIn()).toBe(false);
	});
});

describe("_DiscovrAuth device-code sign-in", () => {
	let fetchMock: jest.Mock;

	beforeEach(() => {
		fetchMock = jest.fn();
		// The first call starts the flow; the background poll that follows never answers,
		// so a test ends the flow itself with `unsubscribe()`.
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				deviceCode: "dvc_1",
				userCode: "1234",
				authQRCode: "data:image/png;base64,AAAA",
				verificationUrl: "https://discovr.media/tv-auth",
				expiresIn: 600000,
				interval: 5,
			}),
		);
		fetchMock.mockReturnValue(new Promise(() => {}));
		global.fetch = fetchMock as unknown as typeof fetch;
	});

	const startRequestUrl = () => (fetchMock.mock.calls[0] as [string])[0];

	it("returns the verification URL next to the code", async () => {
		const auth = new _DiscovrAuth("my-client-id");

		const result = await auth.signInWithDeviceCode();
		result.unsubscribe();

		expect(result).toMatchObject({
			deviceCode: "dvc_1",
			userCode: "1234",
			qrCode: "data:image/png;base64,AAAA",
			verificationUrl: "https://discovr.media/tv-auth",
			expiresIn: 600000,
		});
	});

	it("asks for the server's default QR size unless told otherwise", async () => {
		const auth = new _DiscovrAuth("my-client-id");

		(await auth.signInWithDeviceCode()).unsubscribe();

		expect(startRequestUrl()).toMatch(/\/auth\/device-codes$/);
	});

	it("passes a requested QR size through, clamped to what the server accepts", async () => {
		expect(deviceCodePath(700)).toBe("/auth/device-codes?size=700");
		expect(deviceCodePath(50)).toBe("/auth/device-codes?size=100");
		expect(deviceCodePath(5000)).toBe("/auth/device-codes?size=1000");
		expect(deviceCodePath(Number.NaN)).toBe("/auth/device-codes");

		const auth = new _DiscovrAuth("my-client-id");
		(await auth.signInWithDeviceCode({ qrSize: 700 })).unsubscribe();

		expect(startRequestUrl()).toMatch(/\/auth\/device-codes\?size=700$/);
	});

	describe("the poll loop", () => {
		const pollUrl = "/auth/device-codes/dvc_1/poll";
		const polls = () =>
			fetchMock.mock.calls.filter(([url]: [string]) => url.endsWith(pollUrl)).length;

		beforeEach(() => {
			jest.useFakeTimers();
			fetchMock.mockReset();
			fetchMock.mockResolvedValueOnce(
				jsonResponse({
					deviceCode: "dvc_1",
					userCode: "1234",
					authQRCode: "data:image/png;base64,AAAA",
					verificationUrl: "https://discovr.media/tv-auth",
					expiresIn: 600000,
					interval: 5,
				}),
			);
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it("waits the server's interval before the first poll, then follows it as it grows", async () => {
			fetchMock
				.mockResolvedValueOnce(jsonResponse({ status: "pending", interval: 10 }))
				.mockResolvedValue(jsonResponse({ status: "pending", interval: 10 }));
			const result = await new _DiscovrAuth("my-client-id").signInWithDeviceCode();

			await jest.advanceTimersByTimeAsync(4_999);
			expect(polls()).toBe(0);
			await jest.advanceTimersByTimeAsync(1);
			expect(polls()).toBe(1);

			// The first pending answer raised the interval to 10 s.
			await jest.advanceTimersByTimeAsync(9_999);
			expect(polls()).toBe(1);
			await jest.advanceTimersByTimeAsync(1);
			expect(polls()).toBe(2);

			result.unsubscribe();
		});

		it("sends the same well-formed device id on every poll", async () => {
			fetchMock.mockResolvedValue(jsonResponse({ status: "pending", interval: 5 }));
			const result = await new _DiscovrAuth("my-client-id").signInWithDeviceCode();

			await jest.advanceTimersByTimeAsync(5_000);
			await jest.advanceTimersByTimeAsync(5_000);

			const bodies = fetchMock.mock.calls
				.filter(([url]: [string]) => url.endsWith(pollUrl))
				.map(([, init]: [string, { body: string }]) => JSON.parse(init.body));
			expect(bodies).toHaveLength(2);
			expect(bodies[0].deviceId).toMatch(/^[0-9a-f]{32}$/);
			expect(bodies[1].deviceId).toBe(bodies[0].deviceId);

			result.unsubscribe();
		});

		it("signs in and settles `completion` with the credential when the person approves", async () => {
			fetchMock.mockResolvedValueOnce(
				jsonResponse({ refreshToken: "rt_new", publicId: "pub_1", expiresAt: 99 }),
			);
			const auth = new _DiscovrAuth("my-client-id");
			const result = await auth.signInWithDeviceCode();

			await jest.advanceTimersByTimeAsync(5_000);

			await expect(result.completion).resolves.toEqual({
				refreshToken: "rt_new",
				publicId: "pub_1",
				expiresAt: 99,
			});
			expect(auth.isSignedIn()).toBe(true);
			// And it stopped.
			await jest.advanceTimersByTimeAsync(60_000);
			expect(polls()).toBe(1);
		});

		it("ends the wait with DeviceCodeDeniedError the moment the person declines", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse({ error: "device-code-denied" }, false, 401));
			const result = await new _DiscovrAuth("my-client-id").signInWithDeviceCode();

			await jest.advanceTimersByTimeAsync(5_000);

			await expect(result.completion).rejects.toBeInstanceOf(DeviceCodeDeniedError);
			await jest.advanceTimersByTimeAsync(60_000);
			expect(polls()).toBe(1);
		});

		it("ends with DeviceCodeExpiredError when the server says the code is gone", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse({ error: "device-code-expired" }, false, 401));
			const result = await new _DiscovrAuth("my-client-id").signInWithDeviceCode();

			await jest.advanceTimersByTimeAsync(5_000);

			await expect(result.completion).rejects.toBeInstanceOf(DeviceCodeExpiredError);
		});

		it("ends with DeviceCodeExpiredError when the code's own lifetime passes", async () => {
			fetchMock.mockResolvedValue(jsonResponse({ status: "pending", interval: 5 }));
			const result = await new _DiscovrAuth("my-client-id").signInWithDeviceCode();

			await jest.advanceTimersByTimeAsync(600_000 + 5_000);

			await expect(result.completion).rejects.toBeInstanceOf(DeviceCodeExpiredError);
		});

		it("rejects `completion` with AuthCancelledError on unsubscribe, and stops polling", async () => {
			fetchMock.mockResolvedValue(jsonResponse({ status: "pending", interval: 5 }));
			const result = await new _DiscovrAuth("my-client-id").signInWithDeviceCode();
			await jest.advanceTimersByTimeAsync(5_000);
			expect(polls()).toBe(1);

			result.unsubscribe();
			result.unsubscribe(); // safe twice

			await expect(result.completion).rejects.toBeInstanceOf(AuthCancelledError);
			await jest.advanceTimersByTimeAsync(60_000);
			expect(polls()).toBe(1);
		});

		it("does not accept a credential that arrives after unsubscribe", async () => {
			let answer!: (r: Response) => void;
			fetchMock.mockReturnValueOnce(new Promise<Response>((resolve) => (answer = resolve)));
			const auth = new _DiscovrAuth("my-client-id");
			const result = await auth.signInWithDeviceCode();
			await jest.advanceTimersByTimeAsync(5_000);

			result.unsubscribe();
			answer(jsonResponse({ refreshToken: "rt_late", publicId: "p", expiresAt: 1 }));
			await jest.advanceTimersByTimeAsync(0);

			expect(auth.isSignedIn()).toBe(false);
		});

		it("backs off by the retry window when told to slow down, not by its own interval", async () => {
			fetchMock
				.mockResolvedValueOnce(
					jsonResponse({ error: "RATE_LIMITED", retryAfterSeconds: 30 }, false, 429),
				)
				.mockResolvedValue(jsonResponse({ status: "pending", interval: 5 }));
			const result = await new _DiscovrAuth("my-client-id").signInWithDeviceCode();

			await jest.advanceTimersByTimeAsync(5_000);
			expect(polls()).toBe(1);
			await jest.advanceTimersByTimeAsync(29_999);
			expect(polls()).toBe(1);
			await jest.advanceTimersByTimeAsync(1);
			expect(polls()).toBe(2);

			result.unsubscribe();
		});

		it("falls back to a safe pace when the server did not send an interval", async () => {
			fetchMock.mockReset();
			fetchMock.mockResolvedValueOnce(
				jsonResponse({ deviceCode: "dvc_1", userCode: "1234", expiresIn: 600000 }),
			);
			fetchMock.mockResolvedValue(jsonResponse({ status: "pending" }));
			const result = await new _DiscovrAuth("my-client-id").signInWithDeviceCode();

			await jest.advanceTimersByTimeAsync(4_999);
			expect(polls()).toBe(0);
			await jest.advanceTimersByTimeAsync(1);
			expect(polls()).toBe(1);

			result.unsubscribe();
		});

		it("does not turn an ignored declined flow into an unhandled rejection", async () => {
			const unhandled = jest.fn();
			process.on("unhandledRejection", unhandled);
			try {
				fetchMock.mockResolvedValueOnce(jsonResponse({ error: "device-code-denied" }, false, 401));
				await new _DiscovrAuth("my-client-id").signInWithDeviceCode();

				await jest.advanceTimersByTimeAsync(5_000);
				jest.useRealTimers();
				await new Promise((resolve) => setImmediate(resolve));

				expect(unhandled).not.toHaveBeenCalled();
			} finally {
				process.off("unhandledRejection", unhandled);
			}
		});
	});
});
