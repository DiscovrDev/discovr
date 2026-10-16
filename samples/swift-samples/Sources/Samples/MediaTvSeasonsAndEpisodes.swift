// docs:start
import Discovr
// docs:end

// docs:start
func loadSeason(client: DiscovrClient, tvId: String, seasonNumber: Int) async throws -> SeasonDetailsResponse {
	try await client.getSeasonDetails(mediaId: tvId, seasonNumber: seasonNumber, language: "en")
}
// docs:end
