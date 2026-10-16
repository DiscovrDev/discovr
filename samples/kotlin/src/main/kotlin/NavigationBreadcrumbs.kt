import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample() {
    // docs:start
    // navigationStack: List<PageEntry> with id and name
    val breadcrumbTrail = navigationStack.joinToString(" > ") { it.name.orEmpty() }
    // "Home > Movies > Anime"
    // docs:end
}
