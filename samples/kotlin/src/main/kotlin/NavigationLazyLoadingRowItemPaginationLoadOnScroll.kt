import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

// docs:start
suspend fun loadRowItemsOnScroll(pageId: String, row: Row) {
    var page = client.getRowItems(pageId, row.id)
    var items = page.items
    renderItems(items)

    // When user scrolls near the end
    observeScrollNearEnd(row) {
        val token = page.nextPageToken
        if (page.hasMore && token != null) {
            viewModelScope.launch {
                page = client.getRowItems(pageId, row.id, nextPageToken = token)
                items = items + page.items
                renderItems(items)
            }
        }
    }
}
// docs:end
