import type { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	// Opening a title from a row — pass the item directly so its ref is included automatically
	const [details, state] = await Promise.all([client.getMedia(item), client.getTitleState(item)]);

	// Rating, watchlist, scrobbling, and marking watched accept items too
	const updated = await client.setRating(item, "liked");

	// Drilling into a navigation or provider tile
	const page = await client.getPage(tile);
	// docs:end
	void details;
	void state;
	void updated;
	void page;
}
