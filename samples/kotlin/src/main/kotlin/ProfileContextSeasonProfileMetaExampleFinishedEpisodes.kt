import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.DiscovrClient
import api.discovr.models.SeasonDetailsResponse
import api.discovr.models.SeasonState
// docs:end

// docs:start
suspend fun loadSeasonWithFinished(
	client: DiscovrClient,
	tvId: String,
	seasonNumber: Int
): Pair<SeasonDetailsResponse, SeasonState> {
	val details = client.getSeasonDetails(mediaId = tvId, seasonNumber = seasonNumber, language = "en")
	val state = client.getSeasonState(mediaId = tvId, seasonNumber = seasonNumber)
	return details to state
}
// docs:end
