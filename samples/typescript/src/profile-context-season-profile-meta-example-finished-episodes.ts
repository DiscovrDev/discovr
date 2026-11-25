// docs:start
import { DiscovrClient } from "discovr";
import type { SeasonDetailsResponse, SeasonState } from "discovr";
// docs:end

export async function sample() {
	// docs:start
	const client = new DiscovrClient("your-client-id");

	async function loadSeasonWithFinished(tvId: string, seasonNumber: number) {
		const [details, state]: [SeasonDetailsResponse, SeasonState] = await Promise.all([
			client.getSeasonDetails(tvId, seasonNumber, { language: "en" }),
			client.getSeasonState(tvId, seasonNumber),
		]);

		const finishedByEpisode = new Map(state.episodes.map((e) => [e.episode, e.completed]));

		return (details.episodes ?? []).map((episode) => ({
			...episode,
			finished: finishedByEpisode.get(episode.episodeNumber) ?? false,
		}));
	}
	// docs:end
}
