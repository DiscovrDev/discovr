import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
import api.discovr.DiscovrClient

// docs:start
suspend fun goBack() {
    if (navigationStack.size > 1) {
        navigationStack.removeAt(navigationStack.size - 1)
        val previous = navigationStack.last()
        val pageData = client.getPage(previous.id)
        renderPage(pageData)
    }
}
// docs:end
