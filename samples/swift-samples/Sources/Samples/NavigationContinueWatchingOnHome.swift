import Discovr
import Foundation

private func sample(client: DiscovrClient) async throws {
    // docs:start
    async let homePageData = client.getPage(pageId: homePageId)
    async let playback = client.getPlaybackItems()

    let pageData = try await homePageData
    let continueWatching = try await playback.items // Playback list = Continue Watching

    // Render hero, Continue Watching, then rows
    print(pageData.hero.count, continueWatching.count)
    // docs:end
}
