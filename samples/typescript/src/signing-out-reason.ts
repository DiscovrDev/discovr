import { DiscovrClient } from "discovr";

declare function showSignIn(): void;
declare function showSessionExpired(): void;
declare function showDemoEnded(): void;

export function sample(client: DiscovrClient) {
	// docs:start
	const unsubscribe = client.onAuthStateChanged(({ signedIn, signOutReason }) => {
		if (signedIn) return;
		// signOutReason is null on a fresh start with no credential.
		if (signOutReason === "session-expired") return showSessionExpired();
		// demo-ended only happens while you develop with demoMode.
		if (signOutReason === "demo-ended") return showDemoEnded();
		showSignIn();
	});
	// docs:end
	return unsubscribe;
}
