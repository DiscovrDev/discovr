// docs:start
import Discovr
// docs:end

// docs:start
func loadSeasonWithFinished(
	client: DiscovrClient,
	tvId: String,
	seasonNumber: Int
) async throws -> (SeasonDetailsResponse, SeasonState) {
	async let details = client.getSeasonDetails(mediaId: tvId, seasonNumber: seasonNumber, language: "en")
	async let state = client.getSeasonState(mediaId: tvId, seasonNumber: seasonNumber)
	return try await (details, state)
}
// docs:end
