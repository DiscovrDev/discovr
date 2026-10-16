// docs:start
import Discovr
// docs:end
import Foundation

// docs:start
func bootstrapPages() async throws {
    let client = await DiscovrClient(clientId: "your-client-id")
    let home = try await client.createPage(name: "Home")
    let movies = try await client.createPage(
        pageFilters: FilterSpec(mediaType: .movie),
        name: "Movies"
    )
    let series = try await client.createPage(
        pageFilters: FilterSpec(mediaType: .tv),
        name: "Series"
    )
    print(home.id, movies.id, series.id)
}
// docs:end
