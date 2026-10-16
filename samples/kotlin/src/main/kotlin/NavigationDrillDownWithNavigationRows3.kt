import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample(items: List<RowItem>) {
    // docs:start
    // User taps "Romance" in the navigation row
    val romance = items.filterIsInstance<NavigationItem>().first { it.title == "Romance" }

    // Push the pre-existing page ID onto your navigation stack
    navigationStack.add(PageEntry(id = romance.pageId, name = romance.title))
    val pageData = client.getPage(romance.pageId)
    renderPage(pageData)
    // docs:end
}
