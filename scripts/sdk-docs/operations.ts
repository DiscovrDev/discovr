import { dereferenceSchema } from "../facade/schema-utils";
import type { OasOperation, OpenAPISpec } from "../facade/types";
import { cleanDescription, sanitizeMdxProse } from "./helpers";
import type { LangSnippets, MethodDoc } from "./types";

function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getOperationsByTag(spec: OpenAPISpec): Map<string, OasOperation[]> {
	const result = new Map<string, OasOperation[]>();
	for (const methods of Object.values(spec.paths ?? {})) {
		for (const op of Object.values(methods as object)) {
			const o = op as any;
			if (!o.operationId) continue;
			if (o["x-tier"] === "facade-skip") continue;
			for (const tag of (o.tags ?? []) as string[]) {
				if (tag === "Discovr") continue;
				if (!result.has(tag)) result.set(tag, []);
				result.get(tag)!.push(o as OasOperation);
			}
		}
	}
	return result;
}

export function getSubGroupedOps(ops: OasOperation[]): Map<string, OasOperation[]> {
	const result = new Map<string, OasOperation[]>();
	for (const op of ops) {
		const group = (op as any)["x-sdk-group"] as string | undefined;
		const key = group ?? "";
		if (!result.has(key)) result.set(key, []);
		result.get(key)!.push(op);
	}
	return result;
}

export function buildOperationDoc(
	spec: OpenAPISpec,
	op: OasOperation,
	snippets: LangSnippets,
): MethodDoc | null {
	if (!op.operationId) return null;
	const schemas = (spec.components?.schemas ?? {}) as Record<string, any>;

	const params: Array<{ name: string; type: string; required: boolean; description: string }> = [];

	// Path and query parameters
	for (const param of op.parameters ?? []) {
		const paramSchema = param.schema as any;
		const resolvedParam = dereferenceSchema(schemas, paramSchema) ?? paramSchema;
		let type = resolvedParam?.type ?? paramSchema?.$ref?.split("/").pop() ?? "any";
		if (resolvedParam?.enum) {
			type = (resolvedParam.enum as any[]).map((e) => `"${e}"`).join(" | ");
		}
		if (resolvedParam?.format) type += ` (${resolvedParam.format})`;
		params.push({
			name: param.name,
			type,
			required: param.required ?? false,
			description: cleanDescription((param as any).description ?? ""),
		});
	}

	// Request body properties
	const requestBodySchema = op.requestBody?.content?.["application/json"]?.schema as any;
	if (requestBodySchema) {
		let schemaToExtract: any = requestBodySchema;
		if (requestBodySchema.$ref) {
			const schemaName = (requestBodySchema.$ref as string).split("/").pop()!;
			schemaToExtract = schemas[schemaName];
		}
		if (schemaToExtract?.properties) {
			const requiredFields: string[] = schemaToExtract.required ?? [];
			for (const [propName, propSchema] of Object.entries(schemaToExtract.properties)) {
				const prop = propSchema as any;
				let typeStr: string;
				if (prop.$ref) {
					typeStr = (prop.$ref as string).split("/").pop()!;
				} else {
					const resolvedProp = dereferenceSchema(schemas, prop) ?? prop;
					typeStr = resolvedProp?.type ?? "any";
					if (resolvedProp?.format) typeStr += ` (${resolvedProp.format})`;
				}
				params.push({
					name: propName,
					type: typeStr,
					required: requiredFields.includes(propName),
					description: cleanDescription((prop as any).description ?? ""),
				});
			}
		}
	}

	const returnStatusCode = op.responses?.["200"]
		? "200"
		: op.responses?.["201"]
			? "201"
			: undefined;
	const successResponse = returnStatusCode ? (op.responses![returnStatusCode] as any) : undefined;
	let responseType = "Response";
	const returnDescription = sanitizeMdxProse(
		successResponse?.description ?? "Operation successful",
	);

	const responseSchema = successResponse?.content?.["application/json"]?.schema as any;
	if (responseSchema?.$ref) {
		responseType = (responseSchema.$ref as string).split("/").pop() ?? "Response";
	} else if (responseSchema?.properties || responseSchema?.oneOf || responseSchema?.allOf) {
		// Matches the generator's own naming convention for a synthesized inline
		// response model, and parse-openapi.ts's identical fix for the facade's
		// own return-type resolution: `{OperationId}{StatusCode}Response`.
		responseType = `${capitalize(op.operationId)}${returnStatusCode}Response`;
	}

	return {
		operationId: op.operationId,
		summary: (op as any).summary ?? "",
		description: sanitizeMdxProse((op as any).description ?? (op as any).summary ?? ""),
		params,
		returns: { type: responseType, description: returnDescription },
		snippets,
	};
}
