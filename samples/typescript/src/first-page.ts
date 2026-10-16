import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	const page = await client.createPage({ name: "Home" });
	const { rows } = await client.getRows(page.id, { limit: 10 });

	console.log(`Got ${rows.length} recommendation rows:`);
	rows.forEach((row) => console.log(`  - ${row.title} (${row.type})`));
	// docs:end
}
