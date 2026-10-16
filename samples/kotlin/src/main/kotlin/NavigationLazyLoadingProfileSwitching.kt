import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
import api.discovr.DiscovrClient

// docs:start
suspend fun switchProfile(newProfileId: String) {
    // Clear old content
    homeContainer.removeAllViews()

    // Select new profile
    client.selectProfile(newProfileId)

    // Load new home
    val newHome = client.createPage(name = "Home")
    loadHomePageEfficiently(newHome.id)
}
// docs:end
