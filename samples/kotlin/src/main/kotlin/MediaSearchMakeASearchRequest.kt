import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.DiscovrClient
// docs:end

private suspend fun sample(query: String) {
    // docs:start
    val client = DiscovrClient("your-client-id", storage = TokenStorage())
    val response = client.searchMedia(query = "blade runner")

    response.results.forEach { result ->
        println("${result.id} ${result.mediaType} ${result.title ?: result.name}")
    }
    // docs:end
}
