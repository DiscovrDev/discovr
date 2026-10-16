import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	await client.signInWithPopup();
	// User is now signed in. The SDK stores the credentials.
	// docs:end
}
