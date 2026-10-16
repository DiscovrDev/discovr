import type { SearchResult } from "discovr";

export async function sample() {
	// docs:start
	const people = response.results.filter((r) => r.mediaType === "person");
	const titles = response.results.filter((r) => r.mediaType !== "person");

	function onPersonTapped(person: SearchResult) {
		// Their credits open exactly like any other title.
		for (const credit of person.knownFor ?? []) {
			renderTitle({
				id: credit.id, // already MV_ / TV_ prefixed
				title: credit.title ?? credit.name,
				poster: credit.posterPath?.w185,
			});
		}
	}
	// docs:end
}
