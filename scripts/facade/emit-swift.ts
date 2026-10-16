import { TIER_LABELS } from "./config";
import type { BoundParam, ParsedOperation } from "./types";

export function generateSwift(ops: ParsedOperation[]): string {
	const lines: string[] = [];
	lines.push("// AUTO-GENERATED — do not edit.");
	lines.push("import Foundation");
	lines.push("");
	lines.push("// swiftlint:disable file_length function_parameter_count");
	// @unchecked Sendable: this base class holds no stored state itself (only
	// abstract accessors DiscovrClient overrides), so it's safe to capture
	// `self` in the @Sendable fetcher closures _DiscovrCache.wrap() requires.
	// The compiler can't verify this automatically because the class is
	// `open` — a subclass could in principle add unsynchronized mutable
	// state — matching the same escape hatch already used for
	// RecoveryAction/DiscovrSessionInterceptor in _DiscovrAuth.swift.
	lines.push("open class _DiscovrClientBase: @unchecked Sendable {");
	lines.push("");
	lines.push("    // Provided by DiscovrClient");
	lines.push('    var _auth: _DiscovrAuth { fatalError("_auth must be overridden") }');
	lines.push('    var _cache: _DiscovrCache { fatalError("_cache must be overridden") }');
	lines.push("");
	lines.push("    // ── Configuration accessors ──────────────────────────────────────────────");
	lines.push("");
	lines.push("    private var _sessionConfig: DiscovrAPIConfiguration {");
	lines.push("        _auth.sessionAPIConfiguration()");
	lines.push("    }");
	lines.push("");
	lines.push("    private var _identityConfig: DiscovrAPIConfiguration {");
	lines.push("        _auth.identityAPIConfiguration()");
	lines.push("    }");
	lines.push("");
	lines.push("    private var _publicConfig: DiscovrAPIConfiguration {");
	lines.push("        _auth.publicAPIConfiguration()");
	lines.push("    }");
	lines.push("");

	const tiers: Array<ParsedOperation["tier"]> = ["identity", "session", "public"];

	for (const tier of tiers) {
		const tierOps = ops.filter((o) => o.tier === tier);
		if (!tierOps.length) continue;

		lines.push(
			`    // ── ${TIER_LABELS[tier] ?? tier} ─────────────────────────────────────────────────────`,
		);
		lines.push("");

		for (const op of tierOps) {
			const cacheable = op.cachePolicy !== "none";
			const invalidates = op.cacheInvalidates;

			const args = buildSwiftArgs(op, cacheable);
			const returnType = op.returnType.swiftType;
			const call = buildSwiftCall(op, tier);

			// Writes (add, delete, scrobble) are called for their effect, so ignoring the
			// confirmation they return should not be a compiler warning.
			if (op.httpMethod.toUpperCase() !== "GET") lines.push("    @discardableResult");
			lines.push(`    public func ${op.operationId}(${args}) async throws -> ${returnType} {`);
			if (cacheable) {
				const ttl = op.cachePolicy === "ttl" ? `${op.cacheTtlSeconds!}.0` : "nil";
				lines.push(`        return try await _cache.wrap(`);
				lines.push(`            operationId: ${JSON.stringify(op.operationId)},`);
				lines.push(`            keyParams: ${buildSwiftCacheKeyMap(op)},`);
				lines.push(`            ttlSeconds: ${ttl},`);
				lines.push(`            bypass: bypassCache`);
				lines.push(`        ) {`);
				lines.push(`            ${call}`);
				lines.push(`        }`);
			} else if (invalidates.length > 0) {
				lines.push(`        let result = ${call}`);
				lines.push(
					`        await _cache.invalidate([${invalidates.map((i) => JSON.stringify(i)).join(", ")}])`,
				);
				lines.push(`        return result`);
			} else {
				lines.push(`        return ${call}`);
			}
			lines.push("    }");
			lines.push("");
		}
	}

	lines.push("}");
	return lines.join("\n");
}

function buildSwiftArgs(op: ParsedOperation, cacheable: boolean): string {
	const parts: string[] = [];
	for (const p of op.positional) {
		parts.push(`${p.name}: ${swiftParamType(op, p)}`);
	}
	for (const p of op.optional) {
		const t = swiftParamType(op, p);
		const defaultVal = t === "Bool" ? "false" : "nil";
		parts.push(`${p.name}: ${t}? = ${defaultVal}`);
	}
	if (cacheable) parts.push("bypassCache: Bool = false");
	return parts.join(", ");
}

/**
 * Path/query params with an inline `enum:` constraint compile against the
 * generator's per-operation nested enum (e.g. `DiscovrAPI.Contentfilter_searchGifs`),
 * not a plain `String` — the generated `DiscovrAPI.<op>` call this facade wraps
 * rejects a bare string at compile time. Body properties aren't affected: none
 * are enum-constrained today, and the generator nests those on the payload
 * struct instead, not on `DiscovrAPI`.
 */
function swiftParamType(op: ParsedOperation, p: BoundParam): string {
	if (p.isEnum && p.source !== "body") {
		return `DiscovrAPI.${capitalize(p.name)}_${op.operationId}`;
	}
	return p.swiftType;
}

function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * `String(describing:)` of every param that determines the response, keyed by
 * name, for use as the cache key. Deliberately excludes `bypassCache` — it
 * controls cache behavior, it isn't part of the request.
 */
function buildSwiftCacheKeyMap(op: ParsedOperation): string {
	const parts: string[] = [];
	for (const p of op.positional) parts.push(`"${p.name}": String(describing: ${p.name})`);
	for (const p of op.optional) parts.push(`"${p.name}": String(describing: ${p.name})`);
	return parts.length > 0 ? `[${parts.join(", ")}]` : "[:]";
}

function buildSwiftCall(op: ParsedOperation, tier: ParsedOperation["tier"]): string {
	// `self.` is required (not just implicit `_sessionConfig`), since cacheable
	// operations wrap this call in the `@escaping` fetcher closure
	// `_cache.wrap()` takes — Swift requires an explicit capture there.
	const config =
		tier === "identity"
			? "self._identityConfig"
			: tier === "public"
				? "self._publicConfig"
				: "self._sessionConfig";

	const sdkArgs: string[] = [];

	for (const pName of op.pathParams) {
		sdkArgs.push(`${pName}: ${pName}`);
	}

	if (op.bodySchemaName) {
		const ctorArgs: string[] = [];
		for (const f of op.bodyRequired) {
			ctorArgs.push(`${f}: ${f}`);
		}
		for (const f of op.bodyOptional) {
			ctorArgs.push(`${f}: ${f}`);
		}
		sdkArgs.push(`${lcFirst(op.bodySchemaName)}: ${op.bodySchemaName}(${ctorArgs.join(", ")})`);
	}

	// openapi-generator-cli sorts required query params before optional ones
	// (sortParamsByRequiredFlag, default true) in the generated method signature,
	// and Swift call sites must supply labeled arguments in that same declared order.
	for (const q of op.queryParams.filter((p) => p.required)) {
		sdkArgs.push(`${q.name}: ${q.name}`);
	}
	for (const q of op.queryParams.filter((p) => !p.required)) {
		sdkArgs.push(`${q.name}: ${q.name}`);
	}

	sdkArgs.push(`apiConfiguration: ${config}`);

	return `try await DiscovrAPI.${op.operationId}(${sdkArgs.join(", ")})`;
}

function lcFirst(s: string): string {
	return s.charAt(0).toLowerCase() + s.slice(1);
}
