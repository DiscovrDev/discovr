import { TIER_LABELS } from "./config";
import type { BoundParam, ParsedOperation } from "./types";

export function generateKotlin(ops: ParsedOperation[]): string {
	const lines: string[] = [];
	lines.push("// AUTO-GENERATED — do not edit.");
	lines.push('@file:Suppress("TooManyFunctions", "LongParameterList")');
	lines.push("");
	lines.push("package api.discovr");
	lines.push("");
	lines.push("import api.discovr.apis.DiscovrApi");
	lines.push("import api.discovr.auth._DiscovrAuth");
	lines.push("import api.discovr.auth.TokenInvalidError");
	// Both live in `api.discovr.auth`; the 429 branch below is emitted into
	// `api.discovr`, so without these the generated base class doesn't compile.
	lines.push("import api.discovr.auth.RateLimitedError");
	lines.push("import api.discovr.auth.retryAfterSeconds");
	lines.push("import api.discovr.infrastructure.HttpResponse");

	const modelImports = new Set<string>();
	for (const op of ops) {
		if (op.returnTypeName && op.returnTypeName !== "void" && op.returnTypeName !== "object") {
			modelImports.add(op.returnTypeName);
		}
		if (op.bodySchemaName) modelImports.add(op.bodySchemaName);
		for (const p of [...op.positional, ...op.optional]) {
			if (p.isRef && p.refName) modelImports.add(p.refName);
		}
	}
	for (const m of [...modelImports].sort()) {
		lines.push(`import api.discovr.models.${m}`);
	}

	lines.push("import io.ktor.client.statement.bodyAsText");
	lines.push("");
	lines.push(
		'class DiscovrException(val statusCode: Int, message: String = "") : Exception("Discovr API error $statusCode: $message")',
	);
	lines.push("");
	lines.push("abstract class _DiscovrClientBase {");
	lines.push("");
	// `internal`, not `protected`: `_DiscovrAuth` is itself an `internal class`
	// (SDK-internal, not part of the public API surface), and Kotlin forbids a
	// more-visible (`protected`) member from exposing a less-visible type. The
	// two `inline` helpers below reference `_auth` in their bodies, so they
	// must also be `internal` — an inline function whose effective visibility
	// crosses module boundaries (`public`/`protected`) can't reference
	// `internal` symbols.
	lines.push("    internal abstract val _auth: _DiscovrAuth");
	lines.push("    internal abstract val _cache: _DiscovrCache");
	lines.push("    internal abstract val _sessionApi: DiscovrApi");
	lines.push("    internal abstract val _identityApi: DiscovrApi");
	lines.push("");
	lines.push("    // ── Internal session-tier call helper with auto-recovery ──────────────────");
	lines.push("");
	lines.push("    internal suspend inline fun <reified T : Any> sessionApiCall(");
	lines.push("        crossinline call: suspend DiscovrApi.() -> HttpResponse<T>,");
	lines.push("    ): T {");
	lines.push("        val resp = _sessionApi.call()");
	lines.push("        if (resp.success) return resp.body()");
	// Rate limits reach every session-tier call, so they are mapped here rather
	// than left to each caller to recognise by status code. Thrown, never waited
	// out: a limit window is a minute long, so retrying inside the SDK would
	// block the caller or fire again into a closed window.
	lines.push("        if (resp.status == 429) throw RateLimitedError(");
	lines.push('            "Too many requests — slow down and try again shortly.",');
	lines.push('            retryAfterSeconds(resp.response.headers["Retry-After"]),');
	lines.push("        )");
	lines.push("        if (resp.status != 401) throw DiscovrException(resp.status)");
	lines.push("        val rawBody = resp.response.bodyAsText()");
	lines.push("        val action = _auth.handleSessionErrorBody(rawBody)");
	lines.push("        return when (action) {");
	lines.push("            is _DiscovrAuth.RecoveryAction.RetryWithBearer -> {");
	lines.push("                val retry = _sessionApi.call()");
	lines.push(
		"                if (retry.success) retry.body() else throw DiscovrException(retry.status)",
	);
	lines.push("            }");
	// _auth.handleSessionErrorBody already called signOut() for this action —
	// throw the SDK's typed "token invalid" error (not the generic
	// DiscovrException every other branch uses) so a consuming app's
	// `is TokenInvalidError`/`is DiscovrError` auth-failure handling actually
	// recognizes it, instead of silently falling through as an
	// indistinguishable-from-any-other-failure exception.
	lines.push(
		'            is _DiscovrAuth.RecoveryAction.SignedOut -> throw TokenInvalidError("Refresh token expired")',
	);
	lines.push(
		"            is _DiscovrAuth.RecoveryAction.NoOp -> throw DiscovrException(resp.status, rawBody)",
	);
	lines.push("        }");
	lines.push("    }");
	lines.push("");
	lines.push("    internal suspend inline fun <reified T : Any> identityApiCall(");
	lines.push("        crossinline call: suspend DiscovrApi.() -> HttpResponse<T>,");
	lines.push("    ): T {");
	lines.push("        val resp = _identityApi.call()");
	lines.push("        if (resp.success) return resp.body()");
	// A refresh-token 401 ends the session. Only the SDK's own requests used to
	// recover from it; a call through here (getProfiles, the session list)
	// surfaced as an untyped 401 while the client went on reporting itself
	// signed in.
	lines.push("        if (resp.status == 401) {");
	lines.push("            val rawBody = resp.response.bodyAsText()");
	lines.push(
		'            if (_auth.handleIdentityErrorBody(rawBody)) throw TokenInvalidError("Refresh token expired")',
	);
	lines.push("            throw DiscovrException(resp.status, rawBody)");
	lines.push("        }");
	lines.push("        throw DiscovrException(resp.status)");
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

			const args = buildKtArgs(op, cacheable);
			const returnType = op.returnType.ktType;
			const call = buildKtCall(op, tier);

			if (cacheable) {
				const ttlMs = op.cachePolicy === "ttl" ? `${op.cacheTtlSeconds! * 1000}L` : "null";
				lines.push(`    suspend fun ${op.operationId}(${args}): ${returnType} =`);
				lines.push(
					`        _cache.wrap(${JSON.stringify(op.operationId)}, ${buildKtCacheKeyMap(op)}, ${ttlMs}, bypassCache) { ${call} }`,
				);
			} else if (invalidates.length > 0) {
				lines.push(`    suspend fun ${op.operationId}(${args}): ${returnType} {`);
				lines.push(`        val result = ${call}`);
				lines.push(
					`        _cache.invalidate(listOf(${invalidates.map((i) => JSON.stringify(i)).join(", ")}))`,
				);
				lines.push(`        return result`);
				lines.push(`    }`);
			} else {
				lines.push(`    suspend fun ${op.operationId}(${args}): ${returnType} =`);
				lines.push(`        ${call}`);
			}
			lines.push("");
		}
	}

	lines.push("}");
	return lines.join("\n");
}

