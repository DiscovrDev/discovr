import Discovr

private func sample(client: DiscovrClient, profileId: String) async throws {
    // docs:start
    try await client.selectProfile(profileId: aliceId)
    let home = try await client.createPage(name: "Home")

    try await client.selectProfile(profileId: bobId)
    let sameHome = try await client.createPage(name: "Home")
    // Same page ID, Bob's recommendations.
    // docs:end
}
