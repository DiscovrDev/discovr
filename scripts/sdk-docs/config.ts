import * as path from "node:path";

/** This folder: `public/scripts/sdk-docs` — three levels below repo root. */
const SCRIPT_DIR = __dirname;

export const SDK_DOCS_DIR = path.join(SCRIPT_DIR, "../../docs/sdk-reference");
export const FACADE_SAMPLES_PATH = path.join(SCRIPT_DIR, "../facade-doc-samples.json");
export const DOCS_JSON_PATH = path.join(SCRIPT_DIR, "../../docs/docs.json");

/** Max nesting depth for JSON examples in response accordions. */
export const SCHEMA_JSON_EXAMPLE_MAX_DEPTH = 10;
/** Max object properties per level before truncating with a comment. */
export const SCHEMA_JSON_EXAMPLE_MAX_PROPS = 200;
