import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	// A movie, or every aired episode of a show.
	const state = await client.markWatched(item);

	// One season of a show.
	await client.markWatched(item, { season: 2 });

	// One episode.
	await client.markWatched(item, { season: 2, episode: 5 });
	// docs:end
	void state;
}
