// docs:start
import { DiscovrClient } from "discovr";
import type { SeasonDetailsResponse } from "discovr";
// docs:end

export async function sample() {
	// docs:start
	const client = new DiscovrClient("your-client-id");

	async function loadSeason(tvId: string, seasonNumber: number) {
		const season: SeasonDetailsResponse = await client.getSeasonDetails(tvId, seasonNumber, {
			language: "en",
		});
		return season.episodes ?? [];
	}
	// docs:end
}
