import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
import api.discovr.DiscovrClient

private suspend fun sample() {
    // docs:start
    // In your Image composable (Jetpack Compose)
    @Composable
    fun MediaItemImage(posterPath: Map<String, String>) {
        AsyncImage(
            model = posterPath["w185"], // Pick the size you need — see the Tip below
            contentDescription = "Media poster",
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )
    }

    // Compose handles lazy loading automatically for
    // images in scrollable lists
    // docs:end
}
