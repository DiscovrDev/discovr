import { DiscovrClient } from "discovr";

declare function showSignIn(): void;
declare function showProfilePicker(): void;
declare function showBrowse(): void;

export function sample(client: DiscovrClient) {
	// docs:start
	const unsubscribe = client.onAuthStateChanged(({ signedIn, profileId }) => {
		if (!signedIn) return showSignIn();
		if (!profileId) return showProfilePicker();
		showBrowse();
	});
	// docs:end
	return unsubscribe;
}
