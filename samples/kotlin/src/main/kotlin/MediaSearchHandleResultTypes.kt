import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample() {
    // docs:start
    for (result in response.results) {
        if (result.mediaType == SearchResult.MediaType.person) {
            renderPerson(result.name, result.profilePath?.get("w185"))
            continue
        }

        renderTitle(
            id = result.id,
            title = result.title ?: result.name,
            poster = result.posterPath?.get("w185"),
        )
    }
    // docs:end
}
