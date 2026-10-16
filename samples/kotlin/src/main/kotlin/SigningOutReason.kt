import api.discovr.DiscovrClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

// docs:start
import api.discovr.auth.SignOutReason
// docs:end

private fun showSignIn() {}
private fun showSessionExpired() {}
private fun showDemoEnded() {}

private fun sample(client: DiscovrClient, scope: CoroutineScope) {
    // docs:start
    // scope is your lifecycle scope, for example lifecycleScope on Android.
    scope.launch {
        client.authState.collect { state ->
            if (state.signedIn) return@collect
            // signOutReason is null on a fresh start with no credential.
            when (state.signOutReason) {
                SignOutReason.SESSION_EXPIRED -> showSessionExpired()
                // DEMO_ENDED only happens while you develop with demoMode.
                SignOutReason.DEMO_ENDED -> showDemoEnded()
                else -> showSignIn()
            }
        }
    }
    // docs:end
}
