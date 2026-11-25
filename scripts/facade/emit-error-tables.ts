/**
 * Generates the wire-code → typed-error mapping tables for all three SDKs from
 * `components.schemas.ApiErrorCode` in the bundled OpenAPI spec.
 *
 * Every code in `ApiErrorCode` MUST be classified here (either as a typed SDK
 * error or explicitly as `"generic"`). Adding a code to the spec without
 * classifying it fails SDK generation instead of silently falling through to an
 * untyped error in one or more languages.
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { ROOT } from "./config";

const START_MARKER = "// <generated:error-table>";
const END_MARKER = "// </generated:error-table>";

type TypedErrorKind =
	| "clientNotFound"
	| "deviceCodeExpired"
	| "deviceCodeConsumed"
	| "deviceCodeDenied"
	| "cancelled"
	| "sessionExpired"
	| "sessionConsumed"
	| "tokenInvalid"
	| "accessNotGranted"
	| "legalAcceptanceRequired"
	| "profileNotFound"
	| "cursorExpired"
	| "rateLimited";

type ErrorMappingKind = TypedErrorKind | "generic";

/**
 * Redirect-only error code carried on the web-auth callback URL rather than in
 * a JSON error body. Included in the generated SDK tables alongside the
 * `ApiErrorCode` enum values.
 */
const REDIRECT_ONLY_CODES = new Set<string>(["authorization-cancelled"]);

/**
 * Authoritative mapping from every `ApiErrorCode` value (plus redirect-only
 * codes) to the SDK's typed error vocabulary.
 */
const CODE_TO_KIND: Record<string, ErrorMappingKind> = {
	// Typed SDK errors
	"client-not-found": "clientNotFound",
	"device-code-expired": "deviceCodeExpired",
	"device-code-not-found": "deviceCodeExpired",
	"device-code-already-consumed": "deviceCodeConsumed",
	"device-code-denied": "deviceCodeDenied",
	"authorization-cancelled": "cancelled",
	"session-expired": "sessionExpired",
	"session-not-found": "sessionExpired",
	"session-already-consumed": "sessionConsumed",
	"token-invalid": "tokenInvalid",
	"token-expired": "tokenInvalid",
	"wrong-token-kind": "tokenInvalid",
	"client-mismatch": "tokenInvalid",
	"code-verifier-invalid": "tokenInvalid",
	"access-not-granted": "accessNotGranted",
	"legal-acceptance-required": "legalAcceptanceRequired",
	"profile-not-found": "profileNotFound",
	"cursor-expired": "cursorExpired",
	"rate-limited": "rateLimited",

	// Generic HTTP / config errors — intentionally mapped to the generic error
	// type with the optional `message` detail, never echoing the raw code.
	"not-found": "generic",
	duplicate: "generic",
	"invalid-input": "generic",
	"permission-denied": "generic",
	"method-not-allowed": "generic",
	"internal-error": "generic",
	"data-integrity": "generic",
	"upstream-unavailable": "generic",
	"service-unavailable": "generic",
	"demo-unavailable": "generic",
	"direct-access-denied": "generic",
	"device-code-busy": "generic",
	"redirect-uri-not-registered": "generic",
	"redirect-uri-invalid": "generic",
	"opener-origin-not-allowed": "generic",
	"code-challenge-required": "generic",
	"code-challenge-invalid": "generic",
};

const TYPED_ORDER: readonly TypedErrorKind[] = [
	"clientNotFound",
	"deviceCodeExpired",
	"deviceCodeConsumed",
	"deviceCodeDenied",
	"cancelled",
	"sessionExpired",
	"sessionConsumed",
	"tokenInvalid",
	"accessNotGranted",
	"legalAcceptanceRequired",
	"profileNotFound",
	"cursorExpired",
	"rateLimited",
];

