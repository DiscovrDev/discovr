import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	await client.selectProfile(aliceId);
	const home = await client.createPage();

	await client.selectProfile(bobId);
	const sameHome = await client.createPage();
	// sameHome.id === home.id — same page, Bob's recommendations.
	// docs:end
}
