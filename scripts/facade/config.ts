import * as path from "node:path";
import { fileURLToPath } from "node:url";

import type { CopyPair } from "./types";

/** This folder: `public/scripts/facade` — three levels below repo root. */
const FACADE_SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(FACADE_SCRIPT_DIR, "../../..");

export const SPEC_PATH = path.join(ROOT, "public/docs/openapi.yaml");
export const TS_OUT = path.join(ROOT, "public/sdks/typescript/src/_DiscovrClientBase.ts");
export const KT_OUT = path.join(
	ROOT,
	"public/sdks/kotlin/src/commonMain/kotlin/api/discovr/_DiscovrClientBase.kt",
);
export const SWIFT_OUT = path.join(
	ROOT,
	"public/sdks/swift/Sources/Discovr/_DiscovrClientBase.swift",
);

export const FACADE_SAMPLES_JSON_PATH = path.join(FACADE_SCRIPT_DIR, "../facade-doc-samples.json");

/**
 * Maps OpenAPI tag names → doc-site presentational config.
 * This is the only hardcoded list allowed — icons are Mintlify-specific
 * and don't belong in the OpenAPI spec.
 * New tags without an entry here fall back to order=99 and a generic icon.
 */
export const TAG_CONFIG: Record<string, { icon: string; sdkFile: string; order: number }> = {
	Authentication: { icon: "key", sdkFile: "authentication", order: 0 },
	Profiles: { icon: "user", sdkFile: "profiles", order: 1 },
	"Profile Lists": { icon: "list", sdkFile: "profile-lists", order: 2 },
	Scrobble: { icon: "radio", sdkFile: "scrobble", order: 3 },
	Pages: { icon: "file-text", sdkFile: "pages", order: 4 },
	Rows: { icon: "table-rows", sdkFile: "rows", order: 5 },
	Search: { icon: "search", sdkFile: "search", order: 6 },
	Media: { icon: "film", sdkFile: "media", order: 7 },
	Misc: { icon: "puzzle-piece", sdkFile: "misc", order: 8 },
};

/** Human-readable labels for each facade tier, used in generated code comments. */
export const TIER_LABELS: Record<string, string> = {
	identity: "Identity tier — refresh token bearer (/profiles, /auth/sessions)",
	session: "Session tier — session token bearer",
	public: "Public endpoints — no bearer required",
};

