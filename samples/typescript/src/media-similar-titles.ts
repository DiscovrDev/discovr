// docs:start
import { DiscovrClient } from "discovr";
import type { SimilarResponse } from "discovr";
// docs:end

export async function sample() {
	// docs:start
	const client = new DiscovrClient("your-client-id");

	async function loadSimilar(mediaId: string) {
		try {
			const res: SimilarResponse = await client.getSimilarRecommendations(mediaId, {
				language: "en-US",
				page: 1,
			});
			return res.results ?? [];
		} catch {
			return [];
		}
	}
	// docs:end
}
