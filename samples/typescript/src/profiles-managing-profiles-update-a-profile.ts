import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	await client.updateProfile("profile_abc123xyz", {
		name: "Alex R.",
	});
	// docs:end
}
