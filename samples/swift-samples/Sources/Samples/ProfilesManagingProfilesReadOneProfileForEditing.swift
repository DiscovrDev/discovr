import Discovr

private func sample(client: DiscovrClient, profileId: String) async throws {
    // docs:start
    let profile = try await client.getProfile(profileId: "profile_abc123xyz")
    print(profile.name, profile.avatarUrl)
    // docs:end
}
