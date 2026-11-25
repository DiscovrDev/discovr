import api.discovr.DiscovrClient

private suspend fun sample(client: DiscovrClient, mediaId: String) {
    // docs:start
    // A movie, or every aired episode of a show.
    val state = client.markWatched(mediaId)

    // One season of a show.
    client.markWatched(mediaId, season = 2)

    // One episode.
    client.markWatched(mediaId, season = 2, episode = 5)
    // docs:end
}
