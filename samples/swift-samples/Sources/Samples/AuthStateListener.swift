import Discovr

private func showSignIn() async {}
private func showProfilePicker() async {}
private func showBrowse() async {}

private func sample(client: DiscovrClient) {
    // docs:start
    Task {
        for await state in await client.authStateStream {
            if !state.signedIn {
                await showSignIn()
            } else if state.profileId == nil {
                await showProfilePicker()
            } else {
                await showBrowse()
            }
        }
    }
    // docs:end
}
