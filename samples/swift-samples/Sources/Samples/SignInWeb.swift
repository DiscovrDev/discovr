#if canImport(AuthenticationServices) && !os(tvOS)
import AuthenticationServices
import Discovr

@available(iOS 13.0, macOS 10.15, *)
private func sample(client: DiscovrClient, window: ASPresentationAnchor) async throws {
    // docs:start
    try await client.signInWithWebAuth(
        redirectUri: "com.example.app://auth/callback",
        presentationAnchor: window
    )
    // User is now signed in. The SDK stores the credentials.
    // docs:end
}
#endif
