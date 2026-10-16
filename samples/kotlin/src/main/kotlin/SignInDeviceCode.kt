import api.discovr.DiscovrClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

private fun selectProfile() {}

private suspend fun sample(client: DiscovrClient, scope: CoroutineScope) {
    // docs:start
    // On a TV, ask for a bigger QR code: 600-800 pixels reads well across a room.
    val result = client.signInWithDeviceCode(qrSize = 700)
    println("Scan the QR code, or go to ${result.verificationUrl} and enter ${result.userCode}")
    // Render result.qrCode in your UI

    // The SDK polls in the background and reports when sign-in finishes.
    scope.launch {
        client.authState.collect { state ->
            if (state.signedIn) {
                println("Authenticated!")
                selectProfile()
            }
        }
    }

    // Cancel polling when the user navigates away: result.cancel()
    // docs:end
}
