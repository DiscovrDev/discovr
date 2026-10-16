import Discovr
import Foundation

// docs:start
@MainActor
func loadRowItemsOnScroll(pageId: String, row: Row) async throws {
    var page = try await client.getRowItems(pageId: pageId, rowId: row.id)
    var items = page.items
    renderItems(items)

    // Observe for scroll near end
    observeScrollNearEnd(row: row) {
        guard page.hasMore, let token = page.nextPageToken else { return }
        Task {
            guard let next = try? await client.getRowItems(pageId: pageId, rowId: row.id, nextPageToken: token) else { return }
            page = next
            items += next.items
            renderItems(items)
        }
    }
}
// docs:end
