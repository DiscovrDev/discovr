import { TAG_CONFIG } from "../facade/config";
import { toKebabCase } from "./helpers";

/** One row of the "Explore" list, pointing at a page that actually exists. */
export interface IndexNavEntry {
	title: string;
	href: string;
	blurb: string;
}

/** Blurbs per tag. Tags with no entry still appear, just without prose. */
const TAG_BLURBS: Record<string, string> = {
	Authentication: "Sign-in flows, profile selection, and reactive state",
	Profiles: "List, create, and manage viewer profiles",
	"Profile Lists": "Liked, disliked, watchlist, playback, and history",
	Scrobble: "Record playback progress and skip events",
	Pages: "Create and fetch recommendation pages",
	Rows: "Fetch rows and row items for a page",
	Search: "Full-text search for titles and people",
	Media: "Title details, artwork, seasons, and similar titles",
	Misc: "Profile images, GIF search, and other helpers",
};

/**
 * Builds the "Explore" links from the pages the run is actually generating.
 *
 * Every group links to a real leaf page. There is no `/sdk-reference/<tag>`
 * index page — linking to one produces a dead link, which is what this
 * previously did for all nine groups.
 */
export function buildIndexNav(
	operationsByTag: Map<string, Array<{ operationId?: string }>>,
	authFirstMethodId?: string,
): IndexNavEntry[] {
	const entries: IndexNavEntry[] = [];

	const tags = [...operationsByTag.keys()].sort(
		(a, b) => (TAG_CONFIG[a]?.order ?? 99) - (TAG_CONFIG[b]?.order ?? 99),
	);

	for (const tag of tags) {
		const sdkFile = TAG_CONFIG[tag]?.sdkFile ?? tag.toLowerCase().replace(/\s+/g, "-");

		// Authentication's landing page is a hand-maintained façade method, not a
		// spec operation — those are what a reader wants first.
		const slug =
			tag === "Authentication" && authFirstMethodId
				? toKebabCase(authFirstMethodId)
				: toKebabCase(operationsByTag.get(tag)?.find((op) => op.operationId)?.operationId ?? "");
		if (!slug) continue;

		entries.push({
			title: tag,
			href: `/sdk-reference/${sdkFile}/${slug}`,
			blurb: TAG_BLURBS[tag] ?? "",
		});
	}

	return entries;
}

export function generateIndexPage(nav: IndexNavEntry[]): string {
	const navList = nav
		.map((e) => `- **[${e.title}](${e.href})**${e.blurb ? ` — ${e.blurb}` : ""}`)
		.join("\n");

	return `---
title: "SDK Reference"
description: "TypeScript, Kotlin, and Swift SDK reference for Discovr."
---

One API across TypeScript, Kotlin, and Swift. The same methods, the same order of operations — only the language idioms differ.

## Installation

{/* sample: static/install */}

<CodeGroup>

</CodeGroup>

<Note>
**The SDKs are in alpha**, so things can still change between releases. Find the latest version on the [releases page](https://github.com/DiscovrDev/discovr/releases).
</Note>

## Quick start

Sign in, pick a profile, and render a page of recommendations.

<CodeGroup>

\`\`\`typescript TypeScript
import { DiscovrClient } from "discovr";

const client = new DiscovrClient("your-client-id");

// Show the code, then wait for the user to confirm it on another device.
const { userCode, qrCode } = await client.signInWithDeviceCode();
console.log("Enter code:", userCode);

await new Promise<void>((resolve) => {
  const unsubscribe = client.onAuthStateChanged(({ signedIn }) => {
    if (!signedIn) return;
    unsubscribe();
    resolve();
  });
});

const { profiles } = await client.getProfiles();
await client.selectProfile(profiles[0].id);

const page = await client.createPage();
const { rows } = await client.getRows(page.id);
\`\`\`

\`\`\`kotlin Kotlin
import api.discovr.DiscovrClient
import kotlinx.coroutines.flow.first

val client = DiscovrClient("your-client-id", storage = sharedPrefsStorage)

// Show the code, then wait for the user to confirm it on another device.
val code = client.signInWithDeviceCode()
println("Enter code: \${code.userCode}")

client.authState.first { it.signedIn }

val profiles = client.getProfiles().profiles
client.selectProfile(profiles.first().id)

val page = client.createPage()
val rows = client.getRows(page.id).rows
\`\`\`

\`\`\`swift Swift
import Discovr

let client = DiscovrClient(clientId: "your-client-id")

// Show the code, then wait for the user to confirm it on another device.
let code = try await client.signInWithDeviceCode()
print("Enter code: \\(code.userCode)")

for await state in await client.authStateStream where state.signedIn {
    break
}

let profiles = try await client.getProfiles().profiles
try await client.selectProfile(profileId: profiles[0].id)

let page = try await client.createPage()
let rows = try await client.getRows(pageId: page.id).rows
\`\`\`

</CodeGroup>

<Tip>
	In a hurry? [\`signInWithDemo()\`](/sdk-reference/authentication/sign-in-with-demo) skips sign-in
	entirely and hands you a populated sandbox account.
</Tip>

## Explore

${navList}

Every type returned by these methods is documented under [Types](/sdk-reference/types).
`;
}
