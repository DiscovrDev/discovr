/**
 * What the registries and the Swift Package Manager see when the SDKs are
 * published. The generator emits placeholder metadata (an unset repository,
 * "OpenAPI-Generator" as the author, a stock Maven group) unless the config and
 * template overrides replace it, and a placeholder only shows up after release.
 *
 * It also pins the rule the release pipeline relies on: the API and all three SDKs
 * carry the same version, taken from the spec's `info.version`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import yaml from "js-yaml";

const PUBLIC_ROOT = join(__dirname, "..", "..");

const read = (rel: string): string => readFileSync(join(PUBLIC_ROOT, rel), "utf8");
const infoVersion = (rel: string): string =>
	(yaml.load(read(rel)) as { info: { version: string } }).info.version;

const REPO = "https://github.com/DiscovrDev/discovr";

describe("the published SDK metadata", () => {
	const version = infoVersion("open_api/public.yaml");

	it("bundles the same spec version it is authored with", () => {
		expect(infoVersion("docs/openapi.yaml")).toBe(version);
	});

	it("gives the API and every SDK one version", () => {
		const npm = JSON.parse(read("sdks/typescript/package.json")) as { version: string };
		expect(npm.version).toBe(version);
		expect(read("sdks/kotlin/build.gradle.kts")).toMatch(
			new RegExp(`^version = "${version.replace(/\./g, "\\.")}"$`, "m"),
		);
	});

	it("has real npm metadata", () => {
		const pkg = JSON.parse(read("sdks/typescript/package.json")) as Record<string, unknown> & {
			repository: { url: string; directory: string };
			files: string[];
		};
		expect(pkg.name).toBe("discovr");
		expect(pkg.license).toBe("MIT");
		expect(pkg.author).toBe("Discovr");
		expect(pkg.repository.url).toBe(`${REPO}.git`);
		expect(pkg.repository.directory).toBe("sdks/typescript");
		expect(pkg.files).toEqual(expect.arrayContaining(["dist", "LICENSE"]));
		expect(existsSync(join(PUBLIC_ROOT, "sdks/typescript/LICENSE"))).toBe(true);
		expect(JSON.stringify(pkg)).not.toMatch(
			/GIT_USER_ID|GIT_REPO_ID|OpenAPI-Generator|Proprietary/,
		);
	});

	it("has the Maven Central coordinates the docs promise", () => {
		const gradle = read("sdks/kotlin/build.gradle.kts");
		expect(gradle).toContain('group = "media.discovr"');
		expect(gradle).toContain("com.vanniktech.maven.publish");
		expect(gradle).toContain(`url.set("${REPO}")`);
		expect(gradle).not.toContain("org.openapitools");
		expect(read("sdks/kotlin/settings.gradle.kts")).toContain('rootProject.name = "discovr-sdk"');
	});

	it("is installable by Swift Package Manager from the repository root", () => {
		const manifest = read("Package.swift");
		expect(manifest).toContain('path: "sdks/swift/Sources/Discovr"');
		expect(manifest).toContain('path: "sdks/swift/Tests/DiscovrTests"');
		expect(manifest).toContain('name: "Discovr"');
		for (const stale of ["Discovr.podspec", "Cartfile", "git_push.sh", "project.yml"]) {
			expect(existsSync(join(PUBLIC_ROOT, "sdks/swift", stale))).toBe(false);
		}
	});

	it("tells people how to install the version it ships", () => {
		for (const page of [
			"docs/guides/getting-started/quickstart.mdx",
			"docs/sdk-reference/index.mdx",
		]) {
			const mdx = read(page);
			expect(mdx).toContain(`media.discovr:discovr-sdk:${version}`);
			expect(mdx).toContain(`${REPO}"`);
			expect(mdx).not.toContain("discovr-media/");
		}
	});

	it("carries the license and the notice", () => {
		expect(read("LICENSE")).toMatch(/^MIT License/);
		expect(read("NOTICE")).toMatch(/not covered by that license/i);
	});
});
