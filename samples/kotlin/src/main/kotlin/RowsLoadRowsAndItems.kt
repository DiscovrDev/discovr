import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.DiscovrClient
import api.discovr.models.RowType
// docs:end

// docs:start
suspend fun loadRailsWithItems(client: DiscovrClient, pageId: String) {
	val bundle = client.getRows(pageId = pageId, limit = 10)
	for (row in bundle.rows) {
		when (row.type) {
			RowType.media, RowType.top_n -> { /* title rail */ }
			RowType.navigation, RowType.provider -> { /* tiles / logos */ }
		}
	}
	val first = bundle.rows.firstOrNull() ?: return
	val items = client.getRowItems(pageId = pageId, rowId = first.id, limit = 20)
	for (item in items.items) {
		// Narrow each Item to MediaItem / NavigationItem / ProviderItem (your generated SDK’s union helpers)
		println(item)
	}
}
// docs:end
