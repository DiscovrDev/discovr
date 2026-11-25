import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	const tracker = client.trackPlayback(item, {
		onError: (err) => console.warn("Scrobble failed:", err),
	});

	// Pass the current stream's { position, duration } in any matching unit (seconds or ms).
	// Calls with duration <= 0 are ignored instead of overwriting resume position with 0%.
	function onPlay(position: number, duration: number) {
		tracker.start({ position, duration });
	}
	function onTimeUpdate(position: number, duration: number) {
		tracker.update({ position, duration }); // throttled to every 30s
	}
	function onPause(position: number, duration: number) {
		tracker.pause({ position, duration });
	}
	function onSeek(position: number, duration: number) {
		tracker.seek({ position, duration });
	}
	async function onStop(position: number, duration: number) {
		await tracker.stop({ position, duration });
	}
	// docs:end
	void onPlay;
	void onTimeUpdate;
	void onPause;
	void onSeek;
	void onStop;
}
