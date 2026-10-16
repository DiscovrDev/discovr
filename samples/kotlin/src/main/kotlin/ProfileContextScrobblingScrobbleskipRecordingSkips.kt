import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample(client: DiscovrClient, mediaId: String, from: Double, to: Double, secondsSkipped: Double) {
    // docs:start
    client.scrobbleSkip(mediaId, from, to, secondsSkipped)
    // docs:end
}
