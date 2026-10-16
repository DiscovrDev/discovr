/**
 * Guide code samples live as real files under `public/samples/` (compiled in CI
 * against the generated SDKs) and are injected into the guide MDX, so a sample
 * in the docs cannot drift from code that compiles.
 *
 * In an MDX file, a marker comment immediately before a `<CodeGroup>` names the
 * sample:
 *
 *     {/* sample: quickstart-demo-mode *\/}
 *     <CodeGroup> ... </CodeGroup>
 *
 * The injector replaces everything from that `<CodeGroup>` to its closing tag
 * with fences built from the sample's TypeScript, Kotlin and Swift files.
 *
 * Only the region between `docs:start` and `docs:end` comments is shown (the
 * whole file when there are none), so a compilable file can hide its imports
 * and wrapper function. Several regions are joined with a blank line.
 */

import * as fs from "node:fs";
import * as path from "node:path";

import yaml from "js-yaml";

export type Language = "typescript" | "kotlin" | "swift";

const LANGUAGES: readonly Language[] = ["typescript", "kotlin", "swift"];

/** Tab title for each language's fence, as the guides already spell them. */
const LANGUAGE_TITLE: Record<Language, string> = {
	typescript: "TypeScript",
	kotlin: "Kotlin",
	swift: "Swift",
};

/** Where a compiled sample's file for a language lives, relative to the samples root. */
const COMPILED_LAYOUT: Record<Language, (id: string) => string> = {
	typescript: (id) => `typescript/src/${id}.ts`,
	kotlin: (id) => `kotlin/src/main/kotlin/${toPascalCase(id)}.kt`,
	swift: (id) => `swift-samples/Sources/Samples/${toPascalCase(id)}.swift`,
};

/** Fence language for a file extension, for samples that are shown but not compiled. */
const FENCE_LANG_BY_EXTENSION: Record<string, string> = {
	sh: "bash",
	ts: "typescript",
	kt: "kotlin",
	kts: "kotlin",
	swift: "swift",
};

const STATIC_PREFIX = "static/";

/**
 * Static samples (install snippets) can't hard-code a version without going stale
 * on every release, so they may use these tokens, resolved from the bundled
 * spec's `info.version`, the same number every SDK is built with.
 */
export function versionTokens(version: string): Record<string, string> {
	const prerelease = version.split("-")[1]?.split(".")[0];
	return {
		// npm only moves `latest` on a stable release, so alphas are installed by tag.
		"{{npmTag}}": prerelease ?? "latest",
		"{{sdkVersion}}": version,
		// SwiftPM's `from:` skips prerelease tags, so an alpha must be pinned exactly.
		"{{swiftRequirement}}": prerelease ? `exact: "${version}"` : `from: "${version}"`,
	};
}

function resolveVersionTokens(code: string, root: string, label: string): string {
	const tokens = versionTokens("");
	if (!Object.keys(tokens).some((token) => code.includes(token))) return code;

	const specFile = path.join(root, "..", "docs", "openapi.yaml");
	if (!fs.existsSync(specFile)) {
		throw new Error(`${label}: uses a version token but ${specFile} does not exist`);
	}
	const spec = yaml.load(fs.readFileSync(specFile, "utf8")) as { info?: { version?: string } };
	const version = spec.info?.version;
	if (!version) throw new Error(`${label}: ${specFile} has no info.version`);

	return Object.entries(versionTokens(version)).reduce(
		(out, [token, value]) => out.split(token).join(value),
		code,
	);
}

export function toPascalCase(id: string): string {
	return id
		.split(/[^A-Za-z0-9]+/)
		.filter(Boolean)
		.map((part) => part[0]!.toUpperCase() + part.slice(1))
		.join("");
}

function leadingWhitespace(line: string): string {
	return /^[ \t]*/.exec(line)![0];
}

/** Strips the whitespace every non-blank line shares, and trims blank lines at either end. */
export function dedent(lines: readonly string[]): string {
	const body = [...lines];
	while (body.length && body[0]!.trim() === "") body.shift();
	while (body.length && body[body.length - 1]!.trim() === "") body.pop();

	let common: string | undefined;
	for (const line of body) {
		if (line.trim() === "") continue;
		const ws = leadingWhitespace(line);
		if (common === undefined) {
			common = ws;
			continue;
		}
		let i = 0;
		while (i < common.length && i < ws.length && common[i] === ws[i]) i++;
		common = common.slice(0, i);
	}
	const strip = common?.length ?? 0;
	return body.map((line) => (line.trim() === "" ? "" : line.slice(strip))).join("\n");
}

