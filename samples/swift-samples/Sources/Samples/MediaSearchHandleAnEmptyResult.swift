import Discovr

private func sample(client: DiscovrClient, query: String) async throws {
    // docs:start
    do {
        let response = try await client.searchMedia(query: query)

        if response.results.isEmpty && !response.hasMore {
            showEmptyState("No matches for \"\(query)\". Try a different search.")
        } else {
            render(response.results)
        }
    } catch {
        showError(error)
    }
    // docs:end
}
