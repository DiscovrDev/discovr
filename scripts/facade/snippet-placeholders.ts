import { dereferenceSchema } from "./schema-utils";
import type { BoundParam, JsonSchema } from "./types";

export type DocSnippetLang = "ts" | "kt" | "swift";

/** Derive literals for Mintlify snippets from resolved OpenAPI schemas (example/default/enum/type). */
export function snippetPlaceholder(
	lang: DocSnippetLang,
	schemas: JsonSchemaMap,
	p: BoundParam,
	operationId?: string,
): string {
	// Enum-constrained path/query params are typed as per-operation nested enums
	// by the Kotlin and Swift façade generators, so a quoted string here produces
	// a sample that doesn't compile when copied. Body properties are unaffected —
	// the generator nests those on the payload data class instead.
	const enumRef = nestedEnumReference(lang, schemas, p, operationId);
	if (enumRef) return enumRef;

	const ex = effectiveExample(p, schemas);
	if (ex !== undefined) return emitFromJsonValue(lang, ex);
	return placeholderFromSchema(lang, schemas, p.placeholderSchema, p.refName);
}

/**
 * `DiscovrApi.FormatRequestDeviceCode.json` / `DiscovrAPI.Format_requestDeviceCode.json`,
 * matching `ktParamType` in emit-kotlin.ts and `swiftParamType` in emit-swift.ts.
 * TypeScript takes a plain string union, so it keeps the literal.
 */
function nestedEnumReference(
	lang: DocSnippetLang,
	schemas: JsonSchemaMap,
	p: BoundParam,
	operationId?: string,
): string | undefined {
	if (!operationId || !p.isEnum || p.source === "body" || lang === "ts") return undefined;

	const d = dereferenceSchema(schemas, p.placeholderSchema ?? undefined);
	const first = d?.enum?.[0];
	if (typeof first !== "string") return undefined;

	const cap = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);
	return lang === "kt"
		? `DiscovrApi.${cap(p.name)}${cap(operationId)}.${first}`
		: `DiscovrAPI.${cap(p.name)}_${operationId}.${first}`;
}

type JsonSchemaMap = Record<string, JsonSchema>;

function effectiveExample(p: BoundParam, schemas: JsonSchemaMap): unknown {
	if (p.paramExample !== undefined) return p.paramExample;
	const d = dereferenceSchema(schemas, p.placeholderSchema ?? undefined);
	if (!d) return undefined;
	if (d.example !== undefined) return d.example;
	if (d.default !== undefined) return d.default;
	return undefined;
}

function emitFromJsonValue(lang: DocSnippetLang, v: unknown): string {
	if (v === null) {
		if (lang === "kt") return "null";
		if (lang === "swift") return "nil";
		return "null";
	}
	if (typeof v === "boolean") return String(v);
	if (typeof v === "number") return Number.isInteger(v) ? String(v) : String(v);
	if (typeof v === "string") return quote(lang, v);
	if (Array.isArray(v)) {
		const inner = v.map((x) => emitFromJsonValue(lang, x)).join(lang === "kt" ? ", " : ", ");
		if (lang === "ts") return `[${inner}]`;
		if (lang === "kt") return `listOf(${inner})`;
		return `[${inner}]`;
	}
	if (typeof v === "object") {
		const o = v as Record<string, unknown>;
		const keys = Object.keys(o).sort();
		if (lang === "ts") {
			return `{ ${keys.map((k) => `${JSON.stringify(k)}: ${emitFromJsonValue(lang, o[k])}`).join(", ")} }`;
		}
		if (lang === "kt") {
			if (keys.length === 0) return "emptyMap()";
			return `mapOf(${keys.map((k) => `${JSON.stringify(k)} to ${emitFromJsonValue(lang, o[k])}`).join(", ")})`;
		}
		return `[${keys.map((k) => `"${escapeSwiftKey(k)}": ${emitFromJsonValue(lang, o[k])}`).join(", ")}]`;
	}
	return quote(lang, "example");
}

