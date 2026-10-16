import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    val tabPages = mutableMapOf<String, Page?>()

    suspend fun switchTab(tab: String) {
        val cached = tabPages[tab]
        if (cached != null) {
            renderPage(cached)
            return
        }

        val pageData = client.getPage(tabPageIds.getValue(tab))
        tabPages[tab] = pageData
        renderPage(pageData)
    }
    // docs:end
}
