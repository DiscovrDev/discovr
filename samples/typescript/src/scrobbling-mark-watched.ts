import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient, mediaId: string) {
	// docs:start
	// A movie, or every aired episode of a show.
	const state = await client.markWatched(mediaId);

	// One season of a show.
	await client.markWatched(mediaId, { season: 2 });

	// One episode.
	await client.markWatched(mediaId, { season: 2, episode: 5 });
	// docs:end
	void state;
}
