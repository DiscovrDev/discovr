import { DiscovrClient } from "discovr";

export async function sample() {
	// docs:start
	for (const result of response.results) {
		if (result.mediaType === "person") {
			renderPerson(result.name, result.profilePath?.w185);
			continue;
		}

		renderTitle({
			id: result.id,
			title: result.title ?? result.name,
			poster: result.posterPath?.w185,
			year: (result.releaseDate ?? result.firstAirDate)?.getFullYear(),
		});
	}
	// docs:end
}
