import api.discovr.DiscovrClient
import api.discovr.auth.AuthCancelledError
import api.discovr.auth.DeviceCodeDeniedError
import api.discovr.auth.DeviceCodeExpiredError

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    val result = client.signInWithDeviceCode()

    try {
        // Completes when the flow ends. Returns once the person approves on their phone.
        result.completion.await()
        println("Signed in.")
    } catch (e: DeviceCodeDeniedError) {
        println("They declined on their phone. Say so, and offer a new code.")
    } catch (e: DeviceCodeExpiredError) {
        println("The code ran out. Show a fresh one.")
    } catch (e: AuthCancelledError) {
        println("You stopped the flow with cancel(). Nothing to show.")
    }
    // docs:end
}
