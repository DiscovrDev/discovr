import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
import api.discovr.DiscovrClient

private suspend fun sample(client: DiscovrClient, query: String) {
    // docs:start
    try {
        val response = client.searchMedia(query = query)

        if (response.results.isEmpty() && !response.hasMore) {
            showEmptyState("No matches for \"$query\". Try a different search.")
        } else {
            render(response.results)
        }
    } catch (e: Exception) {
        showError(e)
    }
    // docs:end
}
