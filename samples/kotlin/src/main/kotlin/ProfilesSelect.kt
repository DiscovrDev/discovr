import api.discovr.DiscovrClient

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    val result = client.getProfiles()
    // e.g. profiles named "Alice" and "Bob"

    client.selectProfile(result.profiles.first().id)
    // Profile active — you can start fetching
    // docs:end
}
