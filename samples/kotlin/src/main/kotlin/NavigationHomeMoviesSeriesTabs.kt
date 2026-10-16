import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    // Create pages for each tab once, on app launch or after sign-in
    val tabs = mapOf(
        "home" to client.createPage(name = "Home"),
        "movies" to client.createPage(
            pageFilters = FilterSpec(mediaType = FilterSpec.MediaType.movie),
            name = "Movies"
        ),
        "series" to client.createPage(
            pageFilters = FilterSpec(mediaType = FilterSpec.MediaType.tv),
            name = "Series"
        )
    )

    // Later: user taps "Movies" tab
    val moviesData = client.getPage(tabs["movies"]!!.id)
    renderPage(moviesData) // Display Movies tab rows
    // docs:end
}
