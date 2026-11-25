import Discovr
import Foundation

private func sample(client: DiscovrClient) async throws {
    // docs:start
    // A movie, or every season of a show.
    let state = try await client.markUnwatched(item)

    // One season of a show.
    try await client.markUnwatched(item, season: 2)

    // One episode.
    try await client.markUnwatched(item, season: 2, episode: 5)
    // docs:end
    _ = state
}
