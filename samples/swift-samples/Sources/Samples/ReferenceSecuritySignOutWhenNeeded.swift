// docs:start
import Discovr
// docs:end

private func sample() async throws {
    // docs:start
    @MainActor
    func handleSignOut(client: DiscovrClient) async {
        // When user clicks sign out
        await client.signOut() // Revokes this device's refresh token

        // Clear local state, redirect to login page
        // navigate(to: LoginView)
    }
    // docs:end
}
