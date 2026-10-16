import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	await client.signOut();
	// docs:end
}
