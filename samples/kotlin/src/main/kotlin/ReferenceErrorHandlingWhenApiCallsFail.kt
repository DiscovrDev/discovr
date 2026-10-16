import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import api.discovr.auth.RateLimitedError
import kotlinx.coroutines.*
import api.discovr.DiscovrClient

private suspend fun sample(client: DiscovrClient, pageId: String) {
    // docs:start
    try {
        client.getRows(pageId)
    } catch (err: RateLimitedError) {
        println("Slow down — try again in ${err.retryInSeconds}s.")
    }
    // docs:end
}
