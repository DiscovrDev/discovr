import Discovr
import Foundation

private func sample(client: DiscovrClient, pageId: String) async throws {
    // docs:start
    // Swift is the exception to the exception. On the session tier a 429 surfaces
    // as the generated `ErrorResponse`, not a typed error, so branch on the status
    // as you would for any other data-call failure — see the switch below.
    // Identity-tier calls (sign-in, profile selection) do throw
    // `AuthError.rateLimited(retryInSeconds:)`.
    do {
        _ = try await client.getRows(pageId: pageId)
    } catch ErrorResponse.error(429, _, let response, _) {
        let retryAfter = (response as? HTTPURLResponse)?.value(forHTTPHeaderField: "Retry-After")
        print("Slow down — try again in \(retryAfter ?? "a few")s.")
    }
    // docs:end
}
