import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.models.Rating
// docs:end

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    // Opening a title from a row — pass the item directly so its ref is included automatically
    val details = client.getMedia(item)
    val state = client.getTitleState(item)

    // Rating, watchlist, scrobbling, and marking watched accept items too
    val updated = client.setRating(item, Rating.liked)

    // Drilling into a navigation or provider tile
    val page = client.getPage(tile)
    // docs:end
    println("$details $state $updated $page")
}
