import type { JsonSchema } from "./types";

/**
 * Extracts the primary non-null JSON Schema type from either an OpenAPI 3.0
 * string (`"string"`) or an OpenAPI 3.1 union (`["string", "null"]`).
 */
export function primarySchemaType(
	type: string | readonly string[] | undefined,
): string | undefined {
	if (typeof type === "string") return type;
	if (Array.isArray(type)) return type.find((t) => t !== "null");
	return undefined;
}

/**
 * Unwraps OpenAPI 3.1 nullable compositions (`anyOf`/`oneOf` with exactly one
 * `{ type: "null" }` branch and one non-null branch) so callers see the
 * underlying `$ref` or schema directly.
 */
export function unwrapNullableBranch(
	schema: JsonSchema | null | undefined,
): JsonSchema | null | undefined {
	if (!schema) return schema;
	const branches = schema.anyOf ?? schema.oneOf;
	if (branches && branches.length === 2) {
		const nonNull = branches.filter((b) => b.type !== "null");
		if (nonNull.length === 1) return nonNull[0];
	}
	return schema;
}

/**
 * Follow `$ref` into `components.schemas`, unwrap single-element `allOf`, and
 * unwrap OpenAPI 3.1 nullable `anyOf`/`oneOf` pairs.
 */
export function dereferenceSchema(
	schemas: Record<string, JsonSchema>,
	schema: JsonSchema | null | undefined,
	depth = 0,
): JsonSchema | null {
	if (!schema || depth > 32) return null;
	const unwrapped = unwrapNullableBranch(schema);
	if (unwrapped && unwrapped !== schema) {
		return dereferenceSchema(schemas, unwrapped, depth + 1);
	}
	if (schema.allOf?.length === 1) {
		return dereferenceSchema(schemas, schema.allOf[0], depth + 1);
	}
	const refTail = schema.$ref?.split("/").pop();
	if (refTail && schemas[refTail]) {
		return dereferenceSchema(schemas, schemas[refTail], depth + 1);
	}
	return schema;
}
