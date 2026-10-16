import Discovr

private func showSignIn() async {}
private func showSessionExpired() async {}
private func showDemoEnded() async {}

private func sample(client: DiscovrClient) {
    // docs:start
    Task {
        for await state in await client.authStateStream where !state.signedIn {
            // signOutReason is nil on a fresh start with no credential.
            switch state.signOutReason {
            case .sessionExpired: await showSessionExpired()
            // .demoEnded only happens while you develop with demoMode.
            case .demoEnded: await showDemoEnded()
            default: await showSignIn()
            }
        }
    }
    // docs:end
}
