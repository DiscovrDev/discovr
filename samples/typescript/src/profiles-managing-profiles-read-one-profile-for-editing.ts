import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	const profile = await client.getProfile("profile_abc123xyz");
	console.log(profile.name, profile.avatarUrl);
	// docs:end
}
