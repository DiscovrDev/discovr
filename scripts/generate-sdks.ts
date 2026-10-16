/**
 * Runs openapi-generator-cli for each language in openapi-generator-config.yaml.
 * Executes from `public/` so temp files and generator metadata stay scoped there.
 */

import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import yaml from "js-yaml";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_ROOT = path.resolve(scriptDir, "..");

const CONFIG_FILE = "openapi-generator-config.yaml";
const SPEC_FILE_REL = "docs/openapi.yaml";
const TEMPLATE_WORK_ROOT = path.join(PUBLIC_ROOT, "sdks", "template_work");
const TEMPLATE_OVERRIDE_ROOT = path.join(PUBLIC_ROOT, "sdks", "template_overrides");
const TMP_DIR = path.join(PUBLIC_ROOT, ".tmp");

interface LangConfig {
	readonly generatorName: string;
	readonly outputDir: string;
	readonly globalProperty?: Record<string, string>;
	readonly additionalProperties?: Record<string, unknown>;
	readonly modelNameMappings?: string;
	readonly typeMappings?: string;
	readonly importMappings?: string;
}

function ensureDir(dir: string): void {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

/**
 * Runs a command with arguments passed as an array (no shell), so
 * config-derived values (generator names, mapping strings, paths) can never
 * be interpreted as shell syntax — unlike `execSync`/`spawnSync(shell: true)`,
 * which both invoke `/bin/sh -c` on the fully-interpolated command string.
 */
function runOrThrow(command: string, args: readonly string[], cwd?: string): void {
	const result = spawnSync(command, args, { stdio: "inherit", cwd });
	if (result.status !== 0) {
		throw new Error(`${command} ${args.join(" ")} exited with code ${result.status ?? "unknown"}`);
	}
}

/** `1.0.0-alpha.1` -> `alpha`; a stable `1.2.3` -> `latest`. Used as the npm dist-tag. */
function distTagFor(version: string): string {
	const prerelease = version.split("-")[1];
	return prerelease ? prerelease.split(".")[0] : "latest";
}

/**
 * The Swift generator also emits CocoaPods, Carthage and XcodeGen files. We
 * distribute through SwiftPM only, so they would just be stale metadata (an empty
 * podspec source, a placeholder homepage) sitting in the published repository.
 */
function pruneUnpublishedSwiftFiles(swiftDir: string): void {
	const unpublished = new Set(["Cartfile", "git_push.sh", "project.yml"]);
	for (const name of fs.readdirSync(swiftDir)) {
		if (unpublished.has(name) || name.endsWith(".podspec")) {
			fs.rmSync(path.join(swiftDir, name));
		}
	}
}

/**
 * SwiftPM resolves a package from the repository root, but the SDK lives under
 * sdks/swift/. Derive a root manifest from the generated one so both stay in
 * step; the generated-artifacts CI job covers drift like any other output.
 */
function writeRootSwiftPackage(swiftDir: string): void {
	const generated = fs.readFileSync(path.join(swiftDir, "Package.swift"), "utf8");
	const rebased = generated
		.replace(/path: "Sources\//g, 'path: "sdks/swift/Sources/')
		.replace(/path: "Tests\//g, 'path: "sdks/swift/Tests/');
	if ((rebased.match(/path: "sdks\/swift\//g) ?? []).length < 2) {
		throw new Error(
			"Swift Package.swift no longer has the Sources/ and Tests/ paths this script rebases",
		);
	}
	const [toolsLine, ...rest] = rebased.split("\n");
	const note = [
		"// Generated from sdks/swift/Package.swift by scripts/generate-sdks.ts. Do not edit.",
		"// SwiftPM resolves a package from the repository root, so this manifest points",
		"// the same targets at their location under sdks/swift/.",
	];
	fs.writeFileSync(
		path.join(PUBLIC_ROOT, "Package.swift"),
		[toolsLine, ...note, ...rest].join("\n"),
	);
}

function copyOverrides(overridesDir: string, targetDir: string): void {
	if (!fs.existsSync(overridesDir)) return;
	runOrThrow("cp", ["-R", `${overridesDir}/.`, targetDir]);
}

try {
	const fileContents = fs.readFileSync(path.join(PUBLIC_ROOT, CONFIG_FILE), "utf8");
	const config = yaml.load(fileContents) as Record<string, LangConfig>;

	// One version for the API and all three SDKs: the bundled spec's info.version.
	const spec = yaml.load(fs.readFileSync(path.join(PUBLIC_ROOT, SPEC_FILE_REL), "utf8")) as {
		info?: { version?: string };
	};
	const specVersion = spec.info?.version;
	if (!specVersion) {
		throw new Error(
			`${SPEC_FILE_REL} has no info.version; run \`npm run openapi:bundle:public\` first.`,
		);
	}

	const targetLang = process.argv[2];
	const languages = targetLang ? [targetLang] : Object.keys(config);

	console.log(`🚀 Starting SDK generation for: ${languages.join(", ")}`);

	ensureDir(TMP_DIR);

	// Pin the generator-cli's active jar version explicitly. Relying on
	// openapitools.json alone isn't enough: on a fresh checkout with no jar
	// cached yet, the *first* subcommand run (typically `author template`,
	// below, since template_work/ is gitignored) resolves to "latest" instead
	// of honoring the pin, and that becomes the version used for the rest of
	// the process — silently diverging from what's tested locally, where a
	// jar is usually already cached from a prior run.
	const openApiToolsConfig = JSON.parse(
		fs.readFileSync(path.join(PUBLIC_ROOT, "openapitools.json"), "utf8"),
	) as { "generator-cli"?: { version?: string } };
	const pinnedVersion = openApiToolsConfig["generator-cli"]?.version;
	if (pinnedVersion) {
		console.log(`📌 Pinning openapi-generator-cli to ${pinnedVersion}...`);
		runOrThrow(
			"npx",
			["@openapitools/openapi-generator-cli", "version-manager", "set", pinnedVersion],
			PUBLIC_ROOT,
		);
	}

	for (const lang of languages) {
		if (!config[lang]) {
			console.error(`❌ Configuration for '${lang}' not found in ${CONFIG_FILE}`);
			process.exit(1);
		}

		const langConfig = config[lang];
		console.log(`\n📦 Generating ${lang} SDK...`);

		const templateWorkDir = path.join(TEMPLATE_WORK_ROOT, langConfig.generatorName);
		const templateOverrideDir = path.join(TEMPLATE_OVERRIDE_ROOT, langConfig.generatorName);
		const templateWorkRel = path.relative(PUBLIC_ROOT, templateWorkDir);
		const outputDirRel = path.relative(
			PUBLIC_ROOT,
			path.resolve(process.cwd(), langConfig.outputDir),
		);

		if (!fs.existsSync(templateWorkDir)) {
			ensureDir(path.dirname(templateWorkDir));
			console.log(`   Extracting templates for ${langConfig.generatorName}...`);
			runOrThrow(
				"npx",
				[
					"@openapitools/openapi-generator-cli",
					"author",
					"template",
					"-g",
					langConfig.generatorName,
					"-o",
					templateWorkRel,
				],
				PUBLIC_ROOT,
			);
		}

		copyOverrides(templateOverrideDir, templateWorkDir);

		const tempConfigRel = path.join(".tmp", `temp-config-${lang}.json`);
		const tempConfigPath = path.join(PUBLIC_ROOT, tempConfigRel);
		ensureDir(path.dirname(tempConfigPath));
		const additionalProperties = {
			...(langConfig.additionalProperties ?? {}),
			artifactVersion: specVersion,
			...(langConfig.generatorName === "typescript-fetch"
				? { npmVersion: specVersion, npmDistTag: distTagFor(specVersion) }
				: {}),
		};
		fs.writeFileSync(tempConfigPath, JSON.stringify(additionalProperties));

		try {
			const args = [
				"@openapitools/openapi-generator-cli",
				"generate",
				"-i",
				SPEC_FILE_REL,
				"-g",
				langConfig.generatorName,
				"-o",
				outputDirRel,
				"-c",
				tempConfigRel,
				"-t",
				templateWorkRel,
			];

			if (langConfig.globalProperty) {
				const props = Object.entries(langConfig.globalProperty)
					.map(([k, v]) => `${k}=${v}`)
					.join(",");
				args.push("--global-property", props);
			}
			if (langConfig.modelNameMappings) {
				args.push("--model-name-mappings", langConfig.modelNameMappings);
			}
			if (langConfig.typeMappings) {
				args.push("--type-mappings", langConfig.typeMappings);
			}
			if (langConfig.importMappings) {
				args.push("--import-mappings", langConfig.importMappings);
			}

			console.log(`   Executing: npx ${args.join(" ")}`);
			// Args passed as an array (no shell) so config-derived values (mapping
			// strings, paths) can never be interpreted as shell syntax.
			const env = {
				...process.env,
				npm_config_sigstore: "false",
				JAVA_OPTS: "-Dorg.slf4j.simpleLogger.defaultLogLevel=warn",
			};
			const result = spawnSync("npx", args, { encoding: "utf8", cwd: PUBLIC_ROOT, env });
			const combined = [result.stdout, result.stderr].filter(Boolean).join("");
			const warnAndAbove = combined
				.split("\n")
				.filter((line) => /\[main\]\s+(WARN|ERROR)/.test(line));
			if (warnAndAbove.length) process.stdout.write(warnAndAbove.join("\n") + "\n");
			if (result.status !== 0) {
				process.stderr.write(combined || result.error?.message || "Generator failed.\n");
				throw new Error(`Generator exited with code ${result.status ?? "unknown"}`);
			}
			const outputDir = path.join(PUBLIC_ROOT, outputDirRel);
			if (langConfig.generatorName === "swift6") {
				pruneUnpublishedSwiftFiles(outputDir);
				writeRootSwiftPackage(outputDir);
			}
			if (langConfig.generatorName === "typescript-fetch") {
				// `files` in package.json lists LICENSE, so the tarball needs a copy of it.
				fs.copyFileSync(path.join(PUBLIC_ROOT, "LICENSE"), path.join(outputDir, "LICENSE"));
			}
			console.log(`✅ ${lang} SDK generated successfully (version ${specVersion}).`);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			console.error(`❌ Failed to generate ${lang} SDK:`, message);
			process.exitCode = 1;
		} finally {
			if (fs.existsSync(tempConfigPath)) {
				fs.unlinkSync(tempConfigPath);
			}
		}
	}

	try {
		const remaining = fs.readdirSync(TMP_DIR);
		if (remaining.length === 0) fs.rmdirSync(TMP_DIR);
	} catch {
		// ignore
	}

	console.log("\n✨ All tasks completed.");
} catch (e: unknown) {
	console.error("Error:", e);
	process.exit(1);
}
