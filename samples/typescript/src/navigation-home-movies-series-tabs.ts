import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	// Create pages for each tab once, on app launch or after sign-in
	const tabs = {
		home: await client.createPage({ name: "Home" }),
		movies: await client.createPage({
			pageFilters: { mediaType: "movie" },
			name: "Movies",
		}),
		series: await client.createPage({
			pageFilters: { mediaType: "tv" },
			name: "Series",
		}),
	};

	// Later: user taps "Movies" tab
	const moviesData = await client.getPage(tabs.movies.id);
	renderPage(moviesData); // Display Movies tab rows
	// docs:end
}
