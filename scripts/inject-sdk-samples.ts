/**
 * Writes `x-codeSamples` onto `public/docs/openapi.yaml` from façade JSON only
 * (`facade-doc-samples.json`, produced by `generate-sdk-facade.ts`).
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import yaml from "js-yaml";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "../..");

const OPENAPI_FILE = path.join(ROOT, "public/docs/openapi.yaml");
const FACADE_SNIPPETS_JSON = path.join(SCRIPT_DIR, "facade-doc-samples.json");

const STRICT = process.env.INJECT_SDK_SAMPLES_STRICT !== "0";

interface CodeSample {
	lang: string;
	label: string;
	source: string;
}

interface FacadeSamplesEntry {
	readonly typescript: string;
	readonly kotlin: string;
	readonly swift: string;
}

interface OpenApiOperation {
	operationId?: string;
	tags?: string[];
	"x-codeSamples"?: CodeSample[];
	[key: string]: unknown;
}

interface OpenApiSpec {
	paths?: Record<string, Record<string, OpenApiOperation>>;
}

function loadFacadeSamples(): Record<string, FacadeSamplesEntry> {
	if (!fs.existsSync(FACADE_SNIPPETS_JSON)) {
		throw new Error(
			`Missing ${FACADE_SNIPPETS_JSON} — run npm run generate:sdk:all or tsx public/scripts/generate-sdk-facade.ts first.`,
		);
	}
	try {
		return JSON.parse(fs.readFileSync(FACADE_SNIPPETS_JSON, "utf8")) as Record<
			string,
			FacadeSamplesEntry
		>;
	} catch (e) {
		throw new Error(`Failed parsing façade snippets JSON: ${e}`);
	}
}

function snippetFromFacade(
	facade: Record<string, FacadeSamplesEntry>,
	operationId: string,
	key: keyof FacadeSamplesEntry,
): string {
	const ent = facade[operationId];
	if (!ent) return "";
	const src = ent[key];
	return typeof src === "string" && src.length ? src : "";
}

function main(): void {
	console.log("💉 Injecting SDK code samples into OpenAPI spec (façade JSON only)...");

	let facade: Record<string, FacadeSamplesEntry>;
	try {
		facade = loadFacadeSamples();
	} catch (err) {
		console.error(err instanceof Error ? err.message : String(err));
		process.exit(1);
	}

	const spec = yaml.load(fs.readFileSync(OPENAPI_FILE, "utf8")) as OpenApiSpec;

	let totalInjected = 0;
	const missingSnippet: string[] = [];

	const paths = spec.paths;
	if (!paths) {
		console.error("Spec has no paths — aborting.");
		process.exit(1);
	}

	const languageRows: readonly { key: keyof FacadeSamplesEntry; lang: string; label: string }[] = [
		{ key: "typescript", lang: "javascript", label: "TypeScript" },
		{ key: "kotlin", lang: "kotlin", label: "Kotlin" },
		{ key: "swift", lang: "swift", label: "Swift" },
	];

	for (const pathKey in paths) {
		for (const method in paths[pathKey]) {
			const operation = paths[pathKey][method];
			if (!operation?.operationId) continue;

			const samples: CodeSample[] = [];
			const opId = operation.operationId;

			for (const { key, lang, label } of languageRows) {
				const snippet = snippetFromFacade(facade, opId, key);
				if (!snippet.trim()) continue;
				samples.push({
					lang,
					label,
					source: snippet,
				});
				totalInjected++;
			}

			const trio = facade[opId];
			if (
				STRICT &&
				(!trio ||
					!snippetFromFacade(facade, opId, "typescript").trim() ||
					!snippetFromFacade(facade, opId, "kotlin").trim() ||
					!snippetFromFacade(facade, opId, "swift").trim())
			) {
				missingSnippet.push(opId);
			}

			if (samples.length > 0) {
				operation["x-codeSamples"] = samples;
			}
		}
	}

	fs.writeFileSync(OPENAPI_FILE, yaml.dump(spec, { noRefs: true, lineWidth: -1 }));

	if (STRICT && missingSnippet.length) {
		console.error(
			"❌ Missing or incomplete façade snippets (need TypeScript + Kotlin + Swift for every operation):",
			...missingSnippet.map((x) => `\n - ${x}`),
		);
		process.exit(1);
	}

	console.log(
		`✅ Injected ${totalInjected} code-sample entries into openapi.yaml (strict=${STRICT})`,
	);
}

main();
