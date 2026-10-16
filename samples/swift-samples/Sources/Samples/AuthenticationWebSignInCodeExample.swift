#if canImport(AuthenticationServices) && !os(tvOS)
// docs:start
import AuthenticationServices
import Discovr
// docs:end

@available(iOS 13.0, macOS 10.15, *)
// docs:start
@MainActor
func signInWithWeb(client: DiscovrClient, presentationAnchor: ASPresentationAnchor) async {
    do {
        try await client.signInWithWebAuth(
            redirectUri: "com.example.app://auth/callback",
            presentationAnchor: presentationAnchor
        )

        // List profiles
        let profiles = try await client.getProfiles()

        // Select first profile
        try await client.selectProfile(profileId: profiles.profiles[0].id)

        print("Signed in, profile active")
    } catch {
        print("Sign-in failed: \(error)")
    }
}
// docs:end
#endif
