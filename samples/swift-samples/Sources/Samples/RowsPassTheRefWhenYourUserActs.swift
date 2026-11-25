import Discovr

private func sample(client: DiscovrClient) async throws {
    // docs:start
    // Opening a title from a row — pass the item directly so its ref is included automatically
    async let details = client.getMedia(item)
    async let state = client.getTitleState(item)
    let (media, titleState) = try await (details, state)

    // Rating, watchlist, scrobbling, and marking watched accept items too
    let updated = try await client.setRating(item, value: .liked)

    // Drilling into a navigation or provider tile
    let page = try await client.getPage(tile)
    // docs:end
    _ = (media, titleState, updated, page)
}
