import Discovr
import Foundation

private func sample(client: DiscovrClient, pageId: String) async throws {
    // docs:start
    do {
        _ = try await client.getRows(pageId: pageId)
    } catch AuthError.rateLimited(let retryInSeconds) {
        print("Slow down — try again in \(retryInSeconds)s.")
    }
    // docs:end
}
