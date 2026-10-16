// docs:start
import Discovr
// docs:end

// docs:start
func loadSeasonWithFinished(
	client: DiscovrClient,
	tvId: String,
	seasonNumber: Int
) async throws -> (SeasonDetailsResponse, SeasonProfileMeta) {
	async let details = client.getSeasonDetails(mediaId: tvId, seasonNumber: seasonNumber, language: "en")
	async let meta = client.getSeasonProfileMeta(mediaId: tvId, seasonNumber: seasonNumber)
	return try await (details, meta)
}
// docs:end
