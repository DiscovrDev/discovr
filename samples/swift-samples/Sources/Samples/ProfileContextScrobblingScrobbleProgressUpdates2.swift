import Discovr
import Foundation

private func sample(client: DiscovrClient, mediaId: String, progress: Double) async throws {
    // docs:start
    try await client.scrobble(
        mediaId: mediaId,
        progress: progress,
        tv: ScrobbleTv(season: 1, episode: 5)
    )
    // docs:end
}
