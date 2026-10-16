import api.discovr.DiscovrClient

private suspend fun sample(client: DiscovrClient, mediaId: String) {
    // docs:start
    // A movie, or every season of a show.
    client.markUnwatched(mediaId)

    // One season of a show.
    client.markUnwatched(mediaId, season = 2)

    // One episode.
    client.markUnwatched(mediaId, season = 2, episode = 5)
    // docs:end
}
