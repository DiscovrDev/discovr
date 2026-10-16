import * as fs from "node:fs";
import * as path from "node:path";

import { SDK_METHOD_METADATA } from "../facade/sdk-method-metadata";
import { TAG_CONFIG } from "../facade/config";
import type { OasOperation, OpenAPISpec } from "../facade/types";
import { DOCS_JSON_PATH, SDK_DOCS_DIR } from "./config";
import { operationIdToFileName } from "./helpers";
import { buildNavigationGroups } from "./navigation";
import { buildApiRefNavGroups } from "./api-reference";

function upsertTab(docs: any, tabName: string, newTab: any): void {
	if (!docs.navigation) docs.navigation = {};
	if (!docs.navigation.tabs) docs.navigation.tabs = [];
	const idx = docs.navigation.tabs.findIndex((t: { tab: string }) => t.tab === tabName);
	if (idx >= 0) {
		docs.navigation.tabs[idx] = newTab;
	} else {
		docs.navigation.tabs.push(newTab);
	}
}

export function updateDocsJson(
	operationsByTag: Map<string, OasOperation[]>,
	spec: OpenAPISpec,
	typesPageSlugs: string[],
): void {
	const docsContent = fs.readFileSync(DOCS_JSON_PATH, "utf8");
	const docs = JSON.parse(docsContent);

	// The API Reference tab uses `menu` rather than `groups` for one reason:
	// Mintlify makes a tab's first page its click-through landing target, so
	// pinning "How to get playground credentials" as an ordinary nav entry
	// (in any position) either buries it below the endpoints or makes clicking
	// the "API Reference" tab itself open the guide instead of an endpoint —
	// tested locally against a real `mintlify dev` build, both ways confirmed.
	// A `menu` sidesteps that: the tab becomes a dropdown with two named
	// choices instead of a direct link, so the guide can be first without
	// being what a plain click lands on. The tradeoff, deliberately accepted:
	// reaching an endpoint now costs one extra click (tab → "Endpoints" →
	// page) instead of landing there directly.
	upsertTab(docs, "API Reference", {
		tab: "API Reference",
		menu: [
			{
				item: "How to get playground credentials",
				icon: "circle-play",
				pages: ["guides/getting-started/try-it-in-the-docs"],
			},
			{
				item: "Endpoints",
				icon: "code",
				groups: buildApiRefNavGroups(operationsByTag),
			},
		],
	});

	upsertTab(docs, "SDK Reference", {
		tab: "SDK Reference",
		groups: buildNavigationGroups(spec, operationsByTag, typesPageSlugs),
	});

	fs.writeFileSync(DOCS_JSON_PATH, JSON.stringify(docs, null, 2) + "\n", "utf8");
	console.log(`Updated ${DOCS_JSON_PATH}`);
}

export function collectExpectedFiles(
	operationsByTag: Map<string, OasOperation[]>,
	typesPageSlugs: string[],
): Set<string> {
	const expected = new Set<string>();
	expected.add("index.mdx");
	expected.add("authentication.mdx");

	expected.add("types/index.mdx");
	for (const slug of typesPageSlugs) {
		expected.add(`types/${slug}.mdx`);
	}

	for (const method of SDK_METHOD_METADATA) {
		expected.add(`authentication/${operationIdToFileName(method.id)}.mdx`);
	}

	for (const [tag, ops] of operationsByTag.entries()) {
		const cfg = TAG_CONFIG[tag];
		const sdkFile = cfg?.sdkFile ?? tag.toLowerCase().replace(/\s+/g, "-");
		for (const op of ops) {
			if (op.operationId) {
				expected.add(`${sdkFile}/${operationIdToFileName(op.operationId)}.mdx`);
			}
		}
	}

	return expected;
}

export function cleanupStaleFiles(expected: Set<string>): void {
	const walkDir = (dir: string, relativePath = ""): void => {
		if (!fs.existsSync(dir)) return;
		for (const entry of fs.readdirSync(dir)) {
			const fullPath = path.join(dir, entry);
			const relPath = relativePath ? `${relativePath}/${entry}` : entry;
			const stat = fs.statSync(fullPath);
			if (stat.isDirectory()) {
				walkDir(fullPath, relPath);
			} else if (entry.endsWith(".mdx") && !expected.has(relPath)) {
				console.log(`  Removing stale file: ${relPath}`);
				fs.unlinkSync(fullPath);
			}
		}
	};
	walkDir(SDK_DOCS_DIR);
}
