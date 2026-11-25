import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    // When playback starts — send the real start position (not 0 when resuming)
    suspend fun onStart(mediaId: String, progress: Double) {
        client.scrobble(mediaId, progress)
    }

    // When the user pauses or seeks to a new position
    suspend fun onPauseOrSeek(mediaId: String, progress: Double) {
        client.scrobble(mediaId, progress)
    }

    // About every 30 seconds while playing
    suspend fun heartbeat(mediaId: String, progress: Double) {
        client.scrobble(mediaId, progress)
    }
    // docs:end
}
