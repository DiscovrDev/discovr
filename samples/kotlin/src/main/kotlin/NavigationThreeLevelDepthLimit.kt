import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

// docs:start
fun canDrillDeeper(): Boolean = navigationStack.size < 3

// Before creating a new page on navigation tap:
suspend fun drillDeeper(client: DiscovrClient, pageFilters: FilterSpec) {
    if (canDrillDeeper()) {
        val newPage = client.createPage(pageFilters = pageFilters)
        navigationStack.add(PageEntry(id = newPage.id))
    } else {
        showToast("Cannot drill deeper.")
    }
}
// docs:end
