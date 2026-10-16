import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

// docs:start
suspend fun runSearch(query: String) {
    val client = DiscovrClient("your-client-id", storage = TokenStorage())
    val response = client.searchMedia(query = query)

    val first = response.results.firstOrNull() ?: run {
        println("No matches — try a different search.")
        return
    }

    if (first.mediaType == SearchResult.MediaType.person) {
        // People have no detail view; open one of their credits instead.
        first.knownFor?.firstOrNull()?.let { credit ->
            val media = client.getMedia(credit.id)
            println("${first.name} → ${media.movie?.title ?: media.tv?.name}")
        }
        return
    }

    val media = client.getMedia(first.id)
    println("${media.movie?.title ?: media.tv?.name} ${(media.movie?.overview ?: media.tv?.overview)}")
}
// docs:end
