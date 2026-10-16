// docs:start
import Discovr
// docs:end
import Foundation

// docs:start
func runSearch(query: String) async throws {
    let client = await DiscovrClient(clientId: "your-client-id")
    let response = try await client.searchMedia(query: query)

    guard let first = response.results.first else {
        print("No matches — try a different search.")
        return
    }

    if first.mediaType == .person {
        // People have no detail view; open one of their credits instead.
        if let credit = first.knownFor?.first {
            let media = try await client.getMedia(mediaId: credit.id)
            print("\(first.name ?? "") → \(media.movie?.title ?? media.tv?.name ?? "")")
        }
        return
    }

    let media = try await client.getMedia(mediaId: first.id)
    print(media.movie?.title ?? media.tv?.name ?? "", media.movie?.overview ?? media.tv?.overview ?? "")
}
// docs:end
