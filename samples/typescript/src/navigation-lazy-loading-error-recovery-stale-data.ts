import { type Row } from "discovr";

// docs:start
async function loadRowItemsWithErrorHandling(pageId: string, row: Row) {
	try {
		const { items } = await client.getRowItems(pageId, row.id);
		renderRow(row, items);
	} catch (err) {
		// Offer a retry that runs the same load again
		renderRowError(row, () => loadRowItemsWithErrorHandling(pageId, row));
	}
}
// docs:end
