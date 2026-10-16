import Discovr
import Foundation

private func sample(client: DiscovrClient, home: CreatePageResponse) async throws {
    // docs:start
    let page = try await client.getPage(pageId: home.id)
    let bundle = try await client.getRows(pageId: home.id, limit: 10)
    print(page.hero.count, bundle.rows.count, bundle.hasMore)
    // docs:end
}
