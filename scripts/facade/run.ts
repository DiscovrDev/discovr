import * as fs from "node:fs";
import * as path from "node:path";

import {
	DISALLOWED_SCHEMA_NAME,
	HAND_MAINTAINED_COPIES,
	KT_OUT,
	ROOT,
	STALE_FILES_TO_DELETE,
	SWIFT_OUT,
	TS_OUT,
} from "./config";
import { emitFacadeSamplesJson } from "./emit-doc-samples";
import { emitErrorTables } from "./emit-error-tables";
import { generateKotlin } from "./emit-kotlin";
import { generateSwift } from "./emit-swift";
import { generateTypeScript } from "./emit-typescript";
import { buildOperations, loadSpecFromDisk } from "./parse-openapi";

function ensureDir(filePath: string): void {
	const dir = path.dirname(filePath);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function assertCleanSpecSchemas(
	spec: ReturnType<typeof loadSpecFromDisk>,
	ops: ReturnType<typeof buildOperations>,
): void {
	const badSchemas = Object.keys(spec.components?.schemas ?? {})
		.filter((name) => DISALLOWED_SCHEMA_NAME.test(name))
		.sort();
	const badReturnTypes = ops
		.map((op) => op.returnTypeName)
		.filter((name) => DISALLOWED_SCHEMA_NAME.test(name))
		.sort();
	const bad = [...new Set([...badSchemas, ...badReturnTypes])];
	if (bad.length > 0) {
		throw new Error(
			`Disallowed schema / return type name(s) in bundled spec: ${bad.join(", ")}. ` +
				`Give every schema an explicit name and register it in public/open_api/public.yaml.`,
		);
	}
}

export function runFacadeGeneration(): void {
	const spec = loadSpecFromDisk();
	const ops = buildOperations(spec);
	assertCleanSpecSchemas(spec, ops);

	console.log(`\n🔨  Facade generator: ${ops.length} operations classified`);
	console.log(
		`    identity: ${ops.filter((o) => o.tier === "identity").length}  ` +
			`session: ${ops.filter((o) => o.tier === "session").length}  ` +
			`public: ${ops.filter((o) => o.tier === "public").length}`,
	);

	const tsCode = generateTypeScript(ops);
	const ktCode = generateKotlin(ops);
	const swiftCode = generateSwift(ops);

	ensureDir(TS_OUT);
	fs.writeFileSync(TS_OUT, tsCode, "utf8");
	console.log(`✅  Written: ${path.relative(ROOT, TS_OUT)}`);

	ensureDir(KT_OUT);
	fs.writeFileSync(KT_OUT, ktCode, "utf8");
	console.log(`✅  Written: ${path.relative(ROOT, KT_OUT)}`);

	ensureDir(SWIFT_OUT);
	fs.writeFileSync(SWIFT_OUT, swiftCode, "utf8");
	console.log(`✅  Written: ${path.relative(ROOT, SWIFT_OUT)}`);

	emitFacadeSamplesJson(spec, ops);

	console.log("\n🔁  Generating SDK error tables from ApiErrorCode...");
	emitErrorTables(spec as unknown as Record<string, unknown>);

	console.log("\n📋  Copying hand-maintained SDK files...");
	for (const { src, dst } of HAND_MAINTAINED_COPIES) {
		const srcAbs = path.join(ROOT, src);
		const dstAbs = path.join(ROOT, dst);
		if (!fs.existsSync(srcAbs)) {
			console.warn(`⚠️   Source not found, skipping: ${src}`);
			continue;
		}
		ensureDir(dstAbs);
		fs.copyFileSync(srcAbs, dstAbs);
		console.log(`✅  Copied: ${src} → ${dst}`);
	}

	for (const stale of STALE_FILES_TO_DELETE) {
		const abs = path.join(ROOT, stale);
		if (fs.existsSync(abs)) {
			fs.unlinkSync(abs);
			console.log(`🗑️   Removed stale file: ${stale}`);
		}
	}
}