export const HAND_MAINTAINED_COPIES: readonly CopyPair[] = [
	{
		src: "public/sdks/template_overrides/typescript-fetch/_DiscovrAuth.ts",
		dst: "public/sdks/typescript/src/auth.ts",
	},
	{
		src: "public/sdks/template_overrides/typescript-fetch/errors.ts",
		dst: "public/sdks/typescript/src/errors.ts",
	},
	{
		src: "public/sdks/template_overrides/typescript-fetch/DiscovrClient.ts",
		dst: "public/sdks/typescript/src/DiscovrClient.ts",
	},
	{
		src: "public/sdks/template_overrides/typescript-fetch/_DiscovrCache.ts",
		dst: "public/sdks/typescript/src/_DiscovrCache.ts",
	},
	{
		src: "public/sdks/template_overrides/typescript-fetch/_RequestLoopGuard.ts",
		dst: "public/sdks/typescript/src/_RequestLoopGuard.ts",
	},
	{
		src: "public/sdks/template_overrides/typescript-fetch/_tests/_DiscovrCache.test.ts",
		dst: "public/sdks/typescript/src/_tests/_DiscovrCache.test.ts",
	},
	{
		src: "public/sdks/template_overrides/typescript-fetch/_tests/_RequestLoopGuard.test.ts",
		dst: "public/sdks/typescript/src/_tests/_RequestLoopGuard.test.ts",
	},
	{
		src: "public/sdks/template_overrides/typescript-fetch/_tests/_DiscovrAuth.test.ts",
		dst: "public/sdks/typescript/src/_tests/_DiscovrAuth.test.ts",
	},
	{
		src: "public/sdks/template_overrides/typescript-fetch/_tests/refOrId.test.ts",
		dst: "public/sdks/typescript/src/_tests/refOrId.test.ts",
	},
	{
		src: "public/sdks/template_overrides/kotlin/_DiscovrAuth.kt",
		dst: "public/sdks/kotlin/src/commonMain/kotlin/api/discovr/auth/_DiscovrAuth.kt",
	},
	{
		src: "public/sdks/template_overrides/kotlin/_SecureRandom.kt",
		dst: "public/sdks/kotlin/src/commonMain/kotlin/api/discovr/auth/_SecureRandom.kt",
	},
	{
		src: "public/sdks/template_overrides/kotlin/_Pkce.kt",
		dst: "public/sdks/kotlin/src/commonMain/kotlin/api/discovr/auth/_Pkce.kt",
	},
	{
		src: "public/sdks/template_overrides/kotlin/_PkceTest.kt",
		dst: "public/sdks/kotlin/src/commonTest/kotlin/api/discovr/auth/_PkceTest.kt",
	},
	{
		src: "public/sdks/template_overrides/kotlin/_SecureRandom.jvm.kt",
		dst: "public/sdks/kotlin/src/jvmMain/kotlin/api/discovr/auth/_SecureRandom.jvm.kt",
	},
	{
		src: "public/sdks/template_overrides/kotlin/_SecureRandom.ios.kt",
		dst: "public/sdks/kotlin/src/iosMain/kotlin/api/discovr/auth/_SecureRandom.ios.kt",
	},
	{
		src: "public/sdks/template_overrides/kotlin/_SecureRandom.js.kt",
		dst: "public/sdks/kotlin/src/jsMain/kotlin/api/discovr/auth/_SecureRandom.js.kt",
	},
	{
		src: "public/sdks/template_overrides/kotlin/DiscovrClient.kt",
		dst: "public/sdks/kotlin/src/commonMain/kotlin/api/discovr/DiscovrClient.kt",
	},
	{
		src: "public/sdks/template_overrides/kotlin/_DiscovrCache.kt",
		dst: "public/sdks/kotlin/src/commonMain/kotlin/api/discovr/_DiscovrCache.kt",
	},
	{
		src: "public/sdks/template_overrides/kotlin/_DiscovrCacheTest.kt",
		dst: "public/sdks/kotlin/src/commonTest/kotlin/api/discovr/_DiscovrCacheTest.kt",
	},
	{
		src: "public/sdks/template_overrides/kotlin/_RequestLoopGuard.kt",
		dst: "public/sdks/kotlin/src/commonMain/kotlin/api/discovr/auth/_RequestLoopGuard.kt",
	},
	{
		src: "public/sdks/template_overrides/kotlin/_RequestLoopGuardTest.kt",
		dst: "public/sdks/kotlin/src/commonTest/kotlin/api/discovr/auth/_RequestLoopGuardTest.kt",
	},
	{
		src: "public/sdks/template_overrides/kotlin/_DiscovrAuthTest.kt",
		dst: "public/sdks/kotlin/src/commonTest/kotlin/api/discovr/auth/_DiscovrAuthTest.kt",
	},
	{
		src: "public/sdks/template_overrides/kotlin/_RefOrIdTest.kt",
		dst: "public/sdks/kotlin/src/commonTest/kotlin/api/discovr/_RefOrIdTest.kt",
	},
	{
		src: "public/sdks/template_overrides/swift6/_DiscovrAuth.swift",
		dst: "public/sdks/swift/Sources/Discovr/_DiscovrAuth.swift",
	},
	{
		src: "public/sdks/template_overrides/swift6/_RequestLoopGuard.swift",
		dst: "public/sdks/swift/Sources/Discovr/_RequestLoopGuard.swift",
	},
	{
		src: "public/sdks/template_overrides/swift6/DiscovrClient.swift",
		dst: "public/sdks/swift/Sources/Discovr/DiscovrClient.swift",
	},
	{
		src: "public/sdks/template_overrides/swift6/_DiscovrCache.swift",
		dst: "public/sdks/swift/Sources/Discovr/_DiscovrCache.swift",
	},
	{
		src: "public/sdks/template_overrides/swift6/_RequestLoopGuardTest.swift",
		dst: "public/sdks/swift/Tests/DiscovrTests/_RequestLoopGuardTest.swift",
	},
	{
		src: "public/sdks/template_overrides/swift6/_DiscovrAuthTest.swift",
		dst: "public/sdks/swift/Tests/DiscovrTests/_DiscovrAuthTest.swift",
	},
	{
		src: "public/sdks/template_overrides/swift6/_RefOrIdTest.swift",
		dst: "public/sdks/swift/Tests/DiscovrTests/_RefOrIdTest.swift",
	},
];

export const STALE_FILES_TO_DELETE: readonly string[] = [
	"public/sdks/kotlin/src/commonMain/kotlin/api/discovr/auth/DiscoverAuth.kt",
	"public/sdks/swift/Sources/Discovr/DiscoverAuth.swift",
	"public/sdks/kotlin/src/commonMain/kotlin/api/discovr/auth/DiscovrAuth.kt",
	"public/sdks/swift/Sources/Discovr/DiscovrAuth.swift",
];
