import { TAG_CONFIG } from "../facade/config";
import { dereferenceSchema } from "../facade/schema-utils";
import type { OpenAPISpec } from "../facade/types";
import { sanitizeMdxProse, toAnchorId } from "./helpers";

function resolvePropertyTypeStr(prop: any, schemas: Record<string, any>): string {
	const resolved = dereferenceSchema(schemas, prop) ?? prop;
	if (!resolved) return "any";
	if (resolved.$ref) {
		const name = (resolved.$ref as string).split("/").pop()!;
		return `\`${name}\``;
	}
	if (resolved.type === "array") {
		const itemResolved = dereferenceSchema(schemas, resolved.items) ?? resolved.items;
		const itemName =
			(resolved.items as any)?.$ref?.split("/").pop() ??
			itemResolved?.title ??
			itemResolved?.type ??
			"any";
		return `\`${itemName}[]\``;
	}
	if (resolved.enum) {
		return resolved.enum.map((e: any) => `\`"${e}"\``).join(" \\| ");
	}
	if (resolved.type === "object") return "`object`";
	return `\`${resolved.type ?? "any"}\``;
}

function buildPropertiesTable(schema: any, schemas: Record<string, any>): string {
	const properties: Record<string, any> = schema.properties ?? {};
	const required = new Set<string>(schema.required ?? []);

	if (Object.keys(properties).length === 0) return "";

	let table = "| Property | Type | Required | Description |\n";
	table += "|----------|------|----------|-------------|\n";

	for (const [propName, propSchema] of Object.entries(properties)) {
		const typeStr = resolvePropertyTypeStr(propSchema as any, schemas);
		const req = required.has(propName) ? "Yes" : "No";
		const rawDesc = ((propSchema as any).description as string | undefined) ?? "";
		const desc = rawDesc
			.trim()
			.replace(/\n\s+/g, " ")
			.replace(/\s+/g, " ")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/{/g, "&#123;")
			.replace(/}/g, "&#125;")
			.replace(/\|/g, "\\|")
			.replace(/\[/g, "\\[")
			.replace(/\]/g, "\\]");
		table += `| ${propName} | ${typeStr} | ${req} | ${desc} |\n`;
	}

	return table + "\n";
}

/** TAG_CONFIG-driven slug order (matching sdk-reference nav order), "common" always last. */
function getOrderedTypePageSlugs(availableSlugs: ReadonlySet<string>): string[] {
	const tagOrder = Object.values(TAG_CONFIG)
		.sort((a, b) => a.order - b.order)
		.map((c) => c.sdkFile);
	const allSlugs = [...new Set([...tagOrder, ...availableSlugs])].filter((s) =>
		availableSlugs.has(s),
	);
	return [...allSlugs.filter((s) => s !== "common"), ...allSlugs.filter((s) => s === "common")];
}

function tagNameForSlug(slug: string): string {
	const tagEntry = Object.entries(TAG_CONFIG).find(([, cfg]) => cfg.sdkFile === slug);
	return tagEntry?.[0] ?? slug;
}

function typePageTitle(slug: string): string {
	return slug === "common" ? "Common Types" : `${tagNameForSlug(slug)} Types`;
}

function generateTypeSection(name: string, schema: any, schemas: Record<string, any>): string {
	const anchor = toAnchorId(name);
	// HTML anchor — `{#slug}` after headings is parsed as invalid MDX.
	let mdx = `## ${name}\n\n<a id="${anchor}" />\n\n`;
	if (schema.description) {
		mdx += `${sanitizeMdxProse(schema.description.trim())}\n\n`;
	}

	const resolved = dereferenceSchema(schemas, schema) ?? schema;

	// Discriminated union → sub-sections per variant
	if (resolved.oneOf || resolved.anyOf) {
		const variants: any[] = resolved.oneOf ?? resolved.anyOf;
		const discriminatorKey = resolved.discriminator?.propertyName as string | undefined;
		if (discriminatorKey) {
			mdx += `Discriminated union on \`${discriminatorKey}\`.\n\n`;
		}
		for (const v of variants) {
			const refName = (v.$ref as string | undefined)?.split("/").pop();
			const vResolved = dereferenceSchema(schemas, v) ?? v;
			const label = v.title ?? refName ?? "Variant";
			mdx += `### ${label}\n\n`;
			if (vResolved.description) {
				mdx += `${sanitizeMdxProse(vResolved.description.trim())}\n\n`;
			}
			mdx += buildPropertiesTable(vResolved, schemas);
		}
		return mdx;
	}

	// Plain object
	if (resolved.type === "object" || resolved.properties) {
		mdx += buildPropertiesTable(resolved, schemas);
		return mdx;
	}

	// Enum
	if (resolved.enum) {
		mdx += `Allowed values: ${(resolved.enum as any[]).map((e) => `\`"${e}"\``).join(", ")}\n\n`;
		return mdx;
	}

	// Primitive
	if (resolved.type) {
		mdx += `Type: \`${resolved.type}\`\n\n`;
	}

	return mdx;
}

/**
 * Generates one MDX file per type-page slug (e.g. "pages", "rows", "common").
 * Returns Map<slug, mdxContent>.
 */
export function generateTypesPages(
	spec: OpenAPISpec,
	typePageMap: Map<string, string>,
): Map<string, string> {
	const schemas = (spec.components?.schemas ?? {}) as Record<string, any>;

	// Group schema names by destination slug
	const bySlug = new Map<string, string[]>();
	for (const [typeName, slug] of typePageMap) {
		if (!schemas[typeName]) continue;
		if (!bySlug.has(slug)) bySlug.set(slug, []);
		bySlug.get(slug)!.push(typeName);
	}

	const pages = new Map<string, string>();
	const orderedSlugs = getOrderedTypePageSlugs(new Set(bySlug.keys()));

	for (const slug of orderedSlugs) {
		const typeNames = bySlug.get(slug)!.sort();
		const title = typePageTitle(slug);
		const desc =
			slug === "common"
				? "Shared types used across multiple SDK operations."
				: `Types used by ${tagNameForSlug(slug)} SDK operations.`;

		let mdx = `---\ntitle: "${title}"\ndescription: "${desc}"\n---\n\n`;
		for (const name of typeNames) {
			mdx += generateTypeSection(name, schemas[name], schemas);
		}
		pages.set(slug, mdx);
	}

	return pages;
}

/**
 * Generates the `sdk-reference/types` landing page — links out to each
 * per-tag types page generated above, so `/sdk-reference/types` itself
 * (linked from several guides) resolves to real content instead of 404ing.
 */
export function generateTypesIndexPage(typesPages: Map<string, string>): string {
	const orderedSlugs = getOrderedTypePageSlugs(new Set(typesPages.keys()));

	let mdx = `---\ntitle: "Type Reference"\ndescription: "Wire types and response shapes for every Discovr SDK operation, grouped by area."\n---\n\n`;
	mdx +=
		"Full property tables for every request and response type, grouped by the area that uses them.\n\n";
	for (const slug of orderedSlugs) {
		mdx += `- [${typePageTitle(slug)}](/sdk-reference/types/${slug})\n`;
	}
	return mdx;
}
