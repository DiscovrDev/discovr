import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample() {
    // docs:start
    val people = response.results.filter { it.mediaType == SearchResult.MediaType.person }
    val titles = response.results.filter { it.mediaType != SearchResult.MediaType.person }

    fun onPersonTapped(person: SearchResult) {
        // Their credits open exactly like any other title.
        person.knownFor.orEmpty().forEach { credit ->
            renderTitle(
                id = credit.id, // already MV_ / TV_ prefixed
                title = credit.title ?: credit.name,
                poster = credit.posterPath?.get("w185"),
            )
        }
    }
    // docs:end
}
