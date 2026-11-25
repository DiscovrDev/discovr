import Discovr
import Foundation

// docs:start
@MainActor
func loadRowItemsOnScroll(pageId: String, row: Row) async throws {
    // Fetch the first page of items (keep limit around 10 — every returned item counts as served)
    var page = try await client.getRowItems(pageId: pageId, rowId: row.id, limit: 10)
    var items = page.items
    renderItems(items)

    // Observe for scroll near end
    observeScrollNearEnd(row: row) {
        guard page.hasMore, let token = page.nextPageToken else { return }
        Task {
            guard let next = try? await client.getRowItems(pageId: pageId, rowId: row.id, nextPageToken: token, limit: 10) else { return }
            page = next
            items += next.items
            renderItems(items)
        }
    }
}
// docs:end
