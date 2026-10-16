import Discovr

private func sample(client: DiscovrClient) async throws {
    // docs:start
    let imgs = try await client.getProfileImages()
    let avatarUrl = imgs.images[0]

    let profileId = try await client.createProfile(name: "Alex", avatarUrl: avatarUrl).profileId
    try await client.selectProfile(profileId: profileId)
    // docs:end
}
