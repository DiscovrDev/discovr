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
 * The codes are an implementation detail of the API, so they are translated
 * here and never passed on: an unrecognised code becomes a plain
 * `DiscovrError` with a generic message, not the code itself.
 */
export function mapApiErrorCode(code: string, message?: string): DiscovrError {
	switch (code) {
		case "client-not-found":
		case "CLIENT_NOT_FOUND":
		case "MISSING_CLIENT_ID":
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
		case "TOKEN_EXPIRED":
			return new SessionExpiredError(message);
		case "session-already-consumed":
			return new SessionConsumedError(message);
		case "code-verifier-invalid":
		case "token-invalid":
		case "TOKEN_INVALID":
		case "WRONG_TOKEN_KIND":
		case "client-mismatch":
			return new TokenInvalidError(message);
		default:
			return new DiscovrError("unknown-error", message ?? "Request failed");
	}
}

const MACHINE_CODE = /^[A-Za-z0-9_-]+$/;

/**
 * Translate a non-2xx response into a typed error. The server names failures in
 * the body's `error` field; prose there ("Resource not found") is written for
 * callers and passed on, a machine code we don't know is not.
 */
export function apiErrorFor(status: number, body: string): DiscovrError {
	let code: string | undefined;
	try {
		const parsed = JSON.parse(body) as { error?: unknown };
		if (typeof parsed.error === "string") code = parsed.error;
	} catch {
		// An unparseable body (e.g. an HTML block page) has no code to read.
	}
	if (code !== undefined) {
		const mapped = mapApiErrorCode(code);
		if (mapped.code !== "unknown-error") return mapped;
		if (!MACHINE_CODE.test(code)) return new DiscovrError("unknown-error", code);
	}
	return new DiscovrError("unknown-error", `Request failed (HTTP ${status})`);
}
