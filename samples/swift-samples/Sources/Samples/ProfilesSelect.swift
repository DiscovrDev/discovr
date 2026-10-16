import Discovr

private func sample(client: DiscovrClient) async throws {
    // docs:start
    let result = try await client.getProfiles()
    // e.g. profiles named "Alice" and "Bob"

    try await client.selectProfile(profileId: result.profiles[0].id)
    // Profile active — you can start fetching
    // docs:end
}
