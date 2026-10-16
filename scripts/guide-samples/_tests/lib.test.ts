import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import {
	dedent,
	extractDocsRegions,
	findSampleIds,
	injectSamples,
	renderCodeGroup,
	toPascalCase,
	versionTokens,
} from "../lib";

describe("extractDocsRegions", () => {
	it("returns the whole file, dedented, when there are no markers", () => {
		expect(extractDocsRegions("\n\tconst a = 1;\n\tconst b = 2;\n")).toBe(
			"const a = 1;\nconst b = 2;",
		);
	});

	it("returns only what is between the markers, dedented", () => {
		const source = [
			'import { DiscovrClient } from "discovr";',
			"export async function sample(client: DiscovrClient) {",
			"\t// docs:start",
			"\tconst page = await client.createPage({",
			'\t\tname: "Home",',
			"\t});",
			"\t// docs:end",
			"}",
		].join("\n");
		expect(extractDocsRegions(source)).toBe(
			'const page = await client.createPage({\n\tname: "Home",\n});',
		);
	});

	it("joins several regions with a blank line", () => {
		const source = [
			"// docs:start",
			"import a",
			"// docs:end",
			"fun x() {",
			"    // docs:start",
			"    body()",
			"    // docs:end",
			"}",
		].join("\n");
		expect(extractDocsRegions(source)).toBe("import a\n\nbody()");
	});

	it("accepts # comments for shell and Gradle snippets", () => {
		expect(extractDocsRegions("# docs:start\nnpm install discovr\n# docs:end\nignored")).toBe(
			"npm install discovr",
		);
	});

	it("rejects an unbalanced region", () => {
		expect(() => extractDocsRegions("// docs:start\nx", "f")).toThrow(/no docs:end/);
		expect(() => extractDocsRegions("// docs:end", "f")).toThrow(/without docs:start/);
	});
});

describe("dedent", () => {
	it("keeps relative indentation and blank lines", () => {
		expect(dedent(["    a", "", "      b"])).toBe("a\n\n  b");
	});
});

describe("toPascalCase", () => {
	it("turns an id into a Kotlin/Swift file name", () => {
		expect(toPascalCase("quickstart-demo-mode")).toBe("QuickstartDemoMode");
	});
});

describe("injecting into MDX", () => {
	// `root` sits one level down so version tokens can find `../docs/openapi.yaml`
	// the way they do in the real tree, without touching the shared temp dir.
	let base: string;
	let root: string;

	function write(rel: string, contents: string): void {
		const file = path.join(root, rel);
		fs.mkdirSync(path.dirname(file), { recursive: true });
		fs.writeFileSync(file, contents);
	}

	beforeEach(() => {
		base = fs.mkdtempSync(path.join(os.tmpdir(), "guide-samples-"));
		root = path.join(base, "samples");
		write("typescript/src/demo.ts", "// docs:start\nconst a = 1;\n// docs:end\n");
		write("kotlin/src/main/kotlin/Demo.kt", "// docs:start\nval a = 1\n// docs:end\n");
		write("swift-samples/Sources/Samples/Demo.swift", "// docs:start\nlet a = 1\n// docs:end\n");
	});

	afterEach(() => fs.rmSync(base, { recursive: true, force: true }));

	const STALE = "<CodeGroup>\n\n```typescript TypeScript\nold\n```\n\n</CodeGroup>";

	it("renders the three tabs in the order the guides use", () => {
		expect(renderCodeGroup(root, "demo")).toBe(
			[
				"<CodeGroup>",
				"",
				"```typescript TypeScript",
				"const a = 1;",
				"```",
				"",
				"```kotlin Kotlin",
				"val a = 1",
				"```",
				"",
				"```swift Swift",
				"let a = 1",
				"```",
				"",
				"</CodeGroup>",
			].join("\n"),
		);
	});

	it("replaces the marked CodeGroup and leaves the rest alone", () => {
		const mdx = `Intro\n\n{/* sample: demo */}\n${STALE}\n\nOutro\n`;
		const { mdx: out, ids } = injectSamples(mdx, root);
		expect(ids).toEqual(["demo"]);
		expect(out).toContain("const a = 1;");
		expect(out).not.toContain("old");
		expect(out.startsWith("Intro\n\n{/* sample: demo */}\n\n<CodeGroup>")).toBe(true);
		expect(out.endsWith("</CodeGroup>\n\nOutro\n")).toBe(true);
	});

	it("is idempotent", () => {
		const once = injectSamples(`{/* sample: demo */}\n${STALE}\n`, root).mdx;
		expect(injectSamples(once, root).mdx).toBe(once);
	});

	it("keeps the tags indented inside a <Tip> and the fences at column 0", () => {
		const out = injectSamples(`<Tip>\n  {/* sample: demo */}\n  ${STALE}\n</Tip>\n`, root).mdx;
		expect(out).toContain("  <CodeGroup>\n");
		expect(out).toContain("\n```swift Swift\n");
		expect(out).toContain("  </CodeGroup>\n</Tip>");
	});

	it("fails clearly when the marker is not followed by a CodeGroup", () => {
		expect(() => injectSamples("{/* sample: demo */}\nText\n", root, undefined, "f.mdx")).toThrow(
			/f\.mdx:1.*not followed by a <CodeGroup>/,
		);
	});

	it("fails clearly when a language file is missing", () => {
		fs.rmSync(path.join(root, "swift-samples"), { recursive: true });
		expect(() => injectSamples(`{/* sample: demo */}\n${STALE}\n`, root)).toThrow(/missing/);
	});

	it("shows static snippets with the fence language of their extension", () => {
		write("static/install/typescript.sh", "# docs:start\nnpm install discovr\n# docs:end\n");
		write("static/install/kotlin.kt", 'implementation("x")\n');
		write("static/install/swift.swift", '.package(url: "x")\n');
		const out = injectSamples(`{/* sample: static/install */}\n${STALE}\n`, root).mdx;
		expect(out).toContain("```bash TypeScript\nnpm install discovr\n```");
		expect(out).toContain('```kotlin Kotlin\nimplementation("x")\n```');
	});

	it("fills version tokens in static snippets from the bundled spec", () => {
		fs.mkdirSync(path.join(base, "docs"), { recursive: true });
		fs.writeFileSync(
			path.join(base, "docs", "openapi.yaml"),
			"openapi: 3.1.0\ninfo:\n  title: T\n  version: 1.0.0-alpha.2\n",
		);
		write("static/install/typescript.sh", "npm install discovr@{{npmTag}}\n");
		write("static/install/kotlin.kt", 'implementation("x:{{sdkVersion}}")\n');
		write("static/install/swift.swift", '.package(url: "x", {{swiftRequirement}})\n');
		const out = injectSamples(`{/* sample: static/install */}\n${STALE}\n`, root).mdx;
		expect(out).toContain("npm install discovr@alpha\n");
		expect(out).toContain('implementation("x:1.0.0-alpha.2")');
		expect(out).toContain('.package(url: "x", exact: "1.0.0-alpha.2")');
	});

	it("uses latest and from: for a stable version", () => {
		expect(versionTokens("1.4.0")).toMatchObject({
			"{{npmTag}}": "latest",
			"{{swiftRequirement}}": 'from: "1.4.0"',
		});
	});

	it("finds markers", () => {
		expect(findSampleIds("a\n{/* sample: one */}\n<CodeGroup>\n  {/* sample: two/x */}\n")).toEqual(
			["one", "two/x"],
		);
	});
});
