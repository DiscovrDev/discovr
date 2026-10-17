import Discovr
import Foundation

private func sample(client: DiscovrClient, pageId: String) async throws {
    // docs:start
    do {
        _ = try await client.getRows(pageId: pageId, nextPageToken: token)
    } catch ErrorResponse.error(409, _, _, _) {
        // The recommendations turned over, so this token is done. The page ID is
        // still good: reload the hero and the first rows, and replace what you
        // were showing. Don't append them to the old list.
        let page = try await client.getPage(pageId: pageId)
        let rows = try await client.getRows(pageId: pageId)
    }
    // docs:end
}
