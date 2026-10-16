import { type FilterSpec } from "discovr";

// docs:start
async function drillIntoGenre(genreFilter: FilterSpec) {
	showLoadingIndicator();

	const newPage = await client.createPage({
		pageFilters: genreFilter,
	});
	await loadPageEfficiently(newPage.id);

	hideLoadingIndicator();
}
// docs:end
