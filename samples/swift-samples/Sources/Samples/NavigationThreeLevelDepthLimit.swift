import Discovr
import Foundation

// docs:start
func canDrillDeeper() -> Bool {
    return navigationStack.count < 3
}

// Before creating a new page on navigation tap:
func drillDeeper(client: DiscovrClient, pageFilters: FilterSpec) async throws {
    if canDrillDeeper() {
        let newPage = try await client.createPage(pageFilters: pageFilters)
        navigationStack.append(PageEntry(id: newPage.id))
    } else {
        showToast("Cannot drill deeper.")
    }
}
// docs:end
