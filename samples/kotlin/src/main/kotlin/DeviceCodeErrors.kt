import api.discovr.DiscovrClient
import api.discovr.auth.ClientNotFoundError
import api.discovr.auth.RateLimitedError

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    try {
        val result = client.signInWithDeviceCode()
        // Display result.userCode and result.qrCode to the user
        println("Code: ${result.userCode}")
    } catch (e: ClientNotFoundError) {
        println("Invalid client ID. Check your configuration.")
    } catch (e: RateLimitedError) {
        println("Too many attempts. Try again in ${e.retryInSeconds}s.")
    } catch (e: Exception) {
        println("Device code request failed: ${e.message}")
    }
    // docs:end
}
