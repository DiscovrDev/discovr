import Discovr
import Foundation

// docs:start
func goBack() async throws {
    if navigationStack.count > 1 {
        navigationStack.removeLast()
        let previous = navigationStack.last!
        let pageData = try await client.getPage(pageId: previous.id)
        renderPage(pageData)
    }
}
// docs:end
