import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	const navRow = rows.find((r) => r.type === "navigation");
	if (navRow) {
		const { items } = await client.getRowItems(homePageId, navRow.id);
		items.forEach((item) => {
			if (item.type === "navigation") {
				console.log(`Destination: ${item.title} → page ${item.pageId}`);
			}
		});
	}
	// docs:end
}
