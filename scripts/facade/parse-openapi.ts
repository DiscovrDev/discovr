import * as fs from "node:fs";

import yaml from "js-yaml";

import { SPEC_PATH } from "./config";
import { dereferenceSchema } from "./schema-utils";
import type {
	AuthTier,
	BoundParam,
	CachePolicy,
	JsonSchema,
	OasOperation,
	OpenAPISpec,
	ParsedOperation,
	TypeDescriptor,
} from "./types";

export function loadSpecFromDisk(): OpenAPISpec {
	return yaml.load(fs.readFileSync(SPEC_PATH, "utf8")) as OpenAPISpec;
}

function getSchemas(spec: OpenAPISpec): Record<string, JsonSchema> {
	return spec.components?.schemas ?? {};
}

export function buildOperations(spec: OpenAPISpec): ParsedOperation[] {
	const schemas = getSchemas(spec);
	const ops: ParsedOperation[] = [];

	for (const [pathStr, methods] of Object.entries(spec.paths ?? {})) {
		for (const [httpMethod, opUnknown] of Object.entries(methods)) {
			if (!["get", "post", "put", "patch", "delete"].includes(httpMethod)) continue;
			const op = opUnknown as OasOperation;
			if (!op.operationId) continue;

			const tierRaw = getTier(op, op.security as unknown[] | undefined);
			if (tierRaw === "skip") continue;
			const tier = tierRaw;

			const params = op.parameters ?? [];
			const pathParams = params.filter((p) => p.in === "path");
			const queryParams = params.filter((p) => p.in === "query");

			let bodySchema: JsonSchema | null | undefined = null;
			let bodySchemaName: string | null = null;
			const bodyContent = op.requestBody?.content?.["application/json"]?.schema;
			if (bodyContent) {
				if (bodyContent.$ref) {
					bodySchemaName = bodyContent.$ref.split("/").pop() ?? null;
					bodySchema = bodySchemaName ? schemas[bodySchemaName] : null;
				} else {
					bodySchema = bodyContent;
				}
			}

			const bodyRequired = bodySchema?.required ?? [];
			const bodyProps = Object.keys(bodySchema?.properties ?? {});
			const bodyOptional = bodyProps.filter((p) => !bodyRequired.includes(p));

			const positional: BoundParam[] = [];
			for (const p of pathParams) {
				const raw = p.schema ?? { type: "string" };
				positional.push({
					name: p.name,
					...resolveType(schemas, raw),
					source: "path",
					paramExample: p.example,
					placeholderSchema: dereferenceSchema(schemas, raw),
				});
			}
			for (const field of bodyRequired) {
				const propSchema = bodySchema?.properties?.[field];
				positional.push({
					name: field,
					...resolveType(schemas, propSchema),
					source: "body",
					paramExample: undefined,
					placeholderSchema: dereferenceSchema(schemas, propSchema ?? null),
				});
			}
			for (const p of queryParams.filter((q) => q.required === true)) {
				if (!positional.find((x) => x.name === p.name)) {
					const raw = p.schema ?? { type: "string" };
					positional.push({
						name: p.name,
						...resolveType(schemas, raw),
						source: "query",
						paramExample: p.example,
						placeholderSchema: dereferenceSchema(schemas, raw),
					});
				}
			}

			const optional: BoundParam[] = [];
			for (const field of bodyOptional) {
				const propSchema = bodySchema?.properties?.[field];
				optional.push({
					name: field,
					...resolveType(schemas, propSchema),
					source: "body",
					paramExample: undefined,
					placeholderSchema: dereferenceSchema(schemas, propSchema ?? null),
				});
			}
			for (const p of queryParams.filter((q) => q.required !== true)) {
				const raw = p.schema ?? { type: "string" };
				optional.push({
					name: p.name,
					...resolveType(schemas, raw),
					source: "query",
					paramExample: p.example,
					placeholderSchema: dereferenceSchema(schemas, raw),
				});
			}

			const { cachePolicy, cacheTtlSeconds } = getCachePolicy(op);
			const cacheInvalidates = ((op as any)["x-cache-invalidates"] as string[] | undefined) ?? [];

			const returnStatusCode = op.responses?.["200"]?.content?.["application/json"]?.schema
				? "200"
				: op.responses?.["201"]?.content?.["application/json"]?.schema
					? "201"
					: null;
			const res200 = returnStatusCode
				? op.responses![returnStatusCode].content!["application/json"]!.schema
				: undefined;
			let returnTypeName = "void";
			if (res200) {
				if (res200.$ref) {
					returnTypeName = res200.$ref.split("/").pop() ?? "void";
				} else if (res200.properties || res200.oneOf || res200.allOf) {
					// openapi-generator always synthesizes a concrete named model for an
					// inline response schema with defined shape (object properties, or a
					// oneOf/allOf composite) — it only falls back to a free-form map for a
					// bare, property-less `type: object`. Matches the generator's own
					// naming convention: `{OperationId}{StatusCode}Response`.
					returnTypeName = `${capitalize(op.operationId)}${returnStatusCode}Response`;
				} else {
					returnTypeName = "object";
				}
			}

			ops.push({
				operationId: op.operationId,
				httpMethod: httpMethod.toUpperCase(),
				path: pathStr,
				tier,
				positional,
				optional,
				bodySchemaName,
				bodyRequired,
				bodyOptional,
				bodyProps,
				pathParams: pathParams.map((p) => p.name),
				queryParams: queryParams.map((p) => ({
					name: p.name,
					required: p.required === true,
					tsCoerce: (p as any)["x-ts-coerce"] as string | undefined,
				})),
				returnTypeName,
				returnType: {
					tsType: returnTypeName === "object" ? "object" : returnTypeName,
					ktType:
						returnTypeName === "object"
							? "Map<String, Any>"
							: returnTypeName === "void"
								? "Unit"
								: returnTypeName,
					swiftType:
						returnTypeName === "object"
							? "[String: Any]"
							: returnTypeName === "void"
								? "Void"
								: returnTypeName,
				},
				cachePolicy,
				cacheTtlSeconds,
				cacheInvalidates,
			});
		}
	}

	return ops;
}