function buildKtArgs(op: ParsedOperation, cacheable: boolean): string {
	const parts: string[] = [];
	for (const p of op.positional) {
		parts.push(`${p.name}: ${ktParamType(op, p)}`);
	}
	for (const p of op.optional) {
		const t = ktParamType(op, p);
		const defaultVal = t === "Boolean" ? "false" : t === "Int" || t === "Double" ? "null" : "null";
		parts.push(`${p.name}: ${t}? = ${defaultVal}`);
	}
	if (cacheable) parts.push("bypassCache: Boolean = false");
	return parts.join(", ");
}

/**
 * Path/query params with an inline `enum:` constraint compile against the
 * generator's per-operation nested enum (e.g. `DiscovrApi.ContentfilterSearchGifs`),
 * not a plain `String` — mirrors the equivalent fix in emit-swift.ts. Body
 * properties aren't affected: none are enum-constrained today, and the
 * generator nests those on the payload data class instead, not on `DiscovrApi`.
 */
function ktParamType(op: ParsedOperation, p: BoundParam): string {
	if (p.isEnum && p.source !== "body") {
		return `DiscovrApi.${capitalize(p.name)}${capitalize(op.operationId)}`;
	}
	return p.ktType;
}

function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * `mapOf(...)` capturing every param that determines the response, for use as
 * the cache key. Deliberately excludes `bypassCache` — it controls cache
 * behavior, it isn't part of the request.
 */
function buildKtCacheKeyMap(op: ParsedOperation): string {
	const parts: string[] = [];
	for (const p of op.positional) parts.push(`"${p.name}" to ${p.name}`);
	for (const p of op.optional) parts.push(`"${p.name}" to ${p.name}`);
	return `mapOf(${parts.join(", ")})`;
}

function buildKtCall(op: ParsedOperation, tier: ParsedOperation["tier"]): string {
	const callHelper =
		tier === "identity"
			? "identityApiCall"
			: tier === "public"
				? "publicApiCall"
				: "sessionApiCall";

	const sdkArgs = buildKtSdkArgs(op);

	if (tier === "public") {
		return `_auth.publicApi().${op.operationId}(${sdkArgs}).body()`;
	}

	return `${callHelper} { ${op.operationId}(${sdkArgs}) }`;
}

function buildKtSdkArgs(op: ParsedOperation): string {
	const parts: string[] = [];

	for (const pName of op.pathParams) {
		parts.push(pName);
	}

	if (op.bodySchemaName) {
		const ctorArgs: string[] = [];
		for (const f of op.bodyRequired) {
			ctorArgs.push(`${f} = ${f}`);
		}
		for (const f of op.bodyOptional) {
			ctorArgs.push(`${f} = ${f}`);
		}
		parts.push(`${op.bodySchemaName}(${ctorArgs.join(", ")})`);
	}

	// openapi-generator-cli sorts required query params before optional ones
	// (sortParamsByRequiredFlag, default true) in the generated method signature,
	// so the call args here must follow the same required-first order.
	for (const q of op.queryParams.filter((p) => p.required)) {
		parts.push(q.name);
	}
	for (const q of op.queryParams.filter((p) => !p.required)) {
		parts.push(`${q.name} = ${q.name}`);
	}

	return parts.join(", ");
}
