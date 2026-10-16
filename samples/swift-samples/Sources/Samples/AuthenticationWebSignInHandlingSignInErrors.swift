#if canImport(AuthenticationServices) && !os(tvOS)
// docs:start
import AuthenticationServices
import Discovr
// docs:end

@available(iOS 13.0, macOS 10.15, *)
// docs:start
@MainActor
func handleSignInWithErrorHandling(client: DiscovrClient, presentationAnchor: ASPresentationAnchor) async {
    do {
        try await client.signInWithWebAuth(
            redirectUri: "com.example.app://auth/callback",
            presentationAnchor: presentationAnchor
        )
        print("Sign-in successful")
    } catch AuthError.cancelled {
        // They closed the sheet or pressed Cancel. Usually best answered with silence.
        print("User cancelled sign-in")
    } catch let error as AuthError {
        print("Sign-in failed: \(error)")
    } catch {
        print("Sign-in failed: \(error)")
    }
}
// docs:end
#endif
