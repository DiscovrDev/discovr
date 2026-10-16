import Discovr
import Foundation

private func sample(client: DiscovrClient) async throws {
    // docs:start
    // On tap:
    let pageData = try await client.getPage(pageId: romanceItem.pageId)
    navigationStack.append(PageEntry(id: romanceItem.pageId, name: pageData.name ?? romanceItem.title))
    // docs:end
}
