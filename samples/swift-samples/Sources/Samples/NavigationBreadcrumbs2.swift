import Discovr
import Foundation

private func sample(client: DiscovrClient) async throws {
    // docs:start
    // On tap: pass the tile so its ref is preserved
    let pageData = try await client.getPage(romanceItem)
    navigationStack.append(PageEntry(id: romanceItem.pageId, name: pageData.name ?? romanceItem.title))
    // docs:end
}
