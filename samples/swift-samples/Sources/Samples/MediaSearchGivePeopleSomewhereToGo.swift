import Discovr

private func sample() async throws {
    // docs:start
    let people = response.results.filter { $0.mediaType == .person }
    let titles = response.results.filter { $0.mediaType != .person }

    func onPersonTapped(_ person: SearchResult) {
        for credit in person.knownFor ?? [] {
            renderTitle(
                id: credit.id,
                title: credit.title ?? credit.name,
                poster: credit.posterPath?["w185"]
            )
        }
    }
    // docs:end
}
