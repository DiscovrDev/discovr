import { type Row, type RowItem } from "discovr";

// docs:start
async function loadRowItemsOnScroll(pageId: string, row: Row) {
	// Fetch the first page of items (keep limit around 10 — every returned item counts as served)
	let page = await client.getRowItems(pageId, row.id, { limit: 10 });
	let items: RowItem[] = page.items;
	renderItems(items);

	// Watch for scroll near the end
	const container = document.getElementById(`row-${row.id}`);
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(async (entry) => {
			if (entry.isIntersecting && page.hasMore && page.nextPageToken) {
				// User scrolled near the end; fetch the next page
				page = await client.getRowItems(pageId, row.id, {
					limit: 10,
					nextPageToken: page.nextPageToken,
				});
				items = [...items, ...page.items];
				renderItems(items);
			}
		});
	});

	if (container) observer.observe(container);
}
// docs:end
