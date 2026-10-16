import api.discovr.DiscovrClient

private fun sample() {
    // docs:start
    val client = DiscovrClient(clientId = "YOUR_CLIENT_ID", storage = TokenStorage(), rememberProfile = true)
    // docs:end
    println(client)
}
