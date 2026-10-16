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
    } catch ErrorResponse.error(401, _, _, _) {
        // The user is signed out. Nothing else produces a 401 any more.
        showSignInUI()
    } catch ErrorResponse.error(409, _, _, _) {
        // A pagination token outlived its results; the page id is still good.
        restartPagination()
    } catch ErrorResponse.error(429, _, _, _) {
        // Swift only: TypeScript and Kotlin throw a typed RateLimitedError.
        print("Too many requests. Try again in a moment.")
    } catch ErrorResponse.error(403, _, _, _) {
        print("Internal error. Please report this if it keeps happening.")
    } catch {
        print("Network error. Check your connection and retry.")
    }
}
// docs:end
