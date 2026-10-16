import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.idOf
import api.discovr.refOrId
// docs:end

private suspend fun sample(client: DiscovrClient, mediaId: String) {
    // docs:start
    // Tapping a tile: the screen is named by the id and carries the ref along
    val screen = TitleScreen(id = item.id, ref = item.refOrId())

    // On the detail screen: act with the ref, name the title with the id
    val details = client.getMedia(mediaId = screen.ref)
    client.addLikedItem(mediaId = screen.ref)

    // Holding only a ref, like a saved "recently viewed" entry? idOf gets the id back.
    val cacheKey = idOf(savedRef)
    // docs:end
}
