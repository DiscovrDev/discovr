import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	const ep5 = client.trackPlayback(item, {
		tv: { season: 1, episode: 5 },
		onCompleted: (res) => console.log("Completed seasons:", res.completedSeasons),
	});
	ep5.start(0);
	await ep5.finish();

	// Next-episode autoplay: wait for ep5's final scrobble before ep6's start lands.
	const ep6 = client.trackPlayback(item, {
		tv: { season: 1, episode: 6 },
		after: ep5,
	});
	ep6.start(0);
	// docs:end
}
