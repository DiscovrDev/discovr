import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample(rows: List<Row>) {
    // docs:start
    val navRow = rows.first { it.type == RowType.navigation }
    val items = client.getRowItems(homePageId, navRow.id).items
    items.filterIsInstance<NavigationItem>().forEach { item ->
        println("Destination: ${item.title} → page ${item.pageId}")
    }
    // docs:end
}
