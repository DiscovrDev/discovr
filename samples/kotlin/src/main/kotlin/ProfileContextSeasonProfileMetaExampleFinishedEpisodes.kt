import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.DiscovrClient
import api.discovr.models.SeasonDetailsResponse
import api.discovr.models.SeasonProfileMeta
// docs:end

// docs:start
suspend fun loadSeasonWithFinished(
	client: DiscovrClient,
	tvId: String,
	seasonNumber: Int
): Pair<SeasonDetailsResponse, SeasonProfileMeta> {
	val details = client.getSeasonDetails(mediaId = tvId, seasonNumber = seasonNumber, language = "en")
	val meta = client.getSeasonProfileMeta(mediaId = tvId, seasonNumber = seasonNumber)
	return details to meta
}
// docs:end
