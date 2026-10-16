import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import android.content.Context
import android.content.Intent
import android.net.Uri
import api.discovr.DiscovrClient
// docs:end

// docs:start
fun startWebSignIn(client: DiscovrClient, context: Context) {
    client.signInWithWebAuth("com.example.app://auth/callback") { url ->
        // Launch the URL via Custom Tabs or a plain browser Intent.
        context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
    }
}

// Call this when your redirect intent-filter receives the callback.
suspend fun finishWebSignIn(client: DiscovrClient, uri: String) {
    if (!client.handleRedirectUri(uri)) return

    // List profiles
    val profiles = client.getProfiles().profiles

    // Select first profile
    client.selectProfile(profiles.first().id)

    println("Signed in, profile active")
}
// docs:end
