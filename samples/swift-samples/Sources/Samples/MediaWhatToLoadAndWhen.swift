// docs:start
import Discovr
// docs:end

// docs:start
func loadHeader(client: DiscovrClient, mediaId: String) async throws -> (MediaResponse, MediaAssetsResponse) {
	async let details = client.getMedia(mediaId: mediaId)
	async let images = client.getMediaAssets(mediaId: mediaId)
	return try await (details, images)
}
// docs:end
