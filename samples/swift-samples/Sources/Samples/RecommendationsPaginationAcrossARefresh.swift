import Discovr
import Foundation

private func sample(client: DiscovrClient, pageId: String) async throws -> GetRowsResponse {
    // docs:start
    do {
        return try await client.getRows(pageId: pageId, nextPageToken: token)
    } catch ErrorResponse.error(409, _, _, _) {
        // The page is fine — only our position in it expired.
        return try await client.getRows(pageId: pageId)
    }
    // docs:end
}
