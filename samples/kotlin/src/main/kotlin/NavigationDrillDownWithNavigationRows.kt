import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample() {
    // docs:start
    val rows = client.getRows(homePageId).rows
    rows.forEach { row ->
        if (row.type == RowType.navigation) {
            println("Navigation row: ${row.title}")
        }
    }
    // docs:end
}
