import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
import api.discovr.DiscovrClient

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    client.selectProfile(aliceId)
    val home = client.createPage(name = "Home")

    client.selectProfile(bobId)
    val sameHome = client.createPage(name = "Home")
    // Same page ID, Bob's recommendations.
    // docs:end
}
