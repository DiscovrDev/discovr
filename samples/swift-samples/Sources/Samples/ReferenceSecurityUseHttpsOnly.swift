import Discovr

private func sample() async throws {
    // docs:start
    // Good: HTTPS redirect
    let redirectUri = "https://myapp.com/auth/callback"

    // Good: localhost development
    let devRedirectUri = "http://localhost:3000/auth/callback"

    // Bad: HTTP production
    // let redirectUri = "http://myapp.com/auth/callback" // ❌ Don't do this
    // docs:end
}
