import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

// docs:start
suspend fun loadRowItemsWithErrorHandling(pageId: String, row: Row) {
    try {
        val items = client.getRowItems(pageId, row.id).items
        renderRow(row, items)
    } catch (err: Exception) {
        // Offer a retry that runs the same load again
        renderRowError(row) {
            viewModelScope.launch {
                loadRowItemsWithErrorHandling(pageId, row)
            }
        }
    }
}
// docs:end
