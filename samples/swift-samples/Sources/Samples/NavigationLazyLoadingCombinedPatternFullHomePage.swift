import Discovr
import Foundation

// docs:start
func loadHomePageEfficiently(homePageId: String) async throws {
    // 1. Load hero
    let pageData = try await client.getPage(pageId: homePageId)
    renderHero(pageData.hero)

    // 2. Continue Watching from profile context
    let continueWatching = try await client.getPlaybackItems(limit: 10)
    renderContinueWatchingRow(continueWatching.items)

    // 3. Fetch row shells
    let rows = try await client.getRows(pageId: homePageId).rows
    var loaded: Set<String> = []

    // 4. Observe and fetch items
    for row in rows {
        observeRowVisibility(row: row) { isVisible in
            if isVisible && loaded.insert(row.id).inserted {
                Task {
                    guard let page = try? await client.getRowItems(pageId: homePageId, rowId: row.id) else { return }
                    renderRow(row, page.items)
                }
            }
        }
    }
}
// docs:end