const START = /^\s*(?:\/\/|#)\s*docs:start\b/;
const END = /^\s*(?:\/\/|#)\s*docs:end\b/;

/** The part of a sample file that appears in the docs. */
export function extractDocsRegions(source: string, label = "sample"): string {
	const lines = source.replace(/\r\n/g, "\n").split("\n");
	const regions: string[] = [];
	let current: string[] | null = null;

	for (const line of lines) {
		if (START.test(line)) {
			if (current) throw new Error(`${label}: docs:start inside an open region`);
			current = [];
		} else if (END.test(line)) {
			if (!current) throw new Error(`${label}: docs:end without docs:start`);
			regions.push(dedent(current));
			current = null;
		} else if (current) {
			current.push(line);
		}
	}
	if (current) throw new Error(`${label}: docs:start has no docs:end`);

	return regions.length > 0 ? regions.join("\n\n") : dedent(lines);
}

export interface SampleFile {
	language: Language;
	/** Fence language, e.g. `typescript` or `bash`. */
	fence: string;
	/** Absolute path of the file the code came from. */
	file: string;
	code: string;
}

/** Locates and reads one language's file for a sample. */
export function loadSampleFile(root: string, id: string, language: Language): SampleFile {
	let file: string;
	if (id.startsWith(STATIC_PREFIX)) {
		const dir = path.join(root, "static", id.slice(STATIC_PREFIX.length));
		const match = fs.existsSync(dir)
			? fs.readdirSync(dir).find((name) => name.startsWith(`${language}.`))
			: undefined;
		if (!match) throw new Error(`sample "${id}": no ${language}.* file in ${dir}`);
		file = path.join(dir, match);
	} else {
		file = path.join(root, COMPILED_LAYOUT[language](id));
		if (!fs.existsSync(file)) throw new Error(`sample "${id}": missing ${file}`);
	}

	const extension = path.extname(file).slice(1);
	const fence = FENCE_LANG_BY_EXTENSION[extension];
	if (!fence) throw new Error(`sample "${id}": unsupported extension .${extension} (${file})`);

	const code = extractDocsRegions(fs.readFileSync(file, "utf8"), file);
	return {
		language,
		fence,
		file,
		code: id.startsWith(STATIC_PREFIX) ? resolveVersionTokens(code, root, file) : code,
	};
}

export type FormatCode = (code: string, language: Language) => string;

/** The `<CodeGroup>` block for a sample, in the layout the guides already use. */
export function renderCodeGroup(
	root: string,
	id: string,
	format: FormatCode = (code) => code,
): string {
	const fences = LANGUAGES.map((language) => {
		const sample = loadSampleFile(root, id, language);
		const code = format(sample.code, language).replace(/\n+$/, "");
		return `\`\`\`${sample.fence} ${LANGUAGE_TITLE[language]}\n${code}\n\`\`\``;
	});
	return `<CodeGroup>\n\n${fences.join("\n\n")}\n\n</CodeGroup>`;
}

const MARKER = /^([ \t]*)\{\/\*\s*sample:\s*([A-Za-z0-9/_-]+)\s*\*\/\}[ \t]*$/;

/** Sample ids marked in an MDX file, in file order. */
export function findSampleIds(mdx: string): string[] {
	return mdx
		.split("\n")
		.map((line) => MARKER.exec(line)?.[2])
		.filter((id): id is string => id !== undefined);
}

export interface InjectResult {
	mdx: string;
	/** Sample ids that were injected, in file order. */
	ids: string[];
}

/**
 * Rewrites every marked `<CodeGroup>` in an MDX file.
 *
 * The marker must be on its own line and be followed (after blank lines) by a
 * `<CodeGroup>`. The block runs to the next `</CodeGroup>`.
 */
export function injectSamples(
	mdx: string,
	root: string,
	format: FormatCode = (code) => code,
	label = "mdx",
): InjectResult {
	const lines = mdx.split("\n");
	const out: string[] = [];
	const ids: string[] = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]!;
		const marker = MARKER.exec(line);
		if (!marker) {
			out.push(line);
			continue;
		}
		const indent = marker[1]!;
		const id = marker[2]!;

		let open = i + 1;
		while (open < lines.length && lines[open]!.trim() === "") open++;
		if (!lines[open]?.trim().startsWith("<CodeGroup>")) {
			throw new Error(`${label}:${i + 1}: sample "${id}" is not followed by a <CodeGroup>`);
		}
		let close = open;
		while (close < lines.length && !lines[close]!.includes("</CodeGroup>")) close++;
		if (close >= lines.length) {
			throw new Error(`${label}:${open + 1}: <CodeGroup> for sample "${id}" is never closed`);
		}

		// Prettier keeps a blank line between a JSX comment and the element after it.
		out.push(line, "");
		for (const rendered of renderCodeGroup(root, id, format).split("\n")) {
			// Fences stay at column 0 as in the existing guides; only the tags indent.
			const isTag = rendered === "<CodeGroup>" || rendered === "</CodeGroup>";
			out.push(isTag ? `${indent}${rendered}` : rendered);
		}
		ids.push(id);
		i = close;
	}

	return { mdx: out.join("\n"), ids };
}
