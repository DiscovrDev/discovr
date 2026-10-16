import Discovr
import Foundation

private func sample(client: DiscovrClient) async throws {
    // docs:start
    var tabPages: [String: Page] = [:]

    func switchTab(_ tab: String) async throws {
        if let cached = tabPages[tab] {
            renderPage(cached)
            return
        }

        let pageData = try await client.getPage(pageId: tabPageIds[tab]!)
        tabPages[tab] = pageData
        renderPage(pageData)
    }
    // docs:end
}
