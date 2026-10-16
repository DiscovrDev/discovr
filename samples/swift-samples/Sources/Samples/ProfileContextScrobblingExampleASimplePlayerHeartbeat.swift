import Discovr
import Foundation

private func sample(client: DiscovrClient) async throws {
    // docs:start
    // When the user pauses
    func onPause(mediaId: String, progress: Double) async throws {
        try await client.scrobble(mediaId: mediaId, progress: progress)
    }

    // When they skip or rewind — log the jump, then the position they landed on
    func onSkip(mediaId: String, from: Double, toProgress: Double, secondsSkipped: Double) async throws {
        try await client.scrobbleSkip(mediaId: mediaId, from: from, to: toProgress, duration: secondsSkipped)
        try await client.scrobble(mediaId: mediaId, progress: toProgress)
    }

    // About every 30 seconds while playing
    func heartbeat(mediaId: String, progress: Double) async throws {
        try await client.scrobble(mediaId: mediaId, progress: progress)
    }
    // docs:end
}
