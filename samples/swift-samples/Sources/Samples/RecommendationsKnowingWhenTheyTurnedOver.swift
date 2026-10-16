import Discovr

private func sample(client: DiscovrClient) async throws {
    // docs:start
    Task {
        for await _ in await client.recommendationChangeStream {
            markRecommendationsStale()
        }
    }
    // docs:end
}
