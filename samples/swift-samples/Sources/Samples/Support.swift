import Discovr
import Foundation

// Stand-ins for what the guides assume an app already has. Declared only so each
// sample compiles; the guides never show them.

nonisolated(unsafe) var client: DiscovrClient!

struct PageEntry {
    var id: String
    var name: String?
}

nonisolated(unsafe) var navigationStack: [PageEntry] = []
let homePageId = ""
let tabPageIds: [String: String] = [:]
let savedRef = ""
let token = ""
let aliceId = ""
let bobId = ""
nonisolated(unsafe) var item: MediaItem!
nonisolated(unsafe) var tile: NavigationItem!
nonisolated(unsafe) var romanceItem: NavigationItem!
nonisolated(unsafe) var pageFilters: FilterSpec!
nonisolated(unsafe) var response: SearchResponse!

func renderPage(_ args: Any?...) {}
func renderHero(_ args: Any?...) {}
func renderRow(_ args: Any?...) {}
func renderRowError(_ row: Row, retry: @escaping () -> Void) {}
func renderItems(_ args: Any?...) {}
func renderContinueWatchingRow(_ args: Any?...) {}
func renderTitle(id: String? = nil, title: String? = nil, poster: String? = nil, year: Int? = nil) {}
func renderPerson(_ name: String?, _ poster: String?) {}
func render(_ args: Any?...) {}
func appendItems(_ args: Any?...) {}
func showToast(_ args: Any?...) {}
func showError(_ args: Any?...) {}
func showEmptyState(_ args: Any?...) {}
func showSignInUI(_ args: Any?...) {}
func showLoadingIndicator(_ args: Any?...) {}
func hideLoadingIndicator(_ args: Any?...) {}
func restartPagination(_ args: Any?...) {}
func markRecommendationsStale(_ args: Any?...) {}
func navigate(_ args: Any?...) {}
func redirectTo(_ args: Any?...) {}

struct TitleRoute {
    let id: String
    let ref: String
}

nonisolated(unsafe) var path: [TitleRoute] = []

final class Subview {
    func removeFromSuperview() {}
}

struct HomeContainerStub {
    var subviews: [Subview] = []
}

nonisolated(unsafe) var homeContainer = HomeContainerStub()

func observeScrollNearEnd(row: Row, callback: @escaping @MainActor () -> Void) {}
