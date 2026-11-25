// docs:start
import { refOrId } from "discovr";
// docs:end
import type { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	// Opening a title from a row
	const details = await client.getMedia(refOrId(item));
	const state = await client.setRating(refOrId(item), "liked");

	// Drilling into a navigation or provider tile
	const page = await client.getPage(refOrId(tile));
	// docs:end
	void details;
	void state;
	void page;
}
