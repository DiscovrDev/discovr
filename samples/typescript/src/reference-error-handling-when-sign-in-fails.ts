// docs:start
import { DiscovrError, ClientNotFoundError, TokenInvalidError } from "discovr";
// docs:end
import type { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	try {
		await client.signInWithDeviceCode();
		// If successful, continue to selectProfile()
	} catch (err) {
		if (err instanceof ClientNotFoundError) {
			// clientID is not registered — check your configuration
			console.log("Invalid client ID. Check your app configuration.");
		} else if (err instanceof TokenInvalidError) {
			// The auth token was rejected
			console.log("Authentication failed. Sign in again.");
		} else if (err instanceof DiscovrError) {
			// Any other typed SDK error
			console.log("Sign-in failed:", err.code, err.message);
		} else {
			console.log("Unexpected error:", (err as Error).message);
		}
	}
	// docs:end
}
