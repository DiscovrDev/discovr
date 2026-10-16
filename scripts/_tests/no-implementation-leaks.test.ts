/**
 * Everything under `public/` is published: spec, docs, SDK sources, generated
 * output, comments and examples included. This fails when something that
 * describes how Discovr is built, or that only makes sense inside the private
 * monorepo, turns up in any of it.
 *
 * It exists because the audit that cleaned these up was done by hand, and
 * nothing else stops the next example URL or doc pointer from putting one back.
 *
 * The `tmdb_*` fields on media items are deliberately not checked: they are part
 * of the media shape. What must not leak is how recommendations are built, which
 * the patterns below cover indirectly by keeping infrastructure and private
 * tooling out of view.
 *
 * If a hit is a false positive, fix the wording rather than loosening a pattern.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const PUBLIC_ROOT = join(__dirname, "..", "..");

const SKIP_DIRS = new Set([
	"node_modules",
	"build",
	"dist",
	".build",
	".gradle",
	".swiftpm",
	"Pods",
	"template_work",
	"templates",
	".git",
]);

// Gitignored build artefacts, plus this file (it has to spell the patterns out).
const SKIP_FILES = new Set(["facade-doc-samples.json", "no-implementation-leaks.test.ts"]);

const TEXT_FILE =
	/\.(ts|tsx|js|mjs|cjs|json|md|mdx|yaml|yml|kt|kts|swift|css|html|svg|mustache|sh|txt|properties|podspec|gradle)$/;

const LEAKS: ReadonlyArray<{ name: string; pattern: RegExp }> = [
	{ name: "names the backend infrastructure", pattern: /firebase|firestore/i },
	{
		name: "names the cloud platform",
		pattern: /cloud ?functions?|cloudfunctions\.net|\.run\.app|\bgcp\b|\bgcloud\b/i,
	},
	{
		name: "a real storage URL or the internal project id",
		pattern: /storage\.googleapis\.com|googleapis\.com\/v0\/b\/|discoveryapi/i,
	},
	{
		name: "points at private tooling or docs",
		pattern: /internal_docs|monorepo|\.claude\/|\.ai\/|public\/design|AGENTS\.md/i,
	},
	{
		name: "points at private backend code",
		pattern: /\bbackend\/(api|page_builder|shared|private_api|scripts)\b/,
	},
	{ name: "names a competitor", pattern: /netflix/i },
	{ name: "a personal identifier", pattern: /jahson|binda|jahb|@gmail\.com/i },
	{ name: "describes how tokens are signed", pattern: /AUTH_SECRET|HS256/ },
	{
		// "eyJhbGci" is base64 for `{"alg"`, so an example token starting with it
		// advertises the signing algorithm without ever spelling it out.
		name: "names the token format, or shows a real JWT header",
		pattern: /\bjwts?\b|stateless|eyJhbGci/i,
	},
	{
		name: "talks about our backend rather than the API",
		pattern: /\bour backend\b|backend's own/i,
	},
	{
		name: "internal roadmap or caching-design chatter",
		pattern: /deferred for now|not cached in v\d|invalidation graph/i,
	},
];

function* textFiles(dir: string): Generator<string> {
	// `withFileTypes` doesn't follow symlinks, so a worktree's `node_modules` links
	// (dangling or not) are skipped rather than stat'd.
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			if (!SKIP_DIRS.has(entry.name)) yield* textFiles(full);
		} else if (entry.isFile() && TEXT_FILE.test(entry.name) && !SKIP_FILES.has(entry.name)) {
			yield full;
		}
	}
}

describe("the published surface", () => {
	const files = [...textFiles(PUBLIC_ROOT)];

	it("scans a real tree, so an empty result means something", () => {
		expect(files.length).toBeGreaterThan(500);
	});

	it("does not describe how Discovr is built or point into the private monorepo", () => {
		const hits: string[] = [];
		for (const file of files) {
			const lines = readFileSync(file, "utf8").split("\n");
			lines.forEach((line, index) => {
				for (const { name, pattern } of LEAKS) {
					if (pattern.test(line)) {
						hits.push(`${relative(PUBLIC_ROOT, file)}:${index + 1}  ${name}`);
					}
				}
			});
		}
		expect(hits).toEqual([]);
	});
});
