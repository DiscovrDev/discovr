/**
 * OpenAPI-derived shapes shared by façade parsing and codegen.
 */

export interface JsonSchema {
	readonly type?: string;
	readonly format?: string;
	readonly $ref?: string;
	readonly items?: JsonSchema;
	readonly properties?: Record<string, JsonSchema>;
	readonly required?: string[];
	readonly enum?: ReadonlyArray<string | number | boolean>;
	readonly example?: unknown;
	readonly default?: unknown;
	readonly nullable?: boolean;
	readonly minimum?: number;
	readonly maximum?: number;
	readonly minLength?: number;
	readonly maxLength?: number;
	readonly allOf?: readonly JsonSchema[];
	readonly oneOf?: readonly JsonSchema[];
	readonly anyOf?: readonly JsonSchema[];
}

interface OasParameter {
	readonly name: string;
	readonly in: string;
	readonly required?: boolean;
	readonly schema?: JsonSchema;
	/** OAS 3 `Parameter.example` — preferred for doc snippets when set. */
	readonly example?: unknown;
}

interface OasResponseContent {
	readonly content?: Record<string, { schema?: JsonSchema }>;
}

export interface OasOperation {
	readonly operationId?: string;
	readonly security?: unknown[];
	readonly parameters?: OasParameter[];
	readonly requestBody?: { content?: Record<string, { schema?: JsonSchema }> };
	readonly responses?: Record<string, OasResponseContent>;
}

export interface OpenAPISpec {
	readonly paths?: Record<string, Record<string, OasOperation>>;
	readonly components?: { schemas?: Record<string, JsonSchema> };
	readonly servers?: ReadonlyArray<{ readonly url: string }>;
}

export type AuthTier = "identity" | "session" | "public" | "skip";

export interface TypeDescriptor {
	tsType: string;
	ktType: string;
	swiftType: string;
	isRef?: boolean;
	refName?: string;
	/**
	 * Set when the source schema is an inline `enum:`-constrained string. The
	 * generic `tsType`/`ktType`/`swiftType` above stay `String`-ish — Swift and
	 * Kotlin emitters must instead build the generator's per-operation nested
	 * enum type name (e.g. `Contentfilter_searchGifs`) since only they reject
	 * a plain string at compile time.
	 */
	isEnum?: boolean;
}

export interface BoundParam extends TypeDescriptor {
	name: string;
	source: "path" | "body" | "query";
	/** From OAS `Parameter.example` when present. */
	readonly paramExample?: unknown;
	/**
	 * Schema node for this parameter (path/query `schema`, or body property schema).
	 * Used to derive placeholder literals from type, format, enum, example, default.
	 */
	readonly placeholderSchema?: JsonSchema | null;
}

/** `none` = never cache (default). `session` = cache until invalidated/session rotates. `ttl` = cache for `cacheTtlSeconds`. */
export type CachePolicy = "none" | "session" | "ttl";

export interface ParsedOperation {
	operationId: string;
	httpMethod: string;
	path: string;
	tier: Exclude<AuthTier, "skip">;
	positional: BoundParam[];
	optional: BoundParam[];
	bodySchemaName: string | null;
	bodyRequired: string[];
	bodyOptional: string[];
	bodyProps: string[];
	pathParams: string[];
	queryParams: { name: string; required: boolean; tsCoerce?: string }[];
	returnTypeName: string;
	returnType: TypeDescriptor;
	cachePolicy: CachePolicy;
	cacheTtlSeconds?: number;
	/** operationIds to purge from the SDK response cache after this operation succeeds. */
	cacheInvalidates: string[];
}

export interface CopyPair {
	readonly src: string;
	readonly dst: string;
}

export interface LangSnippetsJson {
	readonly typescript: string;
	readonly kotlin: string;
	readonly swift: string;
}
