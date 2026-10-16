import { TAG_CONFIG } from "../facade/config";
import type { OpenAPISpec } from "../facade/types";
import { escapeMarkdown, toAnchorId } from "./helpers";

/**
 * Walks each operation's schema tree, attributing each referenced schema to the
 * primary OpenAPI tag of the operation that first discovers it. Schemas reached
 * by more than one tag are assigned to "common".
 *
 * Returns Map<schemaName, pageSlug> where pageSlug is the TAG_CONFIG sdkFile
 * value (e.g. "pages", "rows", "media") or "common".
 */
export function buildSchemaTagMap(spec: OpenAPISpec): Map<string, string> {
	const schemas = (spec.components?.schemas ?? {}) as Record<string, any>;
	const schemaToTags = new Map<string, Set<string>>();

	function walk(schema: any, tag: string, seen: Set<string>, depth = 0): void {
		if (!schema || depth > 20) return;
		if (schema.$ref) {
			const name = (schema.$ref as string).split("/").pop()!;
			if (seen.has(name)) return;
			seen.add(name);
			if (!schemaToTags.has(name)) schemaToTags.set(name, new Set());
			schemaToTags.get(name)!.add(tag);
			if (schemas[name]) walk(schemas[name], tag, seen, depth + 1);
			return;
		}
		for (const v of [...(schema.oneOf ?? []), ...(schema.anyOf ?? []), ...(schema.allOf ?? [])]) {
			walk(v, tag, seen, depth + 1);
		}
		for (const p of Object.values(schema.properties ?? {})) {
			walk(p as any, tag, seen, depth + 1);
		}
		if (schema.items) walk(schema.items, tag, seen, depth + 1);
	}

	for (const methods of Object.values(spec.paths ?? {})) {
		for (const op of Object.values(methods as object)) {
			const o = op as any;
			if (!o.operationId || o["x-tier"] === "facade-skip") continue;
			const tags: string[] = o.tags ?? [];
			const primaryTag = tags.find((t: string) => t !== "Discovr") ?? "common";
			const seen = new Set<string>();
			for (const r of Object.values(o.responses ?? {})) {
				walk((r as any).content?.["application/json"]?.schema, primaryTag, seen);
			}
			walk(o.requestBody?.content?.["application/json"]?.schema, primaryTag, seen);
			for (const p of o.parameters ?? []) {
				walk(p.schema, primaryTag, seen);
			}
		}
	}

	const tagToSlug = (tag: string): string => {
		if (tag === "common") return "common";
		return TAG_CONFIG[tag]?.sdkFile ?? tag.toLowerCase().replace(/\s+/g, "-");
	};

	const result = new Map<string, string>();
	for (const [name, tags] of schemaToTags) {
		const list = [...tags];
		result.set(name, list.length === 1 ? tagToSlug(list[0]) : "common");
	}
	return result;
}

/** Returns a linked type reference if the type is known, otherwise plain backtick text. */
export function typeLink(typeName: string, typePageMap: Map<string, string>): string {
	const slug = typePageMap.get(typeName);
	if (!slug) return `\`${escapeMarkdown(typeName)}\``;
	return `[\`${escapeMarkdown(typeName)}\`](/sdk-reference/types/${slug}#${toAnchorId(typeName)})`;
}