const TS_CONSTRUCTORS: Record<TypedErrorKind, string> = {
	clientNotFound: "return new ClientNotFoundError(message);",
	deviceCodeExpired: "return new DeviceCodeExpiredError(message);",
	deviceCodeConsumed: "return new DeviceCodeConsumedError(message);",
	deviceCodeDenied: "return new DeviceCodeDeniedError(message);",
	cancelled: "return new AuthCancelledError(message);",
	sessionExpired: "return new SessionExpiredError(message);",
	sessionConsumed: "return new SessionConsumedError(message);",
	tokenInvalid: "return new TokenInvalidError(message);",
	accessNotGranted: "return new AccessNotGrantedError(message);",
	legalAcceptanceRequired: "return new LegalAcceptanceRequiredError(message);",
	profileNotFound: "return new ProfileNotFoundError(message);",
	cursorExpired: "return new CursorExpiredError(message);",
	rateLimited: [
		"return new RateLimitedError(",
		'\t\t\t\tmessage ?? "Too many requests — slow down and try again shortly.",',
		"\t\t\t\tretryInSeconds ?? 60,",
		"\t\t\t);",
	].join("\n"),
};

const KT_CONSTRUCTORS: Record<TypedErrorKind, string> = {
	clientNotFound: 'ClientNotFoundError(message ?: "Client not found")',
	deviceCodeExpired: 'DeviceCodeExpiredError(message ?: "Device code expired")',
	deviceCodeConsumed: 'DeviceCodeConsumedError(message ?: "Device code already consumed")',
	deviceCodeDenied: 'DeviceCodeDeniedError(message ?: "Device sign-in was declined")',
	cancelled: 'AuthCancelledError(message ?: "Sign-in was cancelled")',
	sessionExpired: 'SessionExpiredError(message ?: "Authentication session expired")',
	sessionConsumed: 'SessionConsumedError(message ?: "Authentication session already consumed")',
	tokenInvalid: 'TokenInvalidError(message ?: "Token invalid")',
	accessNotGranted: 'AccessNotGrantedError(message ?: "Account access has not been granted yet")',
	legalAcceptanceRequired:
		'LegalAcceptanceRequiredError(message ?: "Please accept the latest Terms to continue")',
	profileNotFound: 'ProfileNotFoundError(message ?: "Profile not found")',
	cursorExpired: 'CursorExpiredError(message ?: "Pagination cursor expired")',
	rateLimited:
		'RateLimitedError(message ?: "Too many requests — slow down and try again shortly.", retryInSeconds ?: DEFAULT_RETRY_AFTER_SECONDS)',
};

const SWIFT_CASES: Record<TypedErrorKind, string> = {
	clientNotFound: "return .clientNotFound",
	deviceCodeExpired: "return .deviceCodeExpired",
	deviceCodeConsumed: "return .deviceCodeConsumed",
	deviceCodeDenied: "return .deviceCodeDenied",
	cancelled: "return .cancelled",
	sessionExpired: "return .sessionExpired",
	sessionConsumed: "return .sessionConsumed",
	tokenInvalid: "return .tokenInvalid",
	accessNotGranted: "return .accessNotGranted",
	legalAcceptanceRequired: "return .legalAcceptanceRequired",
	profileNotFound: "return .profileNotFound",
	cursorExpired: "return .cursorExpired",
	rateLimited: "return .rateLimited(retryInSeconds: retryInSeconds ?? 60)",
};

function readApiErrorCodes(spec: Record<string, unknown>): string[] {
	const components = spec.components as
		| { schemas?: Record<string, { enum?: unknown }> }
		| undefined;
	const raw = components?.schemas?.ApiErrorCode?.enum;
	if (!Array.isArray(raw) || raw.length === 0) {
		throw new Error(
			"Bundled OpenAPI spec is missing components.schemas.ApiErrorCode.enum. Run `npm run openapi:bundle` first.",
		);
	}
	const codes = raw.map((v) => String(v));
	for (const code of codes) {
		if (!/^[a-z][a-z0-9-]*$/.test(code)) {
			throw new Error(`ApiErrorCode contains non-kebab-case value: "${code}"`);
		}
	}
	return codes;
}

