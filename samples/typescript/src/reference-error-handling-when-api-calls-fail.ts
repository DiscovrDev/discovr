// docs:start
import { RateLimitedError } from "discovr";
// docs:end
import type { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient, pageId: string) {
	// docs:start
	try {
		await client.getRows(pageId);
	} catch (err) {
		if (err instanceof RateLimitedError) {
			// Seconds until the window rolls over, from the server. Capped at 5 minutes.
			console.log(`Slow down — try again in ${err.retryInSeconds}s.`);
			return;
		}
		throw err;
	}
	// docs:end
}
