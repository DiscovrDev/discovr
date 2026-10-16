import { TIER_LABELS } from "./config";
import type { ParsedOperation } from "./types";

export function generateTypeScript(ops: ParsedOperation[]): string {
	const modelTypes = new Set<string>();
	for (const op of ops) {
		if (op.returnTypeName && op.returnTypeName !== "void" && op.returnTypeName !== "object") {
			modelTypes.add(op.returnTypeName);
		}
		for (const p of [...op.positional, ...op.optional]) {
			if (p.isRef && p.refName) modelTypes.add(p.refName);
		}
	}

	const lines: string[] = [];
	lines.push("// AUTO-GENERATED — do not edit.");
	lines.push("// prettier-ignore");
	lines.push("");
	if (modelTypes.size > 0) {
		lines.push(`import type {`);
		lines.push(`  ${[...modelTypes].sort().join(",\n  ")}`);
		lines.push(`} from './models/index';`);
	}
	lines.push(`import type { _DiscovrAuth } from './auth';`);
	lines.push(`import type { _DiscovrCache } from './_DiscovrCache';`);
	lines.push("");
	lines.push("// eslint-disable-next-line @typescript-eslint/no-explicit-any");
	lines.push("export abstract class _DiscovrClientBase {");
	lines.push("  protected abstract readonly _auth: _DiscovrAuth;");
	lines.push("  protected abstract readonly _cache: _DiscovrCache;");
	lines.push("");

	const tiers: Array<ParsedOperation["tier"]> = ["identity", "session", "public"];

	for (const tier of tiers) {
		const tierOps = ops.filter((o) => o.tier === tier);
		if (!tierOps.length) continue;

		lines.push(`  // ── ${TIER_LABELS[tier] ?? tier} ────────────────────────────────────`);
		lines.push("");

		for (const op of tierOps) {
			const cacheable = op.cachePolicy !== "none";
			const invalidates = op.cacheInvalidates;

			const args = buildTsArgs(op, cacheable);
			const returnType = op.returnTypeName === "void" ? "void" : op.returnType.tsType;
			const call = buildTsCall(op, tier);
			const isAsync = invalidates.length > 0;

			lines.push(
				`  ${isAsync ? "async " : ""}${op.operationId}(${args}): Promise<${returnType}> {`,
			);
			if (cacheable) {
				const ttlMs = op.cachePolicy === "ttl" ? String(op.cacheTtlSeconds! * 1000) : "undefined";
				lines.push(`    return this._cache.wrap(`);
				lines.push(`      ${JSON.stringify(op.operationId)},`);
				lines.push(`      ${buildTsCacheKeyObj(op)},`);
				lines.push(`      ${ttlMs},`);
				lines.push(`      options?.bypassCache,`);
				lines.push(`      () => ${call},`);
				lines.push(`    );`);
			} else if (isAsync) {
				lines.push(`    const result = await ${call};`);
				lines.push(`    this._cache.invalidate(${JSON.stringify(invalidates)});`);
				lines.push(`    return result;`);
			} else {
				lines.push(`    return ${call};`);
			}
			lines.push("  }");
			lines.push("");
		}
	}

	lines.push("}");
	return lines.join("\n");
}

function buildTsArgs(op: ParsedOperation, cacheable: boolean): string {
	const parts: string[] = [];
	for (const p of op.positional) {
		parts.push(`${p.name}: ${p.tsType}`);
	}
	const optParts = op.optional.map((p) => `${p.name}?: ${p.tsType}`);
	if (cacheable) optParts.push("bypassCache?: boolean");
	if (optParts.length > 0) {
		parts.push(`options?: { ${optParts.join("; ")} }`);
	}
	return parts.join(", ");
}

/**
 * Object literal capturing every param that determines the response, for use
 * as the cache key. Deliberately excludes `bypassCache` — it controls cache
 * behavior, it isn't part of the request.
 */
function buildTsCacheKeyObj(op: ParsedOperation): string {
	const parts: string[] = [];
	for (const p of op.positional) parts.push(p.name);
	for (const p of op.optional) parts.push(`${p.name}: options?.${p.name}`);
	return `{ ${parts.join(", ")} }`;
}

function buildTsCall(op: ParsedOperation, tier: ParsedOperation["tier"]): string {
	const apiGetter =
		tier === "identity"
			? "this._auth.identityApi()"
			: tier === "public"
				? "this._auth.publicApi()"
				: "this._auth.sessionApi()";

	const sdkArgs: string[] = [];

	for (const pName of op.pathParams) {
		sdkArgs.push(pName);
	}

	if (op.bodySchemaName) {
		if (op.bodyOptional.length === 0) {
			const obj = op.bodyRequired.join(", ");
			sdkArgs.push(`{ ${obj} }`);
		} else {
			// Pick body-optional fields off `options` by name rather than spreading the
			// whole bag — `options` may also carry query-optional params and/or
			// `bypassCache` (for cacheable ops), neither of which belongs in the body.
			const bodyOptionalParts = op.bodyOptional.map((f) => `${f}: options?.${f}`);
			const parts = [...op.bodyRequired, ...bodyOptionalParts];
			sdkArgs.push(`{ ${parts.join(", ")} }`);
		}
	}

	// openapi-generator-cli sorts required query params before optional ones
	// (sortParamsByRequiredFlag, default true) in the generated method signature,
	// so the call args here must follow the same required-first order.
	for (const q of op.queryParams.filter((p) => p.required)) {
		sdkArgs.push(q.tsCoerce ? `${q.name} as ${q.tsCoerce}` : q.name);
	}
	for (const q of op.queryParams.filter((p) => !p.required)) {
		const coerce = q.tsCoerce;
		sdkArgs.push(coerce ? `options?.${q.name} as ${coerce}` : `options?.${q.name}`);
	}

	return `${apiGetter}.${op.operationId}(${sdkArgs.join(", ")})`;
}
