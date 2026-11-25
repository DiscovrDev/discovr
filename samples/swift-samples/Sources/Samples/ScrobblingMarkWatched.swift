import Discovr
import Foundation

private func sample(client: DiscovrClient) async throws {
    // docs:start
    // A movie, or every aired episode of a show.
    let state = try await client.markWatched(item)

    // One season of a show.
    try await client.markWatched(item, season: 2)

    // One episode.
    try await client.markWatched(item, season: 2, episode: 5)
    // docs:end
    _ = state
}
