import Discovr
import Foundation

private func sample(client: DiscovrClient, items: [RowItem]) async throws {
    // docs:start
    // User taps "Romance" in the navigation row
    let romance = items.compactMap { item -> NavigationItem? in
        if case .typeNavigationItem(let nav) = item { return nav }
        return nil
    }.first { $0.title == "Romance" }!

    // Push the pre-existing page ID onto your navigation stack
    navigationStack.append(PageEntry(id: romance.pageId, name: romance.title))
    let pageData = try await client.getPage(pageId: romance.pageId)
    renderPage(pageData)
    // docs:end
}
