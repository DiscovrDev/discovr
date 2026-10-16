import Discovr

private func sample(client: DiscovrClient, profileId: String) async throws {
    // docs:start
    try await client.deleteProfile(profileId: "profile_to_remove")
    // docs:end
}
