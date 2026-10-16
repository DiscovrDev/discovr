import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

// docs:start
suspend fun loadPageEfficiently(pageId: String) {
    // Fetch hero first
    val pageData = client.getPage(pageId)
    renderHero(pageData.hero)

    // Fetch rows
    val rows = client.getRows(pageId).rows

    // Observe each row for visibility
    rows.forEach { row ->
        observeRowVisibility(pageId, row) { isVisible ->
            if (isVisible) {
                viewModelScope.launch {
                    val items = client.getRowItems(pageId, row.id).items
                    renderRow(row, items)
                }
            }
        }
    }
}

fun observeRowVisibility(
    pageId: String,
    row: Row,
    callback: (Boolean) -> Unit
) {
    // Implementation depends on your UI framework
    // e.g., for Compose or View-based, use layout listeners
}
// docs:end
