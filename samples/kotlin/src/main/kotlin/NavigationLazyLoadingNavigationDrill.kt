import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

// docs:start
suspend fun drillIntoTile(tile: NavigationItem) {
    showLoadingIndicator()

    // Navigation tiles already carry their destination pageId (and ref) — no createPage needed.
    val page = client.getPage(tile)
    val rows = client.getRows(tile).rows
    renderHero(page.hero)
    renderRow(rows)

    hideLoadingIndicator()
}
// docs:end
