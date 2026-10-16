// config.ts reads import.meta.url (ESM-only) to derive on-disk paths, which ts-jest
// can't transpile under commonjs. generateTypeScript() only needs TIER_LABELS (plain
// object), so mock the module away rather than dragging ESM support into the project.
jest.mock("../config", () => ({
	TIER_LABELS: { identity: "Identity tier", session: "Session tier", public: "Public tier" },
}));

import { generateTypeScript } from "../emit-typescript";
import type { ParsedOperation } from "../types";

function op(overrides: Partial<ParsedOperation>): ParsedOperation {
	return {
		operationId: "placeholder",
		httpMethod: "GET",
		path: "/placeholder",
		tier: "session",
		positional: [],
		optional: [],
		bodySchemaName: null,
		bodyRequired: [],
		bodyOptional: [],
		bodyProps: [],
		pathParams: [],
		queryParams: [],
		returnTypeName: "void",
		returnType: { tsType: "void", ktType: "Unit", swiftType: "Void" },
		cachePolicy: "none",
		cacheInvalidates: [],
		...overrides,
	};
}

describe("generateTypeScript — cache wiring", () => {
	it("wraps a session-cacheable operation in this._cache.wrap(...)", () => {
		const output = generateTypeScript([op({ operationId: "getPage", cachePolicy: "session" })]);
		expect(output).toContain("this._cache.wrap(");
		expect(output).toContain('"getPage"');
	});

	it("wraps a ttl-cacheable operation with the ttl in ms", () => {
		const output = generateTypeScript([
			op({ operationId: "searchMedia", cachePolicy: "ttl", cacheTtlSeconds: 3600 }),
		]);
		expect(output).toContain("this._cache.wrap(");
		expect(output).toContain("3600000");
	});

	it("does not wrap a non-cacheable operation", () => {
		const output = generateTypeScript([op({ operationId: "getLikedItems", cachePolicy: "none" })]);
		expect(output).not.toContain("this._cache.wrap(");
		expect(output).not.toContain("this._cache.invalidate(");
	});

	it("invalidates cache entries after an operation with cacheInvalidates succeeds", () => {
		const output = generateTypeScript([
			op({ operationId: "updateProfile", cacheInvalidates: ["getProfiles", "getProfile"] }),
		]);
		expect(output).toContain("async updateProfile(");
		expect(output).toContain('this._cache.invalidate(["getProfiles","getProfile"]);');
	});

	it("declares the abstract _cache field on the generated base class", () => {
		const output = generateTypeScript([op({ operationId: "getPage" })]);
		expect(output).toContain("protected abstract readonly _cache: _DiscovrCache;");
	});
});
