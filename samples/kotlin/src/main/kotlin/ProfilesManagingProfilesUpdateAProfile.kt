import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
import api.discovr.DiscovrClient

private suspend fun sample(client: DiscovrClient, profileId: String) {
    // docs:start
    client.updateProfile(profileId = "profile_abc123xyz", name = "Alex R.")
    // docs:end
}
