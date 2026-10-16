// docs:start
import { idOf, refOrId } from "discovr";
// docs:end
import type { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	// Tapping a tile: the URL names the title, the navigation state carries the ref
	navigate(`/title/${item.id}`, { state: { ref: refOrId(item) } });

	// On the detail screen: act with the ref, name the title with the id
	const { id } = useParams();
	const ref = useLocation().state?.ref ?? id; // opened from a shared link? the id works too
	const details = await client.getMedia(ref);
	await client.addLikedItem(ref);

	// Holding only a ref, like a saved "recently viewed" entry? idOf gets the id back.
	const cacheKey = idOf(savedRef);
	// docs:end
}
