// docs:start
import Discovr
// docs:end

// docs:start
func loadRails(client: DiscovrClient, pageId: String) async throws {
	let bundle = try await client.getRows(pageId: pageId, limit: 10)
	for row in bundle.rows {
		switch row.type {
		case .media, .topN:
			break
		case .navigation, .provider:
			break
		}
	}
	guard let first = bundle.rows.first else { return }
	let items = try await client.getRowItems(pageId: pageId, rowId: first.id, limit: 20)
	for item in items.items {
		switch item {
		case .typeMediaItem(let m):
			print(m.title, m.mediaType)
		case .typeNavigationItem(let n):
			print(n.title, n.pageId)
		case .typeProviderItem(let p):
			print(p.title, p.pageId)
		}
	}
}
// docs:end
