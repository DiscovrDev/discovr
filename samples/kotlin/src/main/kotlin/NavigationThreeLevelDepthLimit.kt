import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

// docs:start
fun canDrillDeeper(): Boolean = navigationStack.size < 3

// Before pushing a navigation tile onto your stack:
suspend fun drillIntoTile(client: DiscovrClient, tile: NavigationItem) {
    if (canDrillDeeper()) {
        val pageData = client.getPage(tile)
        navigationStack.add(PageEntry(id = tile.pageId, name = pageData.name ?: tile.title))
        renderPage(pageData)
    } else {
        showToast("Cannot drill deeper.")
    }
}
// docs:end
