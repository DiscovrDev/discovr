// docs:start
import Discovr
// docs:end
import Foundation

// docs:start
func handleSignInErrors(client: DiscovrClient) async {
    do {
        _ = try await client.signInWithDeviceCode()
        // If successful, continue to selectProfile()
    } catch AuthError.clientNotFound {
        print("Invalid client ID. Check your app configuration.")
    } catch AuthError.tokenInvalid {
        print("Authentication failed. Sign in again.")
    } catch {
        print("Sign-in error: \(error)")
    }
}
// docs:end
