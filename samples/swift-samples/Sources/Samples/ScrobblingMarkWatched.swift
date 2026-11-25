import Discovr

private func sample(client: DiscovrClient, mediaId: String) async throws {
    // docs:start
    // A movie, or every aired episode of a show.
    let state = try await client.markWatched(mediaId: mediaId)

    // One season of a show.
    try await client.markWatched(mediaId: mediaId, season: 2)

    // One episode.
    try await client.markWatched(mediaId: mediaId, season: 2, episode: 5)
    // docs:end
    _ = state
}
