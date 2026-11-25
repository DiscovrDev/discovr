import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

// docs:start
suspend fun loadRowItemsOnScroll(pageId: String, row: Row) {
    // Fetch the first page of items (keep limit around 10 — every returned item counts as served)
    var page = client.getRowItems(pageId, row.id, limit = 10)
    var items = page.items
    renderItems(items)

    // When user scrolls near the end
    observeScrollNearEnd(row) {
        val token = page.nextPageToken
        if (page.hasMore && token != null) {
            viewModelScope.launch {
                page = client.getRowItems(pageId, row.id, nextPageToken = token, limit = 10)
                items = items + page.items
                renderItems(items)
            }
        }
    }
}
// docs:end
