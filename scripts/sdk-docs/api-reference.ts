import * as fs from "node:fs";
import * as path from "node:path";

import { TAG_CONFIG } from "../facade/config";
import type { OasOperation, OpenAPISpec } from "../facade/types";
import { operationIdToFileName } from "./helpers";
import { getSubGroupedOps } from "./operations";

const SCRIPT_DIR = __dirname;
const API_REF_DISCOVR_DIR = path.join(SCRIPT_DIR, "../../docs/api-reference/discovr");

function findOperationPath(
	spec: OpenAPISpec,
	operationId: string,
): { method: string; path: string } | null {
	for (const [pathStr, pathItem] of Object.entries(spec.paths ?? {})) {
		for (const [method, op] of Object.entries(pathItem as object)) {
			if ((op as any).operationId === operationId) {
				return { method: method.toUpperCase(), path: pathStr };
			}
		}
	}
	return null;
}

/**
 * Generates one MDX stub per operation in api-reference/discovr/.
 * Mintlify reads `title` + `openapi` from the frontmatter and renders
 * the full API reference page (request, response, code samples) from the
 * bundled openapi.yaml — so no body content is needed.
 */
export function generateApiRefStubs(
	spec: OpenAPISpec,
	operationsByTag: Map<string, OasOperation[]>,
): void {
	if (!fs.existsSync(API_REF_DISCOVR_DIR)) {
		fs.mkdirSync(API_REF_DISCOVR_DIR, { recursive: true });
	}

	const seen = new Set<string>();

	for (const ops of operationsByTag.values()) {
		for (const op of ops) {
			if (!op.operationId || seen.has(op.operationId)) continue;
			seen.add(op.operationId);

			const location = findOperationPath(spec, op.operationId);
			if (!location) continue;

			const summary = (op as any).summary ?? op.operationId;
			const fileName = operationIdToFileName(op.operationId);
			const filePath = path.join(API_REF_DISCOVR_DIR, `${fileName}.mdx`);
			const content = `---\ntitle: "${summary}"\nopenapi: "${location.method} ${location.path}"\n---\n`;
			fs.writeFileSync(filePath, content, "utf8");
			console.log(`  Generated api-reference/discovr/${fileName}.mdx`);
		}
	}
}

/** Removes MDX stubs for operations that no longer exist in the spec. */
export function cleanupStaleApiRefStubs(operationsByTag: Map<string, OasOperation[]>): void {
	if (!fs.existsSync(API_REF_DISCOVR_DIR)) return;

	const expected = new Set<string>();
	for (const ops of operationsByTag.values()) {
		for (const op of ops) {
			if (op.operationId) expected.add(`${operationIdToFileName(op.operationId)}.mdx`);
		}
	}

	for (const file of fs.readdirSync(API_REF_DISCOVR_DIR)) {
		if (file.endsWith(".mdx") && !expected.has(file)) {
			console.log(`  Removing stale api-reference/discovr/${file}`);
			fs.unlinkSync(path.join(API_REF_DISCOVR_DIR, file));
		}
	}
}

/**
 * Builds the endpoint groups for the API Reference tab, using the same
 * TAG_CONFIG order and x-sdk-group sub-grouping as the SDK Reference tab.
 * All pages point to api-reference/discovr/<operationId-slug>.
 *
 * This is wrapped as the "Endpoints" item of that tab's `menu` in
 * `docs-json.ts`, not attached directly as the tab's `groups` — see the
 * comment there for why.
 */
export function buildApiRefNavGroups(operationsByTag: Map<string, OasOperation[]>): any[] {
	const groups: any[] = [];

	const sortedTags = Object.entries(TAG_CONFIG).sort(([, a], [, b]) => a.order - b.order);

	for (const [tag, cfg] of sortedTags) {
		const ops = operationsByTag.get(tag);
		if (!ops?.length) continue;

		const subGrouped = getSubGroupedOps(ops);
		const hasSubGroups = [...subGrouped.keys()].some((k) => k !== "");

		if (hasSubGroups) {
			const subGroupPages: any[] = [];

			const ungrouped = subGrouped.get("") ?? [];
			for (const op of ungrouped) {
				if (op.operationId) {
					subGroupPages.push(`api-reference/discovr/${operationIdToFileName(op.operationId)}`);
				}
			}

			for (const [groupName, groupOps] of subGrouped.entries()) {
				if (!groupName) continue;
				const subPages = groupOps
					.filter((o) => o.operationId)
					.map((o) => `api-reference/discovr/${operationIdToFileName(o.operationId!)}`);
				subGroupPages.push({ group: groupName, icon: "list", pages: subPages });
			}

			groups.push({ group: tag, icon: cfg.icon, pages: subGroupPages });
		} else {
			const pages = ops
				.filter((o) => o.operationId)
				.map((o) => `api-reference/discovr/${operationIdToFileName(o.operationId!)}`);
			groups.push({ group: tag, icon: cfg.icon, pages });
		}
	}

	// Tags present in the spec but not yet in TAG_CONFIG get a flat group at the end
	for (const [tag, ops] of operationsByTag.entries()) {
		if (TAG_CONFIG[tag]) continue;
		const pages = ops
			.filter((o) => o.operationId)
			.map((o) => `api-reference/discovr/${operationIdToFileName(o.operationId!)}`);
		if (pages.length) groups.push({ group: tag, icon: "file-text", pages });
	}

	return groups;
}
