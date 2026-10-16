import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
import api.discovr.DiscovrClient

// docs:start
suspend fun drillIntoGenre(genreFilter: FilterSpec) {
    showLoadingIndicator()

    val newPage = client.createPage(pageFilters = genreFilter)
    loadPageEfficiently(newPage.id)

    hideLoadingIndicator()
}
// docs:end
