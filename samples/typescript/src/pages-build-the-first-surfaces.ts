// docs:start
import { DiscovrClient } from "discovr";
// docs:end

export async function sample() {
	// docs:start
	const client = new DiscovrClient("your-client-id");

	const home = await client.createPage();
	const movies = await client.createPage({
		pageFilters: { mediaType: "movie" },
	});
	const series = await client.createPage({
		pageFilters: { mediaType: "tv" },
	});
	// docs:end
}
