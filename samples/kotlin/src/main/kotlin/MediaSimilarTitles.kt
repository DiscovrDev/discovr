import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.DiscovrClient
import api.discovr.models.SimilarResponse
// docs:end

// docs:start
suspend fun loadSimilar(client: DiscovrClient, mediaId: String): SimilarResponse? {
	return try {
		client.getSimilarRecommendations(mediaId = mediaId, language = "en-US", page = 1)
	} catch (_: Exception) {
		null
	}
}
// docs:end
