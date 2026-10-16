import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
import api.discovr.DiscovrClient

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    var page = 1
    val results = mutableListOf<SearchResult>()

    suspend fun loadMore(query: String): Boolean {
        val response = client.searchMedia(query = query, page = page)
        results += response.results
        page += 1
        return response.hasMore
    }
    // docs:end
}
