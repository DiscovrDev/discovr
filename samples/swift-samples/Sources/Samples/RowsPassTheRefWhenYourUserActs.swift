import Discovr

private func sample(client: DiscovrClient, pageId: String, mediaId: String) async throws {
    // docs:start
    let details = try await client.getMedia(mediaId: item.refOrId)
    try await client.addLikedItem(mediaId: item.refOrId)

    let page = try await client.getPage(pageId: tile.refOrId)
    // docs:end
}
