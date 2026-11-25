// docs:start
import Discovr
// docs:end
import Foundation

// docs:start
@MainActor
func handleAPICallErrors() async {
    let client = await DiscovrClient(clientId: "your-client-id")

    do {
        let page = try await client.createPage()
        // Use page normally
        print(page.id)
    } catch AuthError.accessNotGranted {
        // Account is still on the waitlist — show a waitlist screen, don't retry.
        print("Your account isn't active yet.")
    } catch AuthError.legalAcceptanceRequired {
        // Account needs to accept the latest Terms before continuing.
        print("Please accept the latest Terms to continue.")
    } catch AuthError.cursorExpired {
        // A pagination token is no longer usable, typically because the
        // recommendations turned over. The page id is still good: reload the
        // page (getPage + getRows, no token) and replace what you're showing.
        restartPagination()
    } catch AuthError.rateLimited(let retryInSeconds) {
        print("Too many requests. Try again in \(retryInSeconds)s.")
    } catch ErrorResponse.error(401, _, _, _) {
        // The user is signed out. Nothing else produces a 401 any more.
        showSignInUI()
    } catch ErrorResponse.error(403, _, _, _) {
        print("Internal error. Please report this if it keeps happening.")
    } catch {
        print("Network error. Check your connection and retry.")
    }
}
// docs:end
