import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample(client: DiscovrClient, mediaId: String, progress: Double) {
    // docs:start
    client.scrobble(mediaId, progress, tv = ScrobbleTv(season = 1, episode = 5))
    // docs:end
}
