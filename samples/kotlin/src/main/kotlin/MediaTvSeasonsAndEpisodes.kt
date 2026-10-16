import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.DiscovrClient
import api.discovr.models.SeasonDetailsResponse
// docs:end

// docs:start
suspend fun loadSeason(client: DiscovrClient, tvId: String, seasonNumber: Int) =
	client.getSeasonDetails(mediaId = tvId, seasonNumber = seasonNumber, language = "en")
// docs:end
