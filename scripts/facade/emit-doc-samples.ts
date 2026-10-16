import * as fs from "node:fs";
import * as path from "node:path";

import { FACADE_SAMPLES_JSON_PATH, ROOT } from "./config";
import { snippetPlaceholder } from "./snippet-placeholders";
import type { JsonSchema, LangSnippetsJson, OpenAPISpec, ParsedOperation } from "./types";

type JsonSchemaMap = Record<string, JsonSchema>;

function getSchemas(spec: OpenAPISpec): JsonSchemaMap {
	return spec.components?.schemas ?? {};
}

/** Model/schema names surfaced in snippets (imports for TS/Kotlin). Swift uses `import Discovr` only. */
function collectSnippetModelTypes(op: ParsedOperation): string[] {
	const models = new Set<string>();
	for (const p of [...op.positional, ...op.optional]) {
		if (p.refName) models.add(p.refName);
	}
	if (op.bodySchemaName && (op.bodyRequired.length > 0 || op.bodyOptional.length > 0)) {
		models.add(op.bodySchemaName);
	}
	const ret = op.returnTypeName;
	if (ret && ret !== "void" && ret !== "object") models.add(ret);
	return [...models].sort();
}

function docTsInvocation(schemas: JsonSchemaMap, op: ParsedOperation): string {
	const posPart = op.positional
		.map((p) => snippetPlaceholder("ts", schemas, p, op.operationId))
		.join(", ");

	const opts = op.optional.map(
		(p) => `${p.name}: ${snippetPlaceholder("ts", schemas, p, op.operationId)}`,
	);

	if (!opts.length) return posPart;
	const obj = `{ ${opts.join(", ")} }`;
	return posPart ? `${posPart}, ${obj}` : obj;
}

function docKtInvocationInner(schemas: JsonSchemaMap, op: ParsedOperation): string {
	const parts: string[] = [];

	for (const p of op.positional)
		parts.push(`${p.name} = ${snippetPlaceholder("kt", schemas, p, op.operationId)}`);
	for (const p of op.optional)
		parts.push(`${p.name} = ${snippetPlaceholder("kt", schemas, p, op.operationId)}`);

	return `${op.operationId}(${parts.join(", ")})`;
}

function docSwiftInvocationInner(schemas: JsonSchemaMap, op: ParsedOperation): string {
	const parts: string[] = [];

	for (const p of op.positional)
		parts.push(`${p.name}: ${snippetPlaceholder("swift", schemas, p, op.operationId)}`);
	for (const p of op.optional)
		parts.push(`${p.name}: ${snippetPlaceholder("swift", schemas, p, op.operationId)}`);

	return `${op.operationId}(${parts.join(", ")})`;
}

/**
 * Preamble comment for a snippet, matched to what the call actually needs.
 *
 * A blanket "after sign-in and profile selection" was wrong for the operations
 * that *are* sign-in — `requestDeviceCode` is the first call an app ever makes.
 */
function snippetPreamble(op: ParsedOperation): string | null {
	if (op.tier === "public") return null;
	if (op.tier === "identity") return "// After sign-in …";
	return "// After sign-in and profile selection …";
}

function wrapSnippetTs(spec: OpenAPISpec, schemas: JsonSchemaMap, op: ParsedOperation): string {
	const models = collectSnippetModelTypes(op);
	const tail = docTsInvocation(schemas, op);
	const invocation = tail ? `discovr.${op.operationId}(${tail})` : `discovr.${op.operationId}()`;

	const retName =
		op.returnTypeName !== "void" && op.returnTypeName !== "object" ? op.returnTypeName : undefined;

	const imports = [`import { DiscovrClient } from "discovr";`];
	if (models.length > 0) imports.push(`import type { ${models.join(", ")} } from "discovr";`);

	const stmts = [...imports, "", `const discovr = new DiscovrClient("your-client-id");`, ""];
	const preamble = snippetPreamble(op);
	if (preamble) stmts.push(preamble);
	if (!retName) {
		stmts.push(`await ${invocation};`);
	} else {
		stmts.push(`const response: ${retName} = await ${invocation};`);
		stmts.push("console.log(response);");
	}

	return stmts.join("\n");
}

function wrapSnippetKt(spec: OpenAPISpec, schemas: JsonSchemaMap, op: ParsedOperation): string {
	const inner = docKtInvocationInner(schemas, op);
	const models = collectSnippetModelTypes(op);
	const lines: string[] = [`import api.discovr.DiscovrClient`];
	for (const m of models) lines.push(`import api.discovr.models.${m}`);
	lines.push(
		"",
		"// Construct DiscovrClient with your AuthStorage implementation (see SDK README).",
		"suspend fun example(client: DiscovrClient) {",
	);
	const retKt =
		op.returnTypeName !== "void" && op.returnTypeName !== "object" ? op.returnTypeName : undefined;
	if (!retKt) {
		lines.push(`    client.${inner}`);
	} else {
		lines.push(`    val response: ${retKt} = client.${inner}`);
		lines.push(`    println(response)`);
	}
	lines.push("}");
	return lines.join("\n");
}

function wrapSnippetSwift(spec: OpenAPISpec, schemas: JsonSchemaMap, op: ParsedOperation): string {
	const inner = docSwiftInvocationInner(schemas, op);
	const retSwift =
		op.returnTypeName !== "void" && op.returnTypeName !== "object"
			? op.returnType.swiftType
			: undefined;
	const stmts = [`import Discovr`, "", `let client = DiscovrClient(clientId: "your-client-id")`];
	const models = collectSnippetModelTypes(op);
	if (models.length) {
		stmts.push("// Response / argument types:", `// ${models.join(", ")}`);
	}
	if (!retSwift) {
		stmts.push(`try await client.${inner}`);
	} else {
		stmts.push(`let response: ${retSwift} = try await client.${inner}`);
		stmts.push(`print(response)`);
	}
	return stmts.join("\n");
}

export function emitFacadeSamplesJson(spec: OpenAPISpec, ops: ParsedOperation[]): void {
	const schemas = getSchemas(spec);
	const bundle: Record<string, LangSnippetsJson> = {};

	for (const op of ops) {
		bundle[op.operationId] = {
			typescript: wrapSnippetTs(spec, schemas, op),
			kotlin: wrapSnippetKt(spec, schemas, op),
			swift: wrapSnippetSwift(spec, schemas, op),
		};
	}

	fs.writeFileSync(FACADE_SAMPLES_JSON_PATH, JSON.stringify(bundle, null, "\t") + "\n", "utf8");
	console.log(
		`✅  Written: ${path.relative(ROOT, FACADE_SAMPLES_JSON_PATH)} (${Object.keys(bundle).length} operations)`,
	);
}
