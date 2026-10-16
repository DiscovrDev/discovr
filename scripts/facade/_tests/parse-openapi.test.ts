// config.ts reads import.meta.url (ESM-only) to derive on-disk paths, which ts-jest
// can't transpile under commonjs. buildOperations() never touches those paths, so mock
// the module away rather than dragging ESM support into the whole test project.
jest.mock("../config", () => ({ SPEC_PATH: "" }));

import { buildOperations } from "../parse-openapi";
import type { OpenAPISpec } from "../types";

function op(extra: Record<string, unknown> = {}) {
	return {
		operationId: "placeholder",
		security: [{ BearerAuth: [] }],
		responses: { "200": { content: { "application/json": { schema: { type: "object" } } } } },
		...extra,
	};
}

describe("buildOperations — cache policy parsing", () => {
	it("defaults to cachePolicy 'none' with no invalidates when x-cache-policy is absent", () => {
		const spec: OpenAPISpec = {
			paths: { "/no-policy": { get: op({ operationId: "getNoPolicy" }) as never } },
		};
		const [parsed] = buildOperations(spec);
		expect(parsed.cachePolicy).toBe("none");
		expect(parsed.cacheTtlSeconds).toBeUndefined();
		expect(parsed.cacheInvalidates).toEqual([]);
	});

	it("parses an explicit 'none' policy the same as absent", () => {
		const spec: OpenAPISpec = {
			paths: {
				"/explicit-none": {
					get: op({ operationId: "getExplicitNone", "x-cache-policy": "none" }) as never,
				},
			},
		};
		const [parsed] = buildOperations(spec);
		expect(parsed.cachePolicy).toBe("none");
	});

	it("parses 'session' policy", () => {
		const spec: OpenAPISpec = {
			paths: {
				"/session": {
					get: op({ operationId: "getSession", "x-cache-policy": "session" }) as never,
				},
			},
		};
		const [parsed] = buildOperations(spec);
		expect(parsed.cachePolicy).toBe("session");
		expect(parsed.cacheTtlSeconds).toBeUndefined();
	});

	it("parses 'ttl:<seconds>' policy into cachePolicy 'ttl' with cacheTtlSeconds", () => {
		const spec: OpenAPISpec = {
			paths: {
				"/ttl": { get: op({ operationId: "getTtl", "x-cache-policy": "ttl:3600" }) as never },
			},
		};
		const [parsed] = buildOperations(spec);
		expect(parsed.cachePolicy).toBe("ttl");
		expect(parsed.cacheTtlSeconds).toBe(3600);
	});

	it("throws on a malformed x-cache-policy value", () => {
		const spec: OpenAPISpec = {
			paths: {
				"/bad": { get: op({ operationId: "getBad", "x-cache-policy": "sometimes" }) as never },
			},
		};
		expect(() => buildOperations(spec)).toThrow(/Invalid x-cache-policy/);
	});

	it("parses x-cache-invalidates into cacheInvalidates", () => {
		const spec: OpenAPISpec = {
			paths: {
				"/mutate": {
					post: op({
						operationId: "updateThing",
						"x-cache-invalidates": ["getThing", "getThings"],
					}) as never,
				},
			},
		};
		const [parsed] = buildOperations(spec);
		expect(parsed.cacheInvalidates).toEqual(["getThing", "getThings"]);
	});
});
