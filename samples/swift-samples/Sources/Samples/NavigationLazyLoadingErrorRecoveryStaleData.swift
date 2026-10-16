import Discovr
import Foundation

// docs:start
func loadRowItemsWithErrorHandling(pageId: String, row: Row) async {
    do {
        let items = try await client.getRowItems(pageId: pageId, rowId: row.id).items
        renderRow(row, items)
    } catch {
        // Offer a retry that runs the same load again
        renderRowError(row) {
            Task {
                await loadRowItemsWithErrorHandling(pageId: pageId, row: row)
            }
        }
    }
}
// docs:end
