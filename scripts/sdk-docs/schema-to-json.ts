import { dereferenceSchema } from "../facade/schema-utils";
import type { OpenAPISpec } from "../facade/types";
import { SCHEMA_JSON_EXAMPLE_MAX_DEPTH, SCHEMA_JSON_EXAMPLE_MAX_PROPS } from "./config";

function peekRefName(schema: any): string | undefined {
	const tail = schema?.$ref as string | undefined;
	return tail?.split("/").pop();
}

/** JSON-like literal for string or numeric enums (shows all values in a comment). */
function formatJsonEnumLiteral(
	values: readonly any[],
	kind: "string" | "number",
	label?: string,
): string {
	if (!values?.length) {
		return kind === "string" ? `"string"` : "0";
	}
	const first = values[0];
	const literal = kind === "string" ? JSON.stringify(String(first)) : String(Number(first));
	if (values.length === 1) return literal;
	const list =
		kind === "string"
			? values.map((v) => JSON.stringify(String(v))).join(", ")
			: values.map((v) => String(Number(v))).join(", ");
	const tag = label ? `${label}` : "enum";
	return `${literal} /* ${tag}: ${list} */`;
}

function schemaToJsonExample(
	schema: any,
	schemas: Record<string, any>,
	maxDepth = SCHEMA_JSON_EXAMPLE_MAX_DEPTH,
	currentDepth = 0,
	visited: ReadonlySet<string> = new Set(),
): string {
	if (!schema || currentDepth >= maxDepth) {
		return "{ /* max depth */ }";
	}

	const topRef = peekRefName(schema);
	if (topRef && visited.has(topRef)) {
		return `{ /* ${topRef} (recursive $ref) */ }`;
	}
	const visitedHere = topRef ? new Set(visited).add(topRef) : new Set(visited);

	const resolved = dereferenceSchema(schemas, schema) ?? schema;

	if (resolved.oneOf || resolved.anyOf) {
		const variants: any[] = resolved.oneOf ?? resolved.anyOf;
		const discriminatorKey = resolved.discriminator?.propertyName as string | undefined;
		const discriminatorMapping: Record<string, string> = resolved.discriminator?.mapping ?? {};
		const branchBase = new Set(visitedHere);

		return variants
			.map((v: any) => {
				const refName = peekRefName(v);
				if (refName && branchBase.has(refName)) {
					const labelOnly = v.title ?? refName ?? "Variant";
					return `// ${labelOnly}\n{ /* ${refName} (recursive $ref) */ }`;
				}
				const vVisited = refName ? new Set(branchBase).add(refName) : new Set(branchBase);
				const vResolved = dereferenceSchema(schemas, v) ?? v;
				const label = v.title ?? refName ?? "Variant";
				const discriminatorValue = refName
					? Object.entries(discriminatorMapping).find(
							([, ref]) => (ref as string).split("/").pop() === refName,
						)?.[0]
					: undefined;
				const header =
					discriminatorKey && discriminatorValue
						? `// ${label} (when ${discriminatorKey}: "${discriminatorValue}")`
						: `// ${label}`;
				return `${header}\n${schemaToJsonExample(vResolved, schemas, maxDepth, currentDepth + 1, vVisited)}`;
			})
			.join("\n// — OR —\n");
	}

	if (resolved.type === "object" || resolved.properties) {
		const properties = resolved.properties ?? {};
		const keys = Object.keys(properties);
		if (keys.length === 0) {
			// Open maps (`additionalProperties`, e.g. a size-keyed image URL map) have no
			// fixed `properties` to expand — prefer a worked `example` when the schema
			// provides one, otherwise synthesize a representative entry from
			// `additionalProperties` so the shape isn't silently dropped to `{ }`.
			if (
				resolved.example &&
				typeof resolved.example === "object" &&
				!Array.isArray(resolved.example)
			) {
				const entries = Object.entries(resolved.example as Record<string, unknown>);
				const lines = entries.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`);
				return `{\n${lines.join(",\n")}\n}`;
			}
			const additionalProperties = resolved.additionalProperties;
			if (additionalProperties && typeof additionalProperties === "object") {
				const apResolved = dereferenceSchema(schemas, additionalProperties) ?? additionalProperties;
				const valueType =
					apResolved.type === "string"
						? apResolved.format
							? `"string" /* ${apResolved.format} */`
							: `"string"`
						: apResolved.type
							? `"${apResolved.type}"`
							: "any";
				return `{\n  "<key>": ${valueType} /* dynamic keys, shape not fixed in OpenAPI */\n}`;
			}
			const hint = resolved.title
				? ` /* ${String(resolved.title)} — object shape not expanded in OpenAPI */`
				: "";
			return `{${hint} }`;
		}
		const capped = keys.slice(0, SCHEMA_JSON_EXAMPLE_MAX_PROPS);
		const lines: string[] = [];

		for (const key of capped) {
			const propSchema = properties[key] as any;
			const propRefName = peekRefName(propSchema);
			let childVisited = visitedHere;
			if (propRefName) {
				if (visitedHere.has(propRefName)) {
					lines.push(`  "${key}": { /* ${propRefName} (recursive $ref) */ }`);
					continue;
				}
				childVisited = new Set(visitedHere).add(propRefName);
			}

			const propResolved = dereferenceSchema(schemas, propSchema) ?? propSchema;
			let propType = "any";

			if (propResolved.type === "string") {
				const enumLabel = propRefName;
				propType = propResolved.enum?.length
					? formatJsonEnumLiteral(propResolved.enum, "string", enumLabel)
					: `"string"`;
				if (propResolved.format) propType += ` /* ${propResolved.format} */`;
			} else if (propResolved.type === "number" || propResolved.type === "integer") {
				if (propResolved.enum?.length) {
					propType = formatJsonEnumLiteral(propResolved.enum, "number", propRefName);
				} else {
					// Prefer the schema's own worked example over a bare zero, so a field like
					// `expiresIn` documents a realistic value rather than `0`.
					propType =
						typeof propResolved.example === "number"
							? String(propResolved.example)
							: propResolved.type === "integer"
								? "0"
								: "0.0";
				}
			} else if (propResolved.type === "boolean") {
				propType = "false";
			} else if (propResolved.type === "array") {
				const rawItem = propResolved.items as any;
				const itemRef = peekRefName(rawItem);
				let itemVisited = childVisited;
				if (itemRef) {
					if (childVisited.has(itemRef)) {
						lines.push(`  "${key}": [ /* ${itemRef}[] (recursive $ref) */ ]`);
						continue;
					}
					itemVisited = new Set(childVisited).add(itemRef);
				}
				const itemResolved = dereferenceSchema(schemas, rawItem) ?? rawItem;
				if (
					itemResolved?.type === "object" ||
					itemResolved?.oneOf ||
					itemResolved?.anyOf ||
					itemResolved?.properties
				) {
					const inner = schemaToJsonExample(
						itemResolved,
						schemas,
						maxDepth,
						currentDepth + 1,
						itemVisited,
					);
					propType = `[\n${inner}\n]`;
				} else if (itemResolved?.type === "string" && itemResolved.enum?.length) {
					propType = `[${formatJsonEnumLiteral(itemResolved.enum, "string", itemRef)}]`;
				} else if (
					(itemResolved?.type === "number" || itemResolved?.type === "integer") &&
					itemResolved.enum?.length
				) {
					propType = `[${formatJsonEnumLiteral(itemResolved.enum, "number", itemRef)}]`;
				} else {
					propType = `["${itemResolved?.type || "any"}"]`;
				}
			} else if (propResolved.type === "object" || propResolved.properties) {
				propType = schemaToJsonExample(
					propResolved,
					schemas,
					maxDepth,
					currentDepth + 1,
					childVisited,
				);
			} else if (propResolved.oneOf || propResolved.anyOf) {
				propType = schemaToJsonExample(
					propResolved,
					schemas,
					maxDepth,
					currentDepth + 1,
					childVisited,
				);
			} else if (propSchema.$ref) {
				const refResolved = dereferenceSchema(schemas, propSchema);
				if (refResolved) {
					propType = schemaToJsonExample(
						refResolved,
						schemas,
						maxDepth,
						currentDepth + 1,
						childVisited,
					);
				} else {
					propType = `"${(propSchema.$ref as string).split("/").pop()}"`;
				}
			}

			lines.push(`  "${key}": ${propType}`);
		}

		const omitted = keys.length - capped.length;
		const dots =
			omitted > 0
				? `,\n  /* ... ${omitted} more propert${omitted === 1 ? "y" : "ies"} omitted (cap ${SCHEMA_JSON_EXAMPLE_MAX_PROPS}) ... */`
				: "";
		return `{\n${lines.join(",\n")}${dots}\n}`;
	}

	if (resolved.type === "array") {
		const rawItem = resolved.items as any;
		const itemRef = peekRefName(rawItem);
		let itemVisited = visitedHere;
		if (itemRef) {
			if (visitedHere.has(itemRef)) {
				return `[ /* ${itemRef} (recursive $ref) */ ]`;
			}
			itemVisited = new Set(visitedHere).add(itemRef);
		}
		const itemResolved = dereferenceSchema(schemas, rawItem) ?? rawItem;
		if (itemResolved?.type === "object" || itemResolved?.oneOf || itemResolved?.anyOf) {
			return `[\n${schemaToJsonExample(itemResolved, schemas, maxDepth, currentDepth + 1, itemVisited)}\n]`;
		}
		if (itemResolved?.type === "string" && itemResolved.enum?.length) {
			return `[${formatJsonEnumLiteral(itemResolved.enum, "string", itemRef)}]`;
		}
		if (
			(itemResolved?.type === "number" || itemResolved?.type === "integer") &&
			itemResolved.enum?.length
		) {
			return `[${formatJsonEnumLiteral(itemResolved.enum, "number", itemRef)}]`;
		}
		return `["${itemResolved?.type || "any"}"]`;
	}

	if (resolved.type === "string" && resolved.enum?.length) {
		return formatJsonEnumLiteral(resolved.enum, "string", peekRefName(schema));
	}
	if ((resolved.type === "number" || resolved.type === "integer") && resolved.enum?.length) {
		return formatJsonEnumLiteral(resolved.enum, "number", peekRefName(schema));
	}

	return `"${resolved.type || "any"}"`;
}

export function generateInlineTypeFromSchema(typeName: string, spec: OpenAPISpec): string | null {
	const schemas = (spec.components?.schemas ?? {}) as Record<string, any>;
	const schema = schemas[typeName];
	if (!schema) return null;
	try {
		return schemaToJsonExample(schema, schemas, SCHEMA_JSON_EXAMPLE_MAX_DEPTH, 0, new Set());
	} catch {
		return null;
	}
}
