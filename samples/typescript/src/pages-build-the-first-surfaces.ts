// docs:start
import { DiscovrClient } from "discovr";
// docs:end

export async function sample() {
	// docs:start
	const client = new DiscovrClient("your-client-id");

	const home = await client.createPage({ name: "Home" });
	const movies = await client.createPage({
		pageFilters: { mediaType: "movie" },
		name: "Movies",
	});
	const series = await client.createPage({
		pageFilters: { mediaType: "tv" },
		name: "Series",
	});
	// docs:end
}
