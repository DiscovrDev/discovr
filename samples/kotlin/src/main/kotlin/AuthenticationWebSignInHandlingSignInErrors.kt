import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

// docs:start
suspend fun completeWebSignIn(client: DiscovrClient, uri: String) {
    try {
        if (client.handleRedirectUri(uri)) {
            println("Sign-in successful")
        } else {
            println("That link was not a sign-in return.")
        }
    } catch (e: AuthCancelledError) {
        // They closed the browser or pressed Cancel. Usually best answered with silence.
        println("User cancelled sign-in")
    } catch (e: IllegalStateException) {
        // The state check failed: this return is not one the app started.
        println("Sign-in failed: ${e.message}")
    } catch (e: DiscovrError) {
        println("Sign-in failed: ${e.message}")
    }
}
// docs:end
