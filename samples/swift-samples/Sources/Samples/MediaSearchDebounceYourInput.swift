import Discovr
import Foundation

private func sample(client: DiscovrClient) async throws {
    // docs:start
    var searchTask: Task<Void, Never>?

    func onQueryChanged(_ query: String) {
        searchTask?.cancel()
        let trimmed = query.trimmingCharacters(in: .whitespaces)
        guard trimmed.count >= 2 else { return }

        searchTask = Task {
            try? await Task.sleep(for: .milliseconds(350))
            guard !Task.isCancelled else { return }
            let response = try? await client.searchMedia(query: trimmed)
            render(response?.results ?? [])
        }
    }
    // docs:end
}
