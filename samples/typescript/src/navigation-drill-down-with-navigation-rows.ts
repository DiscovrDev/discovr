import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	const { rows } = await client.getRows(homePageId);
	rows.forEach((row) => {
		if (row.type === "navigation") {
			console.log(`Navigation row: ${row.title}`);
		}
	});
	// docs:end
}
