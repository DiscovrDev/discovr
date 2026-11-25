import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    // A movie, or every season of a show.
    val state = client.markUnwatched(item)

    // One season of a show.
    client.markUnwatched(item, season = 2)

    // One episode.
    client.markUnwatched(item, season = 2, episode = 5)
    // docs:end
    println(state)
}
