import { type DiscovrClient } from "discovr";

// docs:start
async function loadPageEfficiently(pageId: string) {
	// Step 1: Fetch hero (fast)
	const pageData = await client.getPage(pageId);
	renderHero(pageData.hero); // User sees hero immediately

	// Step 2: Fetch rows lazily (after user sees hero)
	const { rows } = await client.getRows(pageId);

	// Step 3: Set up Intersection Observer for each row
	rows.forEach((row) => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(async (entry) => {
				if (entry.isIntersecting) {
					// Row is visible; fetch its items
					const { items } = await client.getRowItems(pageId, row.id);
					renderRow(row, items);
					observer.unobserve(entry.target);
				}
			});
		});

		const rowElement = document.getElementById(`row-${row.id}`);
		if (rowElement) observer.observe(rowElement);
	});
}

loadPageEfficiently(homePageId);
// docs:end
