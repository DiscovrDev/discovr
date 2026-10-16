import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
import api.discovr.DiscovrClient

private suspend fun sample(client: DiscovrClient, profileId: String) {
    // docs:start
    val profile = client.getProfile(profileId = "profile_abc123xyz")
    println("${profile.name} ${profile.avatarUrl}")
    // docs:end
}
