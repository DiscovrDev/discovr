// docs:start
import Discovr
// docs:end

// docs:start
func loadSimilar(client: DiscovrClient, mediaId: String) async -> [SimilarResult] {
	do {
		let res = try await client.getSimilarRecommendations(mediaId: mediaId, language: "en-US", page: 1)
		return res.results
	} catch {
		return []
	}
}
// docs:end
