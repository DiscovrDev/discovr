import Discovr
import Foundation

// docs:start
func loadPageEfficiently(pageId: String) async throws {
    // Fetch hero first
    let pageData = try await client.getPage(pageId: pageId)
    renderHero(pageData.hero)

    // Fetch rows
    let rows = try await client.getRows(pageId: pageId).rows

    // Observe each row for visibility
    for row in rows {
        observeRowVisibility(row: row) { isVisible in
            if isVisible {
                Task {
                    guard let page = try? await client.getRowItems(pageId: pageId, rowId: row.id) else { return }
                    renderRow(row, page.items)
                }
            }
        }
    }
}

func observeRowVisibility(row: Row, callback: @escaping (Bool) -> Void) {
    // Use UIView visibility APIs or SwiftUI observers
}
// docs:end
