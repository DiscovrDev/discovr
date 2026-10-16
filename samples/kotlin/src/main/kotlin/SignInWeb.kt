import api.discovr.DiscovrClient

private fun openInCustomTab(url: String) {}

private fun sample(client: DiscovrClient) {
    // docs:start
    client.signInWithWebAuth(redirectUri = "com.example.app://auth/callback") { url ->
        // Open the sign-in page, for example in a Custom Tab. When the user finishes,
        // pass the redirect back to the SDK with client.handleRedirectUri(uri).
        openInCustomTab(url)
    }
    // docs:end
}
