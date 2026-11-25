import Discovr
import Foundation

private func sample(client: DiscovrClient) async throws {
    // docs:start
    // When playback starts — send the real start position (not 0 when resuming)
    func onStart(mediaId: String, progress: Double) async throws {
        try await client.scrobble(mediaId: mediaId, progress: progress)
    }

    // When the user pauses or seeks to a new position
    func onPauseOrSeek(mediaId: String, progress: Double) async throws {
        try await client.scrobble(mediaId: mediaId, progress: progress)
    }

    // About every 30 seconds while playing
    func heartbeat(mediaId: String, progress: Double) async throws {
        try await client.scrobble(mediaId: mediaId, progress: progress)
    }
    // docs:end
}
