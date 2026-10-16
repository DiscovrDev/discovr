// docs:start
import { refOrId } from "discovr";
// docs:end
import type { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	// Opening a title from a row
	const details = await client.getMedia(refOrId(item));
	await client.addLikedItem(refOrId(item));

	// Drilling into a navigation or provider tile
	const page = await client.getPage(refOrId(tile));
	// docs:end
}
