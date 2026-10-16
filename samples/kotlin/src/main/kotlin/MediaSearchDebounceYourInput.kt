import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    var searchJob: Job? = null

    fun onQueryChanged(query: String) {
        searchJob?.cancel()
        if (query.trim().length < 2) return

        searchJob = scope.launch {
            delay(350)
            render(client.searchMedia(query = query.trim()).results)
        }
    }
    // docs:end
}
