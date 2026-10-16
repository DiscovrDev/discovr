import type { OpenAPISpec } from "../facade/types";
import { escapeMarkdown, sanitizeMdxProse } from "./helpers";
import { typeLink } from "./schema-map";
import { generateInlineTypeFromSchema } from "./schema-to-json";
import type { LangSnippets, OptionalLangSnippets, OptionalLangSignature } from "./types";

const LANGS = [
	{ key: "typescript", fence: "typescript", label: "TypeScript" },
	{ key: "kotlin", fence: "kotlin", label: "Kotlin" },
	{ key: "swift", fence: "swift", label: "Swift" },
] as const;

/**
 * A `null` entry means the method genuinely doesn't exist in that language, so
 * its tab is omitted rather than filled with the nearest-looking alternative.
 * `signInWithPopup` used to show a Kotlin device-code example under a
 * `signInWithPopup()` heading, which is worse than showing nothing.
 */
function generateCodeGroup(snippets: LangSnippets | OptionalLangSnippets): string {
	const blocks = LANGS.filter((l) => snippets[l.key])
		.map((l) => `\`\`\`${l.fence} ${l.label}\n${snippets[l.key]}\n\`\`\``)
		.join("\n\n");

	return `<CodeGroup>\n\n${blocks}\n\n</CodeGroup>`;
}

/**
 * Renders the per-language signatures. These were carried in the metadata but
 * never emitted, so wrong ones (a `signInWithDeviceCode` signature filed under
 * `signInWithPopup`) sat invisible and uncorrected.
 */
function generateSignatureBlock(signature: OptionalLangSignature): string {
	const available = LANGS.filter((l) => signature[l.key]);
	if (available.length === 0) return "";

	const missing = LANGS.filter((l) => !signature[l.key]);
	const blocks = available
		.map((l) => `\`\`\`${l.fence} ${l.label}\n${signature[l.key]}\n\`\`\``)
		.join("\n\n");

	let out = `## Signature\n\n<CodeGroup>\n\n${blocks}\n\n</CodeGroup>\n\n`;
	if (missing.length > 0) {
		const names = missing.map((l) => l.label).join(" or ");
		out += `<Info>\n\tNot available in ${names}. See the guide for the equivalent on those platforms.\n</Info>\n\n`;
	}
	return out;
}

function generateParamsTable(
	params: Array<{ name: string; type: string; required: boolean; description: string }>,
	typePageMap?: Map<string, string>,
): string {
	if (params.length === 0) return "No parameters.";

	let table = "| Name | Type | Required | Description |\n";
	table += "|------|------|----------|-------------|\n";
	for (const param of params) {
		const typeCell = typePageMap
			? typeLink(param.type, typePageMap)
			: `\`${escapeMarkdown(param.type)}\``;
		table += `| ${param.name} | ${typeCell} | ${param.required ? "Yes" : "No"} | ${param.description} |\n`;
	}
	return table;
}

export function generateMethodPage(
	methodId: string,
	summary: string,
	description: string,
	params: Array<{ name: string; type: string; required: boolean; description: string }>,
	returns: { type: string; description: string },
	snippets: LangSnippets | OptionalLangSnippets,
	spec: OpenAPISpec,
	typePageMap: Map<string, string>,
	signature?: OptionalLangSignature,
): string {
	let mdx = `---
title: "${methodId}()"
description: "${summary || description}"
---

${sanitizeMdxProse(description)}

`;

	if (signature) {
		mdx += generateSignatureBlock(signature);
	}

	if (params.length > 0) {
		mdx += `## Parameters\n\n`;
		mdx += generateParamsTable(params, typePageMap);
		mdx += "\n\n";

		const complexParamTypes = [
			...new Set(params.map((p) => p.type).filter((t) => typePageMap.has(t))),
		];
		if (complexParamTypes.length > 0) {
			mdx += `<AccordionGroup>\n`;
			for (const typeName of complexParamTypes) {
				const inlineTypeDef = generateInlineTypeFromSchema(typeName, spec);
				if (inlineTypeDef) {
					mdx += `<Accordion title="View ${typeName} structure">\n`;
					mdx += `\`\`\`json\n${inlineTypeDef}\n\`\`\`\n`;
					mdx += `</Accordion>\n`;
				}
			}
			mdx += `</AccordionGroup>\n\n`;
		}
	}

	mdx += `## Returns\n\n`;
	mdx += `${typeLink(returns.type, typePageMap)} — ${sanitizeMdxProse(returns.description)}\n\n`;

	const inlineTypeDef = generateInlineTypeFromSchema(returns.type, spec);
	if (inlineTypeDef) {
		mdx += `<AccordionGroup>\n`;
		mdx += `<Accordion title="View response structure">\n`;
		mdx += `\`\`\`json\n${inlineTypeDef}\n\`\`\`\n`;
		mdx += `</Accordion>\n`;
		mdx += `</AccordionGroup>\n\n`;
	}

	mdx += `## Example\n\n`;
	mdx += generateCodeGroup(snippets);
	mdx += "\n\n";

	return mdx;
}
