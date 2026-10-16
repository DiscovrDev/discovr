import api.discovr.auth.AuthStorage

/**
 * Stand-in for the storage a real app provides. The guides show the sample that
 * defines one inline; the other samples assume it exists.
 */
class TokenStorage : AuthStorage {
    private val values = mutableMapOf<String, String>()
    override fun get(key: String): String? = values[key]
    override fun put(key: String, value: String?) {
        if (value == null) values.remove(key) else values[key] = value
    }
}

// ── Stand-ins for what the guides assume an app already has ────────────────────
// Declared only so each sample compiles. The guides never show them.

lateinit var client: api.discovr.DiscovrClient

data class PageEntry(val id: String, val name: String? = null)

val navigationStack = mutableListOf<PageEntry>()
val homePageId: String = ""
val tabPageIds: Map<String, String> = emptyMap()
val savedRef: String = ""
val token: String = ""
val aliceId: String = ""
val bobId: String = ""
lateinit var item: api.discovr.models.MediaItem
lateinit var tile: api.discovr.models.NavigationItem
lateinit var romanceItem: api.discovr.models.NavigationItem
lateinit var pageFilters: api.discovr.models.FilterSpec
lateinit var response: api.discovr.models.SearchResponse

fun renderPage(vararg args: Any?) {}
fun renderHero(vararg args: Any?) {}
fun renderRow(vararg args: Any?) {}
fun renderRowError(row: api.discovr.models.Row, retry: () -> Unit) {}
fun renderItems(vararg args: Any?) {}
fun renderContinueWatchingRow(vararg args: Any?) {}
fun renderTitle(id: String? = null, title: String? = null, poster: String? = null, year: Int? = null) {}
fun renderPerson(name: String?, poster: String?) {}
fun render(vararg args: Any?) {}
fun appendItems(vararg args: Any?) {}
fun showToast(vararg args: Any?) {}
fun showError(vararg args: Any?) {}
fun showEmptyState(vararg args: Any?) {}
fun showSignInUI(vararg args: Any?) {}
fun showLoadingIndicator(vararg args: Any?) {}
fun hideLoadingIndicator(vararg args: Any?) {}
fun restartPagination(vararg args: Any?) {}
fun markRecommendationsStale(vararg args: Any?) {}
fun navigate(vararg args: Any?) {}
fun redirectTo(vararg args: Any?) {}

// Compose and coroutine-scope stand-ins, in the root package so the guides' snippets
// need no imports for them.
@Target(AnnotationTarget.FUNCTION)
annotation class Composable

object ContentScale {
    val Crop = Unit
}

object Modifier {
    fun fillMaxSize(): Modifier = this
}

fun AsyncImage(model: Any?, contentDescription: String?, contentScale: Any?, modifier: Modifier) {}

val viewModelScope: kotlinx.coroutines.CoroutineScope = kotlinx.coroutines.MainScope()
val lifecycleScope: kotlinx.coroutines.CoroutineScope = kotlinx.coroutines.MainScope()
val scope: kotlinx.coroutines.CoroutineScope = kotlinx.coroutines.MainScope()

object homeContainer {
    fun removeAllViews() {}
}

fun observeRowVisibility(row: api.discovr.models.Row, callback: (Boolean) -> Unit) {}
fun observeScrollNearEnd(row: api.discovr.models.Row, callback: () -> Unit) {}

data class TitleScreen(val id: String, val ref: String)
