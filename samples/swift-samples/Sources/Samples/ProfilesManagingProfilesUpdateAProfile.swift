import Discovr

private func sample(client: DiscovrClient, profileId: String) async throws {
    // docs:start
    try await client.updateProfile(profileId: "profile_abc123xyz", name: "Alex R.")
    // docs:end
}
