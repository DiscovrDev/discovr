import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample() {
    // docs:start
    val homePageData = client.getPage(homePageId)
    val continueWatching = client.getPlaybackItems().items // Playback list = Continue Watching

    // Render hero, then Continue Watching row, then recommendation rows
    // docs:end
}
