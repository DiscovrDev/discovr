import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample() {
    // docs:start
    // On tap: pass the tile so its ref is preserved
    val pageData = client.getPage(romanceItem)
    navigationStack.add(PageEntry(id = romanceItem.pageId, name = pageData.name ?: romanceItem.title))
    // docs:end
}
