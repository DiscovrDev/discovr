import Discovr
import Foundation

// docs:start
func canDrillDeeper() -> Bool {
    return navigationStack.count < 3
}

// Before pushing a navigation tile onto your stack:
func drillIntoTile(client: DiscovrClient, tile: NavigationItem) async throws {
    if canDrillDeeper() {
        let pageData = try await client.getPage(tile)
        navigationStack.append(PageEntry(id: tile.pageId, name: pageData.name ?? tile.title))
        renderPage(pageData)
    } else {
        showToast("Cannot drill deeper.")
    }
}
// docs:end
