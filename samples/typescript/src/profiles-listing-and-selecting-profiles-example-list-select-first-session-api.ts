import { DiscovrClient } from "discovr";

export async function sample() {
	// docs:start
	const client = new DiscovrClient("your-client-id");

	const { profiles } = await client.getProfiles();
	const chosen = profiles[0]; // replace with tile the user tapped

	await client.selectProfile(chosen.id);

	if (!client.hasActiveProfile()) throw new Error("No profile selected yet");
	const page = await client.createPage();
	// docs:end
}
