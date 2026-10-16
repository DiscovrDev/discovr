// docs:start
import { DiscovrClient, type SearchResult } from "discovr";
// docs:end

export async function sample() {
	// docs:start
	const client = new DiscovrClient("your-client-id");

	async function runSearch(query: string) {
		const response = await client.searchMedia({ query });

		if (response.results.length === 0) {
			console.log("No matches — try a different search.");
			return;
		}

		const first = response.results[0];

		if (first.mediaType === "person") {
			// People have no detail view; open one of their credits instead.
			const credit = first.knownFor?.[0];
			if (credit) {
				const media = await client.getMedia(credit.id);
				console.log(`${first.name} → ${media.movie?.title ?? media.tv?.name}`);
			}
			return;
		}

		const media = await client.getMedia(first.id);
		const details = media.movie ?? media.tv;
		console.log(media.movie?.title ?? media.tv?.name, details?.overview);
	}

	runSearch("oppenheimer");
	// docs:end
}
