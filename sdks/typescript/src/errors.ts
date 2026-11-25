/* tslint:disable */

/**
 * Typed error hierarchy for the Discovr SDK.
 *
 * All errors extend `DiscovrError`, which carries the raw machine-readable
 * `code` string from the API response alongside the human-readable `message`.
 * Use `instanceof` checks to branch on specific conditions:
 *
 * ```typescript
 * try {
 *   await auth.signInWithDeviceCode();
 * } catch (err) {
 *   if (err instanceof DeviceCodeExpiredError) { ... }
 *   if (err instanceof DiscovrError) { console.error(err.code); }
 * }
 * ```
 */

export class DiscovrError extends Error {
	constructor(
		public readonly code: string,
		message: string,
	) {
		super(message);
		this.name = "DiscovrError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/** The auth session (web flow) has expired. Start the flow again. */
export class SessionExpiredError extends DiscovrError {
	constructor(message = "Authentication session expired") {
		super("session-expired", message);
		this.name = "SessionExpiredError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/** The auth session was already used to issue a token. */
export class SessionConsumedError extends DiscovrError {
	constructor(message = "Authentication session already consumed") {
		super("session-already-consumed", message);
		this.name = "SessionConsumedError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/** The clientID provided is not registered. */
export class ClientNotFoundError extends DiscovrError {
	constructor(message = "Client not found") {
		super("client-not-found", message);
		this.name = "ClientNotFoundError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/** The device code TTL has passed. Start a new device-code flow. */
export class DeviceCodeExpiredError extends DiscovrError {
	constructor(message = "Device code expired") {
		super("device-code-expired", message);
		this.name = "DeviceCodeExpiredError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/** The device code was already exchanged for a token. */
export class DeviceCodeConsumedError extends DiscovrError {
	constructor(message = "Device code already consumed") {
		super("device-code-already-consumed", message);
		this.name = "DeviceCodeConsumedError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/**
 * The person looking at the sign-in screen on their phone declined the device.
 * The flow is over; show that, and offer to start a new one.
 */
export class DeviceCodeDeniedError extends DiscovrError {
	constructor(message = "Device sign-in was declined") {
		super("device-code-denied", message);
		this.name = "DeviceCodeDeniedError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/**
 * A sign-in flow ended because the person (or your code) chose to stop it, not
 * because anything went wrong: they closed the sign-in window, pressed Cancel, or
 * you stopped a device-code flow with `unsubscribe()`. Usually the right response
 * is to say nothing.
 */
export class AuthCancelledError extends DiscovrError {
	constructor(message = "Sign-in was cancelled") {
		super("authorization-cancelled", message);
		this.name = "AuthCancelledError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/** The refresh token or session token was rejected. */
export class TokenInvalidError extends DiscovrError {
	constructor(message = "Token invalid") {
		super("token-invalid", message);
		this.name = "TokenInvalidError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/** The account authenticated, and is still on the waitlist (403). */
export class AccessNotGrantedError extends DiscovrError {
	constructor(message = "Account access has not been granted yet") {
		super("access-not-granted", message);
		this.name = "AccessNotGrantedError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/** The account authenticated, and must accept the latest Terms to continue (403). */
export class LegalAcceptanceRequiredError extends DiscovrError {
	constructor(message = "Please accept the latest Terms to continue") {
		super("legal-acceptance-required", message);
		this.name = "LegalAcceptanceRequiredError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/** The requested profile does not exist under the signed-in account (403). */
export class ProfileNotFoundError extends DiscovrError {
	constructor(message = "Profile not found") {
		super("profile-not-found", message);
		this.name = "ProfileNotFoundError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/**
 * The pagination cursor or row reference points at a set of results that has
 * since been replaced (409). Reload the page with no token on the same page id.
 */
export class CursorExpiredError extends DiscovrError {
	constructor(message = "Pagination cursor expired") {
		super("cursor-expired", message);
		this.name = "CursorExpiredError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/** Called an auth-required method before signing in. */
export class NotSignedInError extends DiscovrError {
	constructor(message = "Not signed in") {
		super("not-signed-in", message);
		this.name = "NotSignedInError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/** Called a profile-scoped method before choosing a profile. */
export class NoProfileSelectedError extends DiscovrError {
	constructor(message = "No profile selected — call selectProfile() first.") {
		super("no-profile-selected", message);
		this.name = "NoProfileSelectedError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/**
 * A request to the auth/session endpoints didn't complete within the
 * configured timeout. Wraps the platform's raw `AbortError` `DOMException` so
 * callers can catch a stable, documented type instead of checking
 * `err.name === "AbortError"` — mirrors Kotlin's `TimeoutCancellationException`
 * and Swift's `URLError.timedOut` for the same underlying condition.
 */
export class AuthTimeoutError extends DiscovrError {
	constructor(message = "Request timed out") {
		super("request-timeout", message);
		this.name = "AuthTimeoutError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/**
 * Thrown when the client-side loop guard blocks a request because call volume
 * looks like an unintentional loop.
 *
 * Distinct from a server `429`: this request never left the process. Seeing it
 * means the fix is in your own code — an effect re-firing, or a retry without
 * backoff — not a server quota you need to wait out.
 */
export class RequestLoopError extends DiscovrError {
	/** Roughly how long until requests are allowed again, in seconds. */
	public readonly retryInSeconds: number;

	constructor(message: string, retryInSeconds: number) {
		super("request-loop-detected", message);
		this.name = "RequestLoopError";
		this.retryInSeconds = retryInSeconds;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/**
 * Thrown when Discovr rate-limited the request.
 *
 * The counterpart to {@link RequestLoopError}: that one means your own code
 * looped and the request never left the process, this one means the request
 * arrived and the server declined it. Both carry the same `retryInSeconds` so a
 * back-off path can treat them alike.
 *
 * The SDK deliberately does **not** wait and retry for you. Limits are per
 * minute, so an automatic retry either blocks your UI for most of a minute or
 * fires again into a closed window and makes the situation worse. You know
 * whether the call was a user tapping something (tell them, and let them try
 * again) or a background prefetch (drop it).
 */
export class RateLimitedError extends DiscovrError {
	/** Seconds until the current limit window rolls over. */
	public readonly retryInSeconds: number;

	constructor(message: string, retryInSeconds: number) {
		super("rate-limited", message);
		this.name = "RateLimitedError";
		this.retryInSeconds = retryInSeconds;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/**
 * Map a server error code to the SDK's own typed error.
 *
 * The switch below is generated from `ApiErrorCode` in the OpenAPI spec by
 * `emit-error-tables.ts`. Do not edit between the generated markers by hand.
 */
export function mapApiErrorCode(
	code: string,
	message?: string,
	retryInSeconds?: number,
): DiscovrError {
	switch (code) {
		// <generated:error-table>
		case "client-not-found":
			return new ClientNotFoundError(message);
		case "device-code-expired":
		case "device-code-not-found":
			return new DeviceCodeExpiredError(message);
		case "device-code-already-consumed":
			return new DeviceCodeConsumedError(message);
		case "device-code-denied":
			return new DeviceCodeDeniedError(message);
		case "authorization-cancelled":
			return new AuthCancelledError(message);
		case "session-expired":
		case "session-not-found":
			return new SessionExpiredError(message);
		case "session-already-consumed":
			return new SessionConsumedError(message);
		case "token-invalid":
		case "token-expired":
		case "wrong-token-kind":
		case "client-mismatch":
		case "code-verifier-invalid":
			return new TokenInvalidError(message);
		case "access-not-granted":
			return new AccessNotGrantedError(message);
		case "legal-acceptance-required":
			return new LegalAcceptanceRequiredError(message);
		case "profile-not-found":
			return new ProfileNotFoundError(message);
		case "cursor-expired":
			return new CursorExpiredError(message);
		case "rate-limited":
			return new RateLimitedError(
				message ?? "Too many requests — slow down and try again shortly.",
				retryInSeconds ?? 60,
			);
		// </generated:error-table>
		default:
			return new DiscovrError("unknown-error", message ?? "Request failed");
	}
}

const MACHINE_CODE = /^[A-Za-z0-9_-]+$/;

/**
 * Translate a non-2xx response into a typed error. The server names failures in
 * the body's `error` field (a kebab-case code) with an optional `message`
 * detail; unknown machine codes are never echoed as user messages.
 */
export function apiErrorFor(status: number, body: string, retryInSeconds?: number): DiscovrError {
	let code: string | undefined;
	let message: string | undefined;
	let bodyRetry: number | undefined;
	try {
		const parsed = JSON.parse(body) as {
			error?: unknown;
			message?: unknown;
			retryAfterSeconds?: unknown;
		};
		if (typeof parsed.error === "string") code = parsed.error;
		if (typeof parsed.message === "string" && parsed.message.length > 0) message = parsed.message;
		if (typeof parsed.retryAfterSeconds === "number" && parsed.retryAfterSeconds > 0) {
			bodyRetry = Math.min(Math.floor(parsed.retryAfterSeconds), 300);
		}
	} catch {
		// An unparseable body (e.g. an HTML block page) has no code to read.
	}
	const wait = retryInSeconds ?? bodyRetry;
	if (status === 429) {
		return new RateLimitedError(
			message ?? "Too many requests — slow down and try again shortly.",
			wait ?? 60,
		);
	}
	if (code !== undefined) {
		const mapped = mapApiErrorCode(code, message, wait);
		if (mapped.code !== "unknown-error") return mapped;
		if (message !== undefined) return new DiscovrError("unknown-error", message);
		if (!MACHINE_CODE.test(code)) return new DiscovrError("unknown-error", code);
	}
	return new DiscovrError("unknown-error", `Request failed (HTTP ${status})`);
}

/**
 * Recognises data-call failures that have a dedicated typed SDK error
 * (`access-not-granted`, `legal-acceptance-required`, `profile-not-found`,
 * `cursor-expired`). Returns `null` for ordinary status errors so callers that
 * branch on `ResponseError` status codes keep working.
 */
export function typedDataErrorFor(status: number, body: string): DiscovrError | null {
	if (status !== 403 && status !== 409) return null;
	const err = apiErrorFor(status, body);
	if (
		err instanceof AccessNotGrantedError ||
		err instanceof LegalAcceptanceRequiredError ||
		err instanceof ProfileNotFoundError ||
		err instanceof CursorExpiredError
	) {
		return err;
	}
	return null;
}
