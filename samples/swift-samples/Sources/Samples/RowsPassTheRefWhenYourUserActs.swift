import Discovr

private func sample(client: DiscovrClient, pageId: String, mediaId: String) async throws {
    // docs:start
    let details = try await client.getMedia(mediaId: item.refOrId)
    let state = try await client.setRating(mediaId: item.refOrId, value: .liked)

    let page = try await client.getPage(pageId: tile.refOrId)
    // docs:end
    _ = (details, state, page)
}
