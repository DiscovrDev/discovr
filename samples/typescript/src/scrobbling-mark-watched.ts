import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient, mediaId: string) {
	// docs:start
	// A movie.
	await client.scrobble(mediaId, 100);

	// One episode of a show.
	await client.scrobble(mediaId, 100, { tv: { season: 2, episode: 5 } });
	// docs:end
}
