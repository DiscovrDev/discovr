import { DiscovrClient, type SearchResult } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	let page = 1;
	let results: SearchResult[] = [];

	async function loadMore(query: string) {
		const response = await client.searchMedia({ query, page });
		results = [...results, ...response.results];
		page += 1;
		return response.hasMore;
	}
	// docs:end
}
