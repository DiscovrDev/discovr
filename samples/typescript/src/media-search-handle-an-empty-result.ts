import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient, query: string) {
	// docs:start
	try {
		const response = await client.searchMedia({ query });

		if (response.results.length === 0 && !response.hasMore) {
			showEmptyState(`No matches for "${query}". Try a different search.`);
			return;
		}

		render(response.results);
	} catch (error) {
		showError(error);
	}
	// docs:end
}
