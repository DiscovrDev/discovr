import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.DiscovrClient
import api.discovr.auth.ClientNotFoundError
import api.discovr.auth.DiscovrError
import api.discovr.auth.TokenInvalidError
// docs:end

// docs:start
suspend fun handleSignInErrors(client: DiscovrClient) {
    try {
        client.signInWithDeviceCode()
        // If successful, continue to selectProfile()
    } catch (e: ClientNotFoundError) {
        // clientID is not registered — check your configuration
        println("Invalid client ID. Check your app configuration.")
    } catch (e: TokenInvalidError) {
        // The auth token was rejected
        println("Authentication failed. Sign in again.")
    } catch (e: DiscovrError) {
        // Any other typed SDK error
        println("Sign-in failed: ${e.message}")
    }
}
// docs:end
