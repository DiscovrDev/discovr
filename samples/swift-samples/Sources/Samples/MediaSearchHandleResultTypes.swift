import Discovr

private func sample() async throws {
    // docs:start
    for result in response.results {
        if result.mediaType == .person {
            renderPerson(result.name, result.profilePath?["w185"])
            continue
        }

        renderTitle(
            id: result.id,
            title: result.title ?? result.name,
            poster: result.posterPath?["w185"]
        )
    }
    // docs:end
}
