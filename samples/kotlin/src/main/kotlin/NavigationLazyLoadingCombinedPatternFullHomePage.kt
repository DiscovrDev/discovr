import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

// docs:start
suspend fun loadHomePageEfficiently(homePageId: String) {
    // 1. Load hero
    val pageData = client.getPage(homePageId)
    renderHero(pageData.hero)

    // 2. Continue Watching from profile context
    val continueWatching = client.getPlaybackItems(limit = 10)
    renderContinueWatchingRow(continueWatching.items)

    // 3. Fetch row shells (no items yet)
    val rows = client.getRows(homePageId).rows
    val loaded = mutableSetOf<String>()

    // 4. Observe and fetch items on visibility
    rows.forEach { row ->
        observeRowVisibility(row) { isVisible ->
            if (isVisible && loaded.add(row.id)) {
                viewModelScope.launch {
                    val page = client.getRowItems(homePageId, row.id)
                    renderRow(row, page.items)
                }
            }
        }
    }
}
// docs:end
