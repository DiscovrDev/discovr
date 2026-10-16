import api.discovr.DiscovrClient

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    val page = client.createPage(name = "Home")
    val bundle = client.getRows(pageId = page.id, limit = 10)

    println("Got ${bundle.rows.size} recommendation rows:")
    bundle.rows.forEach { row -> println("  - ${row.title} (${row.type})") }
    // docs:end
}
