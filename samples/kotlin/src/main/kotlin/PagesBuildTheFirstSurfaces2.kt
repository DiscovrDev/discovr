import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
import api.discovr.DiscovrClient

// docs:start
suspend fun loadHomeRows(client: DiscovrClient, homeId: String) {
	val page = client.getPage(pageId = homeId)
	val bundle = client.getRows(pageId = homeId, limit = 10)
	println("${page.hero.size} ${bundle.rows.size} ${bundle.hasMore}")
}
// docs:end
