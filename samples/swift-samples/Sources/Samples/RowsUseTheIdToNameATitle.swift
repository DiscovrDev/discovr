import Discovr
import Foundation

private func sample(client: DiscovrClient, route: TitleRoute) async throws {
    // docs:start
    // Tapping a tile: the route is named by the id and carries the ref along
    path.append(TitleRoute(id: item.id, ref: item.refOrId))

    // On the detail screen: act with the ref, name the title with the id
    let details = try await client.getMedia(mediaId: route.ref)
    try await client.addLikedItem(mediaId: route.ref)

    // Holding only a ref, like a saved "recently viewed" entry? idOf gets the id back.
    let cacheKey = idOf(savedRef)
    // docs:end
}
