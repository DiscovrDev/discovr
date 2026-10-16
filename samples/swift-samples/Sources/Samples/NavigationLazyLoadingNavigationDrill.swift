import Discovr
import Foundation

// docs:start
func drillIntoGenre(_ genreFilter: FilterSpec) async throws {
    showLoadingIndicator()

    let newPage = try await client.createPage(
        pageFilters: genreFilter
    )
    try await loadPageEfficiently(pageId: newPage.id)

    hideLoadingIndicator()
}
// docs:end
