import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.refOrId
// docs:end

private suspend fun sample(client: DiscovrClient, pageId: String, mediaId: String) {
    // docs:start
    val details = client.getMedia(mediaId = item.refOrId())
    client.addLikedItem(mediaId = item.refOrId())

    val page = client.getPage(pageId = tile.refOrId())
    // docs:end
}
