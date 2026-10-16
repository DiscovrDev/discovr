import { type Row } from "discovr";

// docs:start
async function loadHomePageEfficiently(homePageId: string) {
	// 1. Load hero immediately
	const pageData = await client.getPage(homePageId);
	renderHero(pageData.hero);

	// 2. Insert "Continue Watching" row from profile context
	const { items: continueWatching } = await client.getPlaybackItems({ limit: 10 });
	renderContinueWatchingRow(continueWatching);

	// 3. Fetch recommendation rows, but not their items yet
	const { rows } = await client.getRows(homePageId);
	const loaded = new Set<string>();

	// 4. Observe each row for visibility
	rows.forEach((row) => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(async (entry) => {
				if (entry.isIntersecting && !loaded.has(row.id)) {
					// Fetch items for visible row
					loaded.add(row.id);
					const page = await client.getRowItems(homePageId, row.id);
					renderRow(row, page.items);

					// Also observe for pagination
					observeRowEnd(row, homePageId, page.nextPageToken);
				}
			});
		});

		const rowElement = document.getElementById(`row-${row.id}`);
		if (rowElement) observer.observe(rowElement);
	});
}

function observeRowEnd(row: Row, pageId: string, firstToken?: string) {
	let nextPageToken = firstToken;

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(async (entry) => {
			if (entry.isIntersecting && nextPageToken) {
				const page = await client.getRowItems(pageId, row.id, { nextPageToken });
				appendItems(row, page.items);
				nextPageToken = page.nextPageToken;
			}
		});
	});

	const endMarker = document.getElementById(`row-${row.id}-end`);
	if (endMarker) observer.observe(endMarker);
}
// docs:end
