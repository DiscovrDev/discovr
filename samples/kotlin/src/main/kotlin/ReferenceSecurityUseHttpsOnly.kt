import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
import api.discovr.DiscovrClient

private suspend fun sample() {
    // docs:start
    // Good: HTTPS redirect
    val redirectUri = "https://myapp.com/auth/callback"

    // Good: localhost development (emulator)
    val devRedirectUri = "http://10.0.2.2:8000/auth/callback"

    // Bad: HTTP production
    // val redirectUri = "http://myapp.com/auth/callback" // ❌ Don't do this
    // docs:end
}