function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

function getTier(op: OasOperation, security: unknown[] | undefined): AuthTier {
	const xTier = (op as any)["x-tier"] as string | undefined;
	if (xTier === "facade-skip") return "skip";
	if (xTier === "public" || xTier === "identity" || xTier === "session") return xTier;
	// Fallback: operations with explicit empty security array are public
	if (Array.isArray(security) && security.length === 0) return "public";
	// All remaining authenticated operations default to session tier
	return "session";
}

function getCachePolicy(op: OasOperation): { cachePolicy: CachePolicy; cacheTtlSeconds?: number } {
	const raw = (op as any)["x-cache-policy"] as string | undefined;
	if (!raw || raw === "none") return { cachePolicy: "none" };
	if (raw === "session") return { cachePolicy: "session" };
	if (raw.startsWith("ttl:")) {
		const seconds = Number(raw.slice("ttl:".length));
		if (Number.isFinite(seconds) && seconds > 0) {
			return { cachePolicy: "ttl", cacheTtlSeconds: seconds };
		}
	}
	throw new Error(`Invalid x-cache-policy value: ${raw}`);
}

function resolveType(
	schemas: Record<string, JsonSchema>,
	schema?: JsonSchema | null,
): TypeDescriptor {
	if (!schema) return { tsType: "unknown", ktType: "Any", swiftType: "Any" };
	if (schema.$ref) {
		const refName = schema.$ref.split("/").pop();
		if (!refName) return { tsType: "unknown", ktType: "Any", swiftType: "Any" };
		const simpleMap: Record<string, TypeDescriptor> = {
			FilterSpec: {
				tsType: "FilterSpec",
				ktType: "FilterSpec",
				swiftType: "FilterSpec",
				isRef: true,
				refName,
			},
			ScrobbleTv: {
				tsType: "ScrobbleTv",
				ktType: "ScrobbleTv",
				swiftType: "ScrobbleTv",
				isRef: true,
				refName,
			},
		};
		if (simpleMap[refName]) return simpleMap[refName];
		return { tsType: refName, ktType: refName, swiftType: refName, isRef: true, refName };
	}
	if (schema.oneOf || schema.anyOf || schema.allOf) {
		// Composed schemas (oneOf/anyOf/allOf) always serialize as JSON objects at
		// runtime — fall back to a generic object type rather than the opaque
		// unknown/Any the default case below would give. We don't attempt to guess
		// the generator's synthesized model name here (unlike the top-level
		// response-type resolution above): the exact name depends on where the
		// schema is nested, and a wrong guess would be worse than an honest generic
		// fallback.
		return {
			tsType: "Record<string, unknown>",
			ktType: "Map<String, Any>",
			swiftType: "[String: Any]",
		};
	}
	switch (schema.type) {
		case "string":
			if (schema.format === "date-time") {
				return {
					tsType: "Date",
					ktType: "kotlin.time.Instant",
					swiftType: "Date",
				};
			}
			if (schema.enum && schema.enum.length > 0) {
				return { tsType: "string", ktType: "String", swiftType: "String", isEnum: true };
			}
			return { tsType: "string", ktType: "String", swiftType: "String" };
		case "number":
			return { tsType: "number", ktType: "Double", swiftType: "Double" };
		case "integer":
			return { tsType: "number", ktType: "Int", swiftType: "Int" };
		case "boolean":
			return { tsType: "boolean", ktType: "Boolean", swiftType: "Bool" };
		case "object":
			return {
				tsType: "Record<string, unknown>",
				ktType: "Map<String, Any>",
				swiftType: "[String: Any]",
			};
		case "array": {
			const item = resolveType(schemas, schema.items);
			return {
				tsType: `${item.tsType}[]`,
				ktType: `List<${item.ktType}>`,
				swiftType: `[${item.swiftType}]`,
			};
		}
		default:
			return { tsType: "unknown", ktType: "Any", swiftType: "Any" };
	}
}
