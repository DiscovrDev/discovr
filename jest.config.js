/** @type {import('jest').Config} */
module.exports = {
	displayName: "public-scripts",
	preset: "ts-jest",
	testEnvironment: "node",
	rootDir: __dirname,
	testMatch: ["**/_tests/**/*.test.ts"],
	testPathIgnorePatterns: [
		"/node_modules/",
		// Gitignored staging the generator rewrites on every run; its tests are
		// byte-copies of the ones in `template_overrides`.
		"<rootDir>/sdks/template_work/",
		// `_DiscovrAuth.ts` and `DiscovrClient.ts` import generated siblings
		// (`./runtime`, `./apis/DiscovrApi`, `./auth`) that only exist after
		// generation, so they can't be compiled where they're authored — they're
		// template fragments, not standalone modules. Their tests run against
		// the generated copies at `sdks/typescript/src/_tests/`, which is the
		// artifact customers get. The self-contained overrides (`_DiscovrCache`,
		// `_RequestLoopGuard`) do run here.
		"<rootDir>/sdks/template_overrides/typescript-fetch/_tests/_DiscovrAuth.test.ts",
		"<rootDir>/sdks/template_overrides/typescript-fetch/_tests/refOrId.test.ts",
	],
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				tsconfig: {
					module: "commonjs",
					target: "es2017",
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
					skipLibCheck: true,
					isolatedModules: false,
					moduleResolution: "node",
				},
				astTransformers: {
					before: [],
				},
			},
		],
	},
	moduleFileExtensions: ["ts", "js", "json"],
	transformIgnorePatterns: [],
};
