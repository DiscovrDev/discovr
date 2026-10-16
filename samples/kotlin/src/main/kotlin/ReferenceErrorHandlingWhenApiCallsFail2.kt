import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.DiscovrException
// docs:end

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    try {
        val page = client.createPage()
    } catch (e: DiscovrException) {
        when (e.statusCode) {
            401 -> showSignInUI()
            409 -> restartPagination()
            403 -> println("Internal error. Please report this if it keeps happening.")
            else -> println("Something went wrong. Try again.")
        }
    } catch (e: Exception) {
        println("Network error. Check your connection and retry.")
    }
    // docs:end
}
