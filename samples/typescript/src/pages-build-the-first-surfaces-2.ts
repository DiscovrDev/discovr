import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient, home: { id: string }) {
	// docs:start
	const page = await client.getPage(home.id);
	const { rows, hasMore, nextPageToken } = await client.getRows(home.id, { limit: 10 });
	console.log(page.hero.length, rows.length, hasMore, nextPageToken);
	// docs:end
}
