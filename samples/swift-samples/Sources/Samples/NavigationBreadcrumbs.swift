import Discovr
import Foundation

private func sample() async throws {
    // docs:start
    // navigationStack: [PageEntry] with id and name
    let breadcrumbTrail = navigationStack.compactMap { $0.name }.joined(separator: " > ")
    // "Home > Movies > Anime"
    // docs:end
}
