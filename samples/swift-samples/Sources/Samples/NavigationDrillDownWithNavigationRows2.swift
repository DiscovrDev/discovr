import Discovr
import Foundation

private func sample(client: DiscovrClient, rows: [Row]) async throws {
    // docs:start
    let navRow = rows.first(where: { $0.type == .navigation })!
    let items = try await client.getRowItems(pageId: homePageId, rowId: navRow.id).items
    for case .typeNavigationItem(let item) in items {
        print("Destination: \(item.title) → page \(item.pageId)")
    }
    // docs:end
}
