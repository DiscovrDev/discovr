import Discovr
import Foundation

private func sample(client: DiscovrClient) async throws {
    // docs:start
    // Create pages for each tab once, on app launch or after sign-in
    let tabs = [
        "home": try await client.createPage(),
        "movies": try await client.createPage(
            pageFilters: FilterSpec(mediaType: .movie)
        ),
        "series": try await client.createPage(
            pageFilters: FilterSpec(mediaType: .tv)
        ),
    ]

    // Later: user taps "Movies" tab
    let moviesData = try await client.getPage(pageId: tabs["movies"]!.id)
    renderPage(moviesData) // Display Movies tab rows
    // docs:end
}