function validateAndGroupCodes(specCodes: string[]): Map<TypedErrorKind, string[]> {
	const specSet = new Set(specCodes);

	const unmapped = specCodes.filter((c) => !(c in CODE_TO_KIND));
	if (unmapped.length > 0) {
		throw new Error(
			`ApiErrorCode values missing from emit-error-tables.ts CODE_TO_KIND: ${unmapped.join(", ")}`,
		);
	}

	const stale = Object.keys(CODE_TO_KIND).filter(
		(c) => !specSet.has(c) && !REDIRECT_ONLY_CODES.has(c),
	);
	if (stale.length > 0) {
		throw new Error(
			`Stale entries in emit-error-tables.ts CODE_TO_KIND not in ApiErrorCode: ${stale.join(", ")}`,
		);
	}

	const grouped = new Map<TypedErrorKind, string[]>();
	for (const kind of TYPED_ORDER) grouped.set(kind, []);

	for (const [code, kind] of Object.entries(CODE_TO_KIND)) {
		if (kind === "generic") continue;
		grouped.get(kind)!.push(code);
	}
	return grouped;
}

function renderTypeScriptCases(grouped: Map<TypedErrorKind, string[]>): string {
	const lines: string[] = [];
	for (const kind of TYPED_ORDER) {
		const codes = grouped.get(kind)!;
		if (codes.length === 0) continue;
		for (const code of codes) {
			lines.push(`\t\tcase ${JSON.stringify(code)}:`);
		}
		lines.push(`\t\t\t${TS_CONSTRUCTORS[kind]}`);
	}
	return lines.join("\n");
}

function renderKotlinCases(grouped: Map<TypedErrorKind, string[]>): string {
	const lines: string[] = [];
	for (const kind of TYPED_ORDER) {
		const codes = grouped.get(kind)!;
		if (codes.length === 0) continue;
		const patterns = codes.map((c) => JSON.stringify(c)).join(", ");
		lines.push(`    ${patterns} ->`);
		lines.push(`        ${KT_CONSTRUCTORS[kind]}`);
	}
	return lines.join("\n");
}

function renderSwiftCases(grouped: Map<TypedErrorKind, string[]>): string {
	const lines: string[] = [];
	for (const kind of TYPED_ORDER) {
		const codes = grouped.get(kind)!;
		if (codes.length === 0) continue;
		const patterns = codes.map((c) => JSON.stringify(c)).join(", ");
		lines.push(`        case ${patterns}:`);
		lines.push(`            ${SWIFT_CASES[kind]}`);
	}
	return lines.join("\n");
}

function spliceGeneratedBlock(relPath: string, body: string): void {
	const absPath = path.join(ROOT, relPath);
	const current = fs.readFileSync(absPath, "utf8");
	const startIdx = current.indexOf(START_MARKER);
	const endIdx = current.indexOf(END_MARKER);
	if (startIdx < 0 || endIdx < 0 || endIdx < startIdx) {
		throw new Error(`Missing ${START_MARKER} ... ${END_MARKER} markers in ${relPath}`);
	}
	const startLineEnd = current.indexOf("\n", startIdx);
	const endLineStart = current.lastIndexOf("\n", endIdx) + 1;
	const indent = current.slice(endLineStart, endIdx);

	const next = current.slice(0, startLineEnd + 1) + body + "\n" + indent + current.slice(endIdx);

	if (next !== current) {
		fs.writeFileSync(absPath, next, "utf8");
	}
}

export function emitErrorTables(spec: Record<string, unknown>): void {
	const specCodes = readApiErrorCodes(spec);
	const grouped = validateAndGroupCodes(specCodes);

	const targets: Array<{ relPath: string; body: string }> = [
		{
			relPath: "public/sdks/template_overrides/typescript-fetch/errors.ts",
			body: renderTypeScriptCases(grouped),
		},
		{
			relPath: "public/sdks/template_overrides/kotlin/_DiscovrAuth.kt",
			body: renderKotlinCases(grouped),
		},
		{
			relPath: "public/sdks/template_overrides/swift6/_DiscovrAuth.swift",
			body: renderSwiftCases(grouped),
		},
	];

	for (const { relPath, body } of targets) {
		spliceGeneratedBlock(relPath, body);
		console.log(`✅  Synced error table: ${relPath}`);
	}
}
