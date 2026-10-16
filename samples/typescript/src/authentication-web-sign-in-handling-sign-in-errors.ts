// docs:start
import { AuthCancelledError, DiscovrClient } from "discovr";
// docs:end

export async function sample(client: DiscovrClient) {
	// docs:start
	try {
		await client.signInWithPopup();
	} catch (err) {
		if (err instanceof AuthCancelledError) {
			// They closed the window or pressed Cancel. Usually best answered with silence.
			console.log("User cancelled sign-in");
		} else if (err instanceof Error && err.message.startsWith("Failed to open popup")) {
			console.log("Popup blocked. Allow popups for this site and retry.");
		} else {
			console.log("Sign-in failed:", err);
			// Show user: "Sign-in failed. Try again."
		}
	}
	// docs:end
}
