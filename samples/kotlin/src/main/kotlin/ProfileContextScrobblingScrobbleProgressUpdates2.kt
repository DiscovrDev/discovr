import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    val ep5 = client.trackPlayback(
        item,
        tv = EpisodeRef(season = 1, episode = 5),
        onCompleted = { res -> println("Completed seasons: ${res.completedSeasons}") },
    )
    ep5.start(0.0)
    ep5.finish()

    // Next-episode autoplay: wait for ep5's final scrobble before ep6's start lands.
    val ep6 = client.trackPlayback(
        item,
        tv = EpisodeRef(season = 1, episode = 6),
        after = ep5,
    )
    ep6.start(0.0)
    // docs:end
}
