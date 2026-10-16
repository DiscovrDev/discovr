import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	await client.selectProfile(aliceId);
	const home = await client.createPage({ name: "Home" });

	await client.selectProfile(bobId);
	const sameHome = await client.createPage({ name: "Home" });
	// sameHome.id === home.id — same page, Bob's recommendations.
	// docs:end
}
