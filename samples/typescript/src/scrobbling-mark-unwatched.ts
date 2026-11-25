import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	// A movie, or every season of a show.
	const state = await client.markUnwatched(item);

	// One season of a show.
	await client.markUnwatched(item, { season: 2 });

	// One episode.
	await client.markUnwatched(item, { season: 2, episode: 5 });
	// docs:end
	void state;
}
