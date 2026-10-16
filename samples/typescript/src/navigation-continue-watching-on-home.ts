import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	const [homePageData, continueWatching] = await Promise.all([
		client.getPage(homePageId),
		client.getPlaybackItems().then((playback) => playback.items), // Continue Watching = playback list
	]);

	// In your UI:
	// 1. Render hero from homePageData.hero
	// 2. Render continueWatching row
	// 3. Render homePageData.rows below
	// docs:end
}
