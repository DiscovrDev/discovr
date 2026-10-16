import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	// When user clicks sign out
	async function handleSignOut() {
		await client.signOut(); // Revokes this device's refresh token
		// Clear local state, redirect to login page
		redirectTo("/login");
	}
	// docs:end
}
