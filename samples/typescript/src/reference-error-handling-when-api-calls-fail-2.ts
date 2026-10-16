import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	// Data-call failures carry the HTTP response. Narrow it before reading the status.
	function httpStatus(err: unknown): number | undefined {
		const res = (err as { response?: { status?: number } }).response;
		return typeof res?.status === "number" ? res.status : undefined;
	}

	try {
		const page = await client.createPage();
		// Use page normally
	} catch (err) {
		switch (httpStatus(err)) {
			case 401:
				// The user is signed out. Nothing else produces a 401 any more.
				await showSignInUI();
				break;
			case 409:
				// A pagination token outlived the results it pointed at. The page id is
				// still good — start its pagination again.
				await restartPagination();
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
