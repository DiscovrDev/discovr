import type { NavigationItem } from "discovr";

// docs:start
function canDrillDeeper(): boolean {
	// Home=1, Movies=2, Romance=3. Depth limit is 3.
	return navigationStack.length < 3;
}

// Before pushing a navigation tile onto your stack:
async function drillIntoTile(tile: NavigationItem) {
	if (canDrillDeeper()) {
		const pageData = await client.getPage(tile);
		navigationStack.push({ id: tile.pageId, name: pageData.name ?? tile.title });
		renderPage(pageData);
	} else {
		showToast("Cannot drill deeper. Try another category.");
	}
}
// docs:end
void drillIntoTile;
