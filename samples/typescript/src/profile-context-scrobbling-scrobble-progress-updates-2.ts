import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient, mediaId: string) {
	// docs:start
	await client.scrobble(mediaId, progress, {
		tv: { season: 1, episode: 5 },
	});
	// docs:end
}
