// docs:start
import api.discovr.DiscovrClient
import api.discovr.auth.AuthStorage
// docs:end

private fun sample() {
    // docs:start
    // Where the SDK keeps the sign-in between launches.
    // On Android, back this with EncryptedSharedPreferences.
    class TokenStorage : AuthStorage {
        private val values = mutableMapOf<String, String>()
        override fun get(key: String): String? = values[key]
        override fun put(key: String, value: String?) {
            if (value == null) values.remove(key) else values[key] = value
        }
    }

    val client = DiscovrClient(clientId = "YOUR_CLIENT_ID", storage = TokenStorage())
    // docs:end
    println(client)
}
