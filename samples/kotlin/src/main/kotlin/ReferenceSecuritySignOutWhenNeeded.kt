import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.DiscovrClient
// docs:end

// docs:start
suspend fun handleSignOut(client: DiscovrClient) {
    // When user clicks sign out
    client.signOut() // Revokes this device's refresh token

    // Clear local state, redirect to login page
    // navigateTo(LoginScreen)
}
// docs:end
