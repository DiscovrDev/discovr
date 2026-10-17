import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
import api.discovr.DiscovrClient

private suspend fun sample(client: DiscovrClient, pageId: String) {
    // docs:start
    try {
        client.getRows(pageId, nextPageToken = token)
    } catch (err: DiscovrException) {
        if (err.statusCode != 409) throw err
        // The recommendations turned over, so this token is done. The page ID is
        // still good: reload the hero and the first rows, and replace what you
        // were showing. Don't append them to the old list.
        val page = client.getPage(pageId)
        val rows = client.getRows(pageId)
    }
    // docs:end
}
