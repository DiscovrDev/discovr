import Discovr
import Foundation

private func sample(client: DiscovrClient, mediaId: String, progress: Double) async throws {
    // docs:start
    try await client.scrobble(mediaId: mediaId, progress: progress)
    // docs:end
}
