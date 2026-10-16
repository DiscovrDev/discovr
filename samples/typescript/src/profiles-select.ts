import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	const { profiles } = await client.getProfiles();
	// e.g. [{ id: "prof_abc", name: "Alice" }, { id: "prof_def", name: "Bob" }]

	await client.selectProfile(profiles[0].id);
	// Profile active — you can start fetching
	// docs:end
}
