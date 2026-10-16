import Discovr
import Foundation

// docs:start
func switchProfile(newProfileId: String) async throws {
    // Clear old content
    homeContainer.subviews.forEach { $0.removeFromSuperview() }

    // Select new profile
    try await client.selectProfile(profileId: newProfileId)

    // Load new home
    let newHome = try await client.createPage(name: "Home")
    try await loadHomePageEfficiently(homePageId: newHome.id)
}
// docs:end
