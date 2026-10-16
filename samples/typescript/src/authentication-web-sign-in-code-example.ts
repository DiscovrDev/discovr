// docs:start
import { DiscovrClient } from "discovr";
// docs:end

export async function sample() {
	// docs:start
	const client = new DiscovrClient("your-client-id");

	// Sign in with popup (web) or redirect
	await client.signInWithPopup();

	// List profiles and pick one
	const { profiles } = await client.getProfiles();
	await client.selectProfile(profiles[0].id);

	// Ready to call API
	const page = await client.createPage();
	console.log("Ready — created page:", page.id);
	// docs:end
}
