import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	// User taps "Romance" in the navigation row
	const romance = items.find((i) => i.type === "navigation" && i.title === "Romance");

	if (romance?.type === "navigation") {
		// Push the tile's page ID onto your stack, and pass the tile so its ref is attributed
		navigationStack.push({ id: romance.pageId, name: romance.title });
		const pageData = await client.getPage(romance);
		renderPage(pageData);
	}
	// docs:end
}
