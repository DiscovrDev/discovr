import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	const tracker = client.trackPlayback(item);

	// Send the real starting position (e.g. 45 when resuming, never 0 on resume).
	tracker.start(0);

	// Safe to call every second while playing — throttled to 30s automatically.
	tracker.update(32.5);

	// Pause, resume, and seek send immediately and deduplicate repeat events.
	tracker.pause(42.0);
	tracker.resume(42.0);
	tracker.seek(60.0);

	// Terminal call: once-only, awaits delivery, and returns the ScrobbleResponse.
	const result = await tracker.stop(64.0); // or await tracker.finish() at 100%
	// docs:end
	void result;
}
