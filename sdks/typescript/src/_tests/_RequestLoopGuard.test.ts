/**
 * Tests for the client-side runaway-loop breaker.
 *
 * The behaviour that matters most here is that it fails **closed**: a tripped
 * guard must prevent the request from being sent, not merely complain about it.
 * A guard that logged and let the call through would leave the actual problem —
 * traffic reaching the server — completely unaddressed.
 */

import { _RequestLoopGuard } from "../_RequestLoopGuard";
import { RequestLoopError } from "../errors";

describe("_RequestLoopGuard", () => {
	it("allows normal request volume", () => {
		const guard = new _RequestLoopGuard({ maxRequests: 10, windowMs: 1000 });
		for (let i = 0; i < 10; i += 1) {
			expect(() => guard.check("GET /pages")).not.toThrow();
		}
	});

	it("throws RequestLoopError once the threshold is exceeded", () => {
		const guard = new _RequestLoopGuard({ maxRequests: 5, windowMs: 1000 });
		for (let i = 0; i < 5; i += 1) guard.check("GET /pages");

		expect(() => guard.check("GET /pages")).toThrow(RequestLoopError);
	});

	it("names the offending request and tells the developer it was not sent", () => {
		const guard = new _RequestLoopGuard({ maxRequests: 1, windowMs: 1000 });
		guard.check("POST /profile/watchlist");

		try {
			guard.check("POST /profile/watchlist");
			throw new Error("expected the guard to throw");
		} catch (e) {
			expect(e).toBeInstanceOf(RequestLoopError);
			const err = e as RequestLoopError;
			expect(err.message).toContain("POST /profile/watchlist");
			expect(err.message).toContain("NOT sent");
			expect(err.retryInSeconds).toBeGreaterThan(0);
		}
	});

	it("stays open for the cooldown — the breaker does not reset on the next call", () => {
		const guard = new _RequestLoopGuard({ maxRequests: 2, windowMs: 1000, cooldownMs: 60_000 });
		guard.check("GET /pages");
		guard.check("GET /pages");

		expect(() => guard.check("GET /pages")).toThrow(RequestLoopError);
		// Still blocked: this is the fail-closed property. A guard that let the
		// very next request through would not actually stop a loop.
		expect(() => guard.check("GET /pages")).toThrow(RequestLoopError);
		expect(() => guard.check("GET /pages")).toThrow(RequestLoopError);
	});

	it("recovers once the cooldown elapses", () => {
		jest.useFakeTimers();
		try {
			const guard = new _RequestLoopGuard({
				maxRequests: 2,
				windowMs: 1000,
				cooldownMs: 5_000,
			});
			guard.check("GET /pages");
			guard.check("GET /pages");
			expect(() => guard.check("GET /pages")).toThrow(RequestLoopError);

			jest.advanceTimersByTime(5_001);

			expect(() => guard.check("GET /pages")).not.toThrow();
		} finally {
			jest.useRealTimers();
		}
	});

	it("forgets requests that fall outside the sliding window", () => {
		jest.useFakeTimers();
		try {
			const guard = new _RequestLoopGuard({ maxRequests: 3, windowMs: 1_000 });
			guard.check("GET /pages");
			guard.check("GET /pages");
			guard.check("GET /pages");

			// Steady, slow traffic must never trip the guard, however long it runs.
			for (let i = 0; i < 20; i += 1) {
				jest.advanceTimersByTime(1_001);
				expect(() => guard.check("GET /pages")).not.toThrow();
			}
		} finally {
			jest.useRealTimers();
		}
	});

	it("can be disabled for legitimately high-volume integrations", () => {
		const guard = new _RequestLoopGuard({ maxRequests: 1, windowMs: 1000, enabled: false });
		for (let i = 0; i < 500; i += 1) {
			expect(() => guard.check("GET /pages")).not.toThrow();
		}
	});

	it("reset() clears a tripped breaker", () => {
		const guard = new _RequestLoopGuard({ maxRequests: 1, windowMs: 1000 });
		guard.check("GET /pages");
		expect(() => guard.check("GET /pages")).toThrow(RequestLoopError);

		guard.reset();

		expect(() => guard.check("GET /pages")).not.toThrow();
	});
});
