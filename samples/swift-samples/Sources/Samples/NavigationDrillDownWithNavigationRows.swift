import Discovr
import Foundation

private func sample(client: DiscovrClient) async throws {
    // docs:start
    let rows = try await client.getRows(pageId: homePageId).rows
    for row in rows where row.type == .navigation {
        print("Navigation row: \(row.title)")
    }
    // docs:end
}
