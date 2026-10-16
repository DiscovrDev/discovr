import { DiscovrClient } from "discovr";

// docs:start
function canDrillDeeper(): boolean {
	// Home=1, Movies=2, Romance=3. Depth limit is 3.
	return navigationStack.length < 3;
}

// Before creating a new page on navigation tap:
if (canDrillDeeper()) {
	const newPage = await client.createPage({ pageFilters });
	navigationStack.push({ id: newPage.id });
} else {
	showToast("Cannot drill deeper. Try another category.");
}
// docs:end
