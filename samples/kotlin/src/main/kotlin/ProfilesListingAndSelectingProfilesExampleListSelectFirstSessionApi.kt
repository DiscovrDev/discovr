import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
import api.discovr.DiscovrClient

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    val profiles = client.getProfiles().profiles
    val chosen = profiles.first() // replace with user's selection

    client.selectProfile(chosen.id)

    if (!client.hasActiveProfile) error("No profile selected yet")
    val page = client.createPage()
    // docs:end
}
