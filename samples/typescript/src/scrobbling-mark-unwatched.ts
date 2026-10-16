import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient, mediaId: string) {
	// docs:start
	// A movie, or every season of a show.
	await client.markUnwatched(mediaId);

	// One season of a show.
	await client.markUnwatched(mediaId, { season: 2 });

	// One episode.
	await client.markUnwatched(mediaId, { season: 2, episode: 5 });
	// docs:end
}
