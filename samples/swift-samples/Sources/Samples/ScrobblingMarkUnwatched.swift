import Discovr

private func sample(client: DiscovrClient, mediaId: String) async throws {
    // docs:start
    // A movie, or every season of a show.
    try await client.markUnwatched(mediaId: mediaId)

    // One season of a show.
    try await client.markUnwatched(mediaId: mediaId, season: 2)

    // One episode.
    try await client.markUnwatched(mediaId: mediaId, season: 2, episode: 5)
    // docs:end
}
