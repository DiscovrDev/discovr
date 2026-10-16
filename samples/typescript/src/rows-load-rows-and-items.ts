// docs:start
import { DiscovrClient } from "discovr";
// docs:end

export async function sample() {
	// docs:start
	const client = new DiscovrClient("your-client-id");

	const pageId = "your-page-id";
	const { rows, hasMore, nextPageToken } = await client.getRows(pageId, { limit: 10 });

	for (const row of rows) {
		switch (row.type) {
			case "media":
			case "top_n":
				break;
			case "navigation":
			case "provider":
				break;
		}
	}

	const first = rows[0];
	if (first) {
		const items = await client.getRowItems(pageId, first.id, { limit: 20 });
		for (const item of items.items) {
			if (item.type === "media") {
				console.log(item.title, item.mediaType);
			} else if (item.type === "navigation" || item.type === "provider") {
				console.log(item.title, item.pageId);
			}
		}
	}
	// docs:end
}
