// docs:start
import Discovr
// docs:end

private func sample(query: String) async throws {
    // docs:start
    let client = await DiscovrClient(clientId: "your-client-id")
    let response = try await client.searchMedia(query: "blade runner")

    for result in response.results {
        print(result.id, result.mediaType.rawValue, result.title ?? result.name ?? "")
    }
    // docs:end
}
