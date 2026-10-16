import Discovr

private func sample(client: DiscovrClient) async throws {
    // docs:start
    var page = 1
    var results: [SearchResult] = []

    func loadMore(query: String) async throws -> Bool {
        let response = try await client.searchMedia(query: query, page: page)
        results.append(contentsOf: response.results)
        page += 1
        return response.hasMore
    }
    // docs:end
}
