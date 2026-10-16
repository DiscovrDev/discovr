// docs:start
import {
	AuthCancelledError,
	DeviceCodeDeniedError,
	DeviceCodeExpiredError,
	DiscovrClient,
} from "discovr";
// docs:end

export async function sample(client: DiscovrClient) {
	// docs:start
	const { completion } = await client.signInWithDeviceCode();

	try {
		// Settles when the flow ends. Resolves once the person approves on their phone.
		await completion;
		console.log("Signed in.");
	} catch (err) {
		if (err instanceof DeviceCodeDeniedError) {
			console.log("They declined on their phone. Say so, and offer a new code.");
		} else if (err instanceof DeviceCodeExpiredError) {
			console.log("The code ran out. Show a fresh one.");
		} else if (err instanceof AuthCancelledError) {
			console.log("You stopped the flow with unsubscribe(). Nothing to show.");
		} else {
			throw err;
		}
	}
	// docs:end
}
