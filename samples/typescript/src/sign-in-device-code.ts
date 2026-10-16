import { DiscovrClient } from "discovr";

declare function selectProfile(): void;

export async function sample(client: DiscovrClient) {
	// docs:start
	// Request a device code. unsubscribe() stops the background polling.
	// On a TV, ask for a bigger QR code: 600-800 pixels reads well across a room.
	const { userCode, qrCode, verificationUrl, unsubscribe } = await client.signInWithDeviceCode({
		qrSize: 700,
	});
	console.log(`Scan the QR code, or go to ${verificationUrl} and enter ${userCode}`);
	// Render qrCode in your UI

	// The SDK polls in the background and reports when sign-in finishes.
	client.onAuthStateChanged(({ signedIn }) => {
		if (signedIn) {
			console.log("User authenticated on other device!");
			selectProfile();
		}
	});

	// Call unsubscribe() when the user leaves the screen.
	// docs:end
	return unsubscribe;
}
