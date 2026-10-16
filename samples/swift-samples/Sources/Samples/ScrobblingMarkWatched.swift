import Discovr

private func sample(client: DiscovrClient, mediaId: String) async throws {
    // docs:start
    // A movie.
    try await client.scrobble(mediaId: mediaId, progress: 100)

    // One episode of a show.
    try await client.scrobble(
        mediaId: mediaId,
        progress: 100,
        tv: ScrobbleTv(season: 2, episode: 5)
    )
    // docs:end
}
