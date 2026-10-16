import api.discovr.DiscovrClient
import api.discovr.models.ScrobbleTv

private suspend fun sample(client: DiscovrClient, mediaId: String) {
    // docs:start
    // A movie.
    client.scrobble(mediaId, 100.0)

    // One episode of a show.
    client.scrobble(mediaId, 100.0, tv = ScrobbleTv(season = 2, episode = 5))
    // docs:end
}
