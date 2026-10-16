import Discovr

private func sample(client: DiscovrClient) async throws {
    // docs:start
    let page = try await client.createPage(name: "Home")
    let bundle = try await client.getRows(pageId: page.id, limit: 10)

    print("Got \(bundle.rows.count) recommendation rows:")
    bundle.rows.forEach { row in print("  - \(row.title) (\(row.type))") }
    // docs:end
}