function escapeSwiftKey(k: string): string {
	return k.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function quote(lang: DocSnippetLang, s: string): string {
	const j = JSON.stringify(s);
	if (lang === "swift") return j;
	return j;
}

function refFromSchemaField(sch: JsonSchema | undefined): string | undefined {
	return sch?.$ref?.split("/").pop();
}

function placeholderFromSchema(
	lang: DocSnippetLang,
	schemas: JsonSchemaMap,
	schema: JsonSchema | null | undefined,
	refName?: string,
): string {
	const d = dereferenceSchema(schemas, schema);
	if (!d) return quote(lang, "example");

	if (d.example !== undefined) return emitFromJsonValue(lang, d.example);
	if (d.default !== undefined) return emitFromJsonValue(lang, d.default);
	if (d.enum?.length) return emitFirstEnum(lang, d.enum[0]);

	if (d.properties && (!d.type || d.type === "object")) {
		return objectPlaceholder(lang, schemas, d, refName);
	}

	switch (d.type) {
		case "string": {
			if (d.format === "date-time") return dateTimePlaceholder(lang);
			if (d.format === "date") return dateOnlyPlaceholder(lang);
			if (d.format === "uuid") return quote(lang, "00000000-0000-0000-0000-000000000000");
			if (d.format === "uri" || d.format === "url") return quote(lang, "https://example.com");
			if (d.minLength !== undefined && d.minLength > 0) return quote(lang, "a");
			return quote(lang, "example");
		}
		case "integer":
		case "number": {
			const n = pickNumericExample(d);
			if (lang === "swift" && d.type === "integer") return String(Math.trunc(n));
			return String(n);
		}
		case "boolean":
			return lang === "swift" ? "true" : "true";
		case "array": {
			const item = d.items ?? { type: "string" };
			const one = placeholderFromSchema(lang, schemas, item, undefined);
			if (lang === "ts") return `[${one}]`;
			if (lang === "kt") return `listOf(${one})`;
			return `[${one}]`;
		}
		case "object":
			return objectPlaceholder(lang, schemas, d, refName);
		default:
			return quote(lang, "example");
	}
}

function pickNumericExample(d: JsonSchema): number {
	if (d.minimum !== undefined) return d.minimum;
	if (d.maximum !== undefined && d.maximum <= 0) return d.maximum;
	return 0;
}

function emitFirstEnum(lang: DocSnippetLang, v: string | number | boolean): string {
	if (typeof v === "boolean") return String(v);
	if (typeof v === "number") return String(v);
	if (lang === "swift") {
		// Prefer string literal; generated Swift enums vary by model.
		return quote(lang, v);
	}
	return quote(lang, v);
}

function dateTimePlaceholder(lang: DocSnippetLang): string {
	if (lang === "ts") return "new Date()";
	if (lang === "kt") return "kotlin.time.Instant.fromEpochMilliseconds(0)";
	return "Date()";
}

function dateOnlyPlaceholder(lang: DocSnippetLang): string {
	if (lang === "ts") return '"1970-01-01"';
	if (lang === "kt") return '"1970-01-01"';
	return '"1970-01-01"';
}

function objectPlaceholder(
	lang: DocSnippetLang,
	schemas: JsonSchemaMap,
	schema: JsonSchema,
	refName?: string,
): string {
	const d = dereferenceSchema(schemas, schema);
	if (!d?.properties) {
		return emptyComposite(lang, refName);
	}

	const required = new Set(d.required ?? []);
	const propKeys = Object.keys(d.properties);
	const chosen: Array<[string, JsonSchema]> = [];

	for (const k of propKeys) {
		if (required.has(k)) {
			chosen.push([k, d.properties[k]]);
		}
	}

	if (chosen.length === 0) {
		const sorted = [...propKeys].sort();
		for (const k of sorted) {
			const child = dereferenceSchema(schemas, d.properties[k]);
			if (child?.enum?.length) {
				chosen.push([k, d.properties[k]]);
				break;
			}
		}
	}

	if (chosen.length === 0) {
		return emptyComposite(lang, refName);
	}

	if (lang === "ts") {
		return `{ ${chosen
			.map(
				([k, sch]) =>
					`${JSON.stringify(k)}: ${placeholderFromSchema(lang, schemas, sch, refFromSchemaField(sch))}`,
			)
			.join(", ")} }`;
	}

	// Inline composites (no `components.schemas` name): keep Kotlin/Swift illustrative structure-only.
	if (!refName) {
		if (lang === "kt") {
			return `mapOf(${chosen
				.map(
					([k, sch]) =>
						`"${escapeSwiftKey(k)}" to ${placeholderFromSchema(lang, schemas, sch, refFromSchemaField(sch))}`,
				)
				.join(", ")})`;
		}
		return `[${chosen
			.map(
				([k, sch]) =>
					`"${escapeSwiftKey(k)}": ${placeholderFromSchema(lang, schemas, sch, refFromSchemaField(sch))}`,
			)
			.join(", ")}]`;
	}

	if (lang === "kt") {
		const args = chosen
			.map(
				([k, sch]) =>
					`${k} = ${placeholderFromSchema(lang, schemas, sch, refFromSchemaField(sch))}`,
			)
			.join(", ");
		return `${refName}(${args})`;
	}
	const args = chosen
		.map(
			([k, sch]) => `${k}: ${placeholderFromSchema(lang, schemas, sch, refFromSchemaField(sch))}`,
		)
		.join(", ");
	return `${refName}(${args})`;
}

function emptyComposite(lang: DocSnippetLang, refName?: string): string {
	if (lang === "ts") return "{}";
	if (lang === "kt") return refName ? `${refName}()` : "emptyMap()";
	if (lang === "swift") return refName ? `${refName}()` : "[:]";
	return "{}";
}
