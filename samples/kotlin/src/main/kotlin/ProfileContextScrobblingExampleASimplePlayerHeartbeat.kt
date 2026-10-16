import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    // When the user pauses
    suspend fun onPause(mediaId: String, progress: Double) {
        client.scrobble(mediaId, progress)
    }

    // When they skip or rewind — log the jump, then the position they landed on
    suspend fun onSkip(mediaId: String, from: Double, toProgress: Double, secondsSkipped: Double) {
        client.scrobbleSkip(mediaId, from, toProgress, secondsSkipped)
        client.scrobble(mediaId, toProgress)
    }

    // About every 30 seconds while playing
    suspend fun heartbeat(mediaId: String, progress: Double) {
        client.scrobble(mediaId, progress)
    }
    // docs:end
}
