import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.DiscovrClient
import api.discovr.models.MediaAssetsResponse
import api.discovr.models.MediaResponse
// docs:end

// docs:start
suspend fun loadHeader(client: DiscovrClient, mediaId: String): Pair<MediaResponse, MediaAssetsResponse> {
	// Parallelize with async/await if you use coroutines — shown sequential for clarity.
	val details = client.getMedia(mediaId = mediaId)
	val images = client.getMediaAssets(mediaId = mediaId)
	return details to images
}
// docs:end
