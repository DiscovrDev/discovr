import api.discovr.DiscovrClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

private fun showSignIn() {}
private fun showProfilePicker() {}
private fun showBrowse() {}

private fun sample(client: DiscovrClient, scope: CoroutineScope) {
    // docs:start
    // scope is your lifecycle scope, for example lifecycleScope on Android.
    scope.launch {
        client.authState.collect { state ->
            when {
                !state.signedIn -> showSignIn()
                state.profileId == null -> showProfilePicker()
                else -> showBrowse()
            }
        }
    }
    // docs:end
}
