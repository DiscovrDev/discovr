import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	await client.deleteProfile("profile_to_remove");
	// docs:end
}
