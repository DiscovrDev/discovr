import Discovr
import Foundation

private func sample(client: DiscovrClient, profileId: String) async throws {
    // docs:start
    let list = try await client.getProfiles()
    guard let chosen = list.profiles.first else { fatalError("No profiles—create one first") }

    try await client.selectProfile(profileId: chosen.id)

    guard await client.hasActiveProfile else { throw NSError(domain: "", code: 1) }
    let page = try await client.createPage()
    // docs:end
}
