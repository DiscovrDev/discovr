import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.DiscovrClient
import api.discovr.models.FilterSpec
// docs:end

// docs:start
suspend fun bootstrapPages(client: DiscovrClient) {
    val home = client.createPage(name = "Home")
    val movies = client.createPage(
        pageFilters = FilterSpec(mediaType = FilterSpec.MediaType.movie),
        name = "Movies"
    )
    val series = client.createPage(
        pageFilters = FilterSpec(mediaType = FilterSpec.MediaType.tv),
        name = "Series"
    )
    println("$home $movies $series")
}
// docs:end
