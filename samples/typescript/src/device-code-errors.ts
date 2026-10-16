// docs:start
import { ClientNotFoundError, DiscovrClient, RateLimitedError } from "discovr";
// docs:end

export async function sample(client: DiscovrClient) {
	// docs:start
	try {
		const { userCode, qrCode, unsubscribe } = await client.signInWithDeviceCode();
		// Display userCode and qrCode to the user
		console.log(userCode, qrCode, unsubscribe);
	} catch (err) {
		if (err instanceof ClientNotFoundError) {
			console.log("Invalid client ID. Check your configuration.");
		} else if (err instanceof RateLimitedError) {
			console.log(`Too many attempts. Try again in ${err.retryInSeconds}s.`);
		} else {
			console.log("Device code request failed:", err);
		}
	}
	// docs:end
}
