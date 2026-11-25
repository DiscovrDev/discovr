import type { NavigationItem } from "discovr";

// docs:start
async function drillIntoTile(tile: NavigationItem) {
	showLoadingIndicator();

	// Navigation tiles already carry their destination pageId (and ref) — no createPage needed.
	const [page, { rows }] = await Promise.all([client.getPage(tile), client.getRows(tile)]);
	renderHero(page.hero);
	renderRow(rows);

	hideLoadingIndicator();
}
// docs:end
void drillIntoTile;
