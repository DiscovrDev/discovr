import type { JsonSchema } from "./types";

/**
 * Follow `$ref` into `components.schemas` and unwrap single-element `allOf`.
 */
export function dereferenceSchema(
	schemas: Record<string, JsonSchema>,
	schema: JsonSchema | null | undefined,
	depth = 0,
): JsonSchema | null {
	if (!schema || depth > 32) return null;
	if (schema.allOf?.length === 1) {
		return dereferenceSchema(schemas, schema.allOf[0], depth + 1);
	}
	const refTail = schema.$ref?.split("/").pop();
	if (refTail && schemas[refTail]) {
		return dereferenceSchema(schemas, schemas[refTail], depth + 1);
	}
	return schema;
}
