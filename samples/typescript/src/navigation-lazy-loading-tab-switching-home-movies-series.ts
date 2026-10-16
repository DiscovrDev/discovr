import { type DiscovrClient, type Page } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	const tabPages: Record<"home" | "movies" | "series", Page | null> = {
		home: null,
		movies: null,
		series: null,
	};

	async function switchTab(tab: "home" | "movies" | "series") {
		// If already loaded, reuse
		if (tabPages[tab]) {
			renderPage(tabPages[tab]);
			return;
		}

		// Otherwise fetch it once; repeat getPage calls are served from the SDK's cache
		const pageData = await client.getPage(tabPageIds[tab]);
		tabPages[tab] = pageData;
		renderPage(pageData);
	}
	// docs:end
}
