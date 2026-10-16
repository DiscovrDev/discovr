import Discovr
import Foundation

private func sample(client: DiscovrClient, mediaId: String, from: Double, to: Double, secondsSkipped: Double) async throws {
    // docs:start
    try await client.scrobbleSkip(mediaId: mediaId, from: from, to: to, duration: secondsSkipped)
    // docs:end
}
