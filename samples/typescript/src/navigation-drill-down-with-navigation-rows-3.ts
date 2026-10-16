import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	// User taps "Romance" in the navigation row
	const romance = items.find((i) => i.type === "navigation" && i.title === "Romance");

	if (romance?.type === "navigation") {
		// Push the pre-existing page ID onto your navigation stack
		navigationStack.push({ id: romance.pageId, name: romance.title });
		const pageData = await client.getPage(romance.pageId);
		renderPage(pageData);
	}
	// docs:end
}
