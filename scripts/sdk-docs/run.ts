import * as fs from "node:fs";
import * as path from "node:path";

import { loadSpecFromDisk } from "../facade/parse-openapi";
import { SDK_METHOD_METADATA } from "../facade/sdk-method-metadata";
import { TAG_CONFIG } from "../facade/config";
import { FACADE_SAMPLES_PATH, SDK_DOCS_DIR } from "./config";
import { cleanDescription, toKebabCase } from "./helpers";
import { buildSchemaTagMap } from "./schema-map";
import { getOperationsByTag, buildOperationDoc } from "./operations";
import { generateTypesPages, generateTypesIndexPage } from "./generate-types-pages";
import { generateMethodPage } from "./generate-method-pages";
import { buildIndexNav, generateIndexPage } from "./generate-index-page";
import { updateDocsJson, collectExpectedFiles, cleanupStaleFiles } from "./docs-json";
import { generateApiRefStubs, cleanupStaleApiRefStubs } from "./api-reference";
import type { FacadeSamples } from "./types";

export async function generateSDKDocs(): Promise<void> {
	if (!fs.existsSync(SDK_DOCS_DIR)) {
		fs.mkdirSync(SDK_DOCS_DIR, { recursive: true });
	}

	console.log("Loading OpenAPI spec...");
	const spec = loadSpecFromDisk();

	console.log("Loading facade samples...");
	let facadeSamples: FacadeSamples = {};
	if (fs.existsSync(FACADE_SAMPLES_PATH)) {
		facadeSamples = JSON.parse(fs.readFileSync(FACADE_SAMPLES_PATH, "utf8"));
	} else {
		console.warn(`Warning: ${FACADE_SAMPLES_PATH} not found`);
	}

	const operationsByTag = getOperationsByTag(spec);

	console.log("Building schema → tag map...");
	const typePageMap = buildSchemaTagMap(spec);
	const typesPages = generateTypesPages(spec, typePageMap);
	const typesPageSlugs = [...typesPages.keys()];

	console.log("Cleaning up stale files...");
	cleanupStaleFiles(collectExpectedFiles(operationsByTag, typesPageSlugs));
	cleanupStaleApiRefStubs(operationsByTag);

	console.log("Generating API reference stubs...");
	generateApiRefStubs(spec, operationsByTag);

	console.log("Generating index page...");
	fs.writeFileSync(
		path.join(SDK_DOCS_DIR, "index.mdx"),
		generateIndexPage(buildIndexNav(operationsByTag, SDK_METHOD_METADATA[0]?.id)),
		"utf8",
	);

	console.log("Generating authentication pages (hand-maintained methods)...");
	const authDir = path.join(SDK_DOCS_DIR, "authentication");
	if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });
	for (const method of SDK_METHOD_METADATA) {
		const fileName = toKebabCase(method.id);
		const cleanedParams = method.params.map((p) => ({
			...p,
			description: cleanDescription(p.description),
		}));
		const mdx = generateMethodPage(
			method.id,
			method.summary,
			method.description,
			cleanedParams,
			method.returns,
			method.snippets,
			spec,
			typePageMap,
			method.signature,
		);
		fs.writeFileSync(path.join(authDir, `${fileName}.mdx`), mdx, "utf8");
		console.log(`  Generated authentication/${fileName}.mdx`);
	}

	console.log("Generating operation pages (spec-driven by tag)...");
	for (const [tag, ops] of operationsByTag.entries()) {
		const cfg = TAG_CONFIG[tag];
		const sdkFile = cfg?.sdkFile ?? tag.toLowerCase().replace(/\s+/g, "-");
		const categoryDir = path.join(SDK_DOCS_DIR, sdkFile);
		if (!fs.existsSync(categoryDir)) fs.mkdirSync(categoryDir, { recursive: true });

		for (const op of ops) {
			if (!op.operationId) continue;
			const snippets = facadeSamples[op.operationId];
			if (!snippets) continue;

			const doc = buildOperationDoc(spec, op, snippets);
			if (!doc) continue;

			const fileName = toKebabCase(op.operationId);
			const mdx = generateMethodPage(
				doc.operationId,
				doc.summary,
				doc.description,
				doc.params,
				doc.returns,
				doc.snippets,
				spec,
				typePageMap,
			);
			fs.writeFileSync(path.join(categoryDir, `${fileName}.mdx`), mdx, "utf8");
			console.log(`  Generated ${sdkFile}/${fileName}.mdx`);
		}
	}

	console.log(`Generating types pages (${typesPageSlugs.join(", ")})...`);
	const typesDir = path.join(SDK_DOCS_DIR, "types");
	if (!fs.existsSync(typesDir)) fs.mkdirSync(typesDir, { recursive: true });
	for (const [slug, content] of typesPages) {
		fs.writeFileSync(path.join(typesDir, `${slug}.mdx`), content, "utf8");
		console.log(`  Generated types/${slug}.mdx`);
	}
	fs.writeFileSync(path.join(typesDir, "index.mdx"), generateTypesIndexPage(typesPages), "utf8");
	console.log("  Generated types/index.mdx");

	console.log("Updating docs.json navigation...");
	updateDocsJson(operationsByTag, spec, typesPageSlugs);

	console.log("\n✓ SDK documentation generated successfully!");
}
