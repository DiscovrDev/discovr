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
    } catch (_: AccessNotGrantedError) {
        println("Your account isn't active yet.")
    } catch (_: LegalAcceptanceRequiredError) {
        println("Please accept the latest Terms to continue.")
    } catch (_: CursorExpiredError) {
        restartPagination()
    } catch (e: DiscovrException) {
        when (e.statusCode) {
            401 -> showSignInUI()
            403 -> println("Internal error. Please report this if it keeps happening.")
            else -> println("Something went wrong. Try again.")
        }
    } catch (e: Exception) {
        println("Network error. Check your connection and retry.")
    }
    // docs:end
}
