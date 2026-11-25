import {
	AccessNotGrantedError,
	CursorExpiredError,
	DiscovrClient,
	LegalAcceptanceRequiredError,
} from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	// Ordinary HTTP failures carry the response. Narrow it before reading the status.
	function httpStatus(err: unknown): number | undefined {
		const res = (err as { response?: { status?: number } }).response;
		return typeof res?.status === "number" ? res.status : undefined;
	}

	try {
		const page = await client.createPage();
		// Use page normally
	} catch (err) {
		if (err instanceof AccessNotGrantedError) {
			// Account is still on the waitlist — show a waitlist screen, don't retry.
			console.log("Your account isn't active yet.");
			return;
		}
		if (err instanceof LegalAcceptanceRequiredError) {
			console.log("Please accept the latest Terms to continue.");
			return;
		}
		if (err instanceof CursorExpiredError) {
			// A pagination token is no longer usable, typically because the
			// recommendations turned over. The page id is still good: reload the
			// page (getPage + getRows, no token) and replace what you're showing.
			await restartPagination();
			return;
		}
		switch (httpStatus(err)) {
			case 401:
				// The user is signed out. Nothing else produces a 401 any more.
				await showSignInUI();
				break;
			case 403:
				// The SDK sent the wrong kind of credential — a bug, not a user problem.
				console.log("Internal error. Please report this if it keeps happening.");
				break;
			case undefined:
				// Never reached Discovr.
				console.log("Network error. Check your connection and retry.");
				break;
			default:
				console.log("Something went wrong. Try again.");
		}
	}
	// docs:end
}
