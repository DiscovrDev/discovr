import Discovr
import Foundation

// docs:start
func drillIntoTile(_ tile: NavigationItem) async throws {
    showLoadingIndicator()

    // Navigation tiles already carry their destination pageId (and ref) — no createPage needed.
    async let page = client.getPage(tile)
    async let rows = client.getRows(tile)
    let (pageData, rowBundle) = try await (page, rows)
    renderHero(pageData.hero)
    renderRow(rowBundle.rows)

    hideLoadingIndicator()
}
// docs:end
