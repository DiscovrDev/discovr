// docs:start
import { DiscovrClient } from "discovr";
import type { SeasonDetailsResponse, SeasonProfileMeta } from "discovr";
// docs:end

export async function sample() {
	// docs:start
	const client = new DiscovrClient("your-client-id");

	async function loadSeasonWithFinished(tvId: string, seasonNumber: number) {
		const [details, meta]: [SeasonDetailsResponse, SeasonProfileMeta] = await Promise.all([
			client.getSeasonDetails(tvId, seasonNumber, { language: "en" }),
			client.getSeasonProfileMeta(tvId, seasonNumber),
		]);

		const finishedByEpisode = new Map(meta.episodes.map((e) => [e.episode, e.completed]));

		return (details.episodes ?? []).map((episode) => ({
			...episode,
			finished: finishedByEpisode.get(episode.episodeNumber) ?? false,
		}));
	}
	// docs:end
}
