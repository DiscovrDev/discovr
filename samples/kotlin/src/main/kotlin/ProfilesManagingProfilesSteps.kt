import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
import api.discovr.DiscovrClient

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    val images = client.getProfileImages().images
    val avatarUrl = images.first()

    val profileId = client.createProfile(name = "Alex", avatarUrl = avatarUrl).profileId
    client.selectProfile(profileId)
    // docs:end
}
