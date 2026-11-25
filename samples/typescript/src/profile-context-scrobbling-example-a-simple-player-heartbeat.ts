import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	// When playback starts — send the real start position (not 0 when resuming)
	async function onStart(mediaId: string, progress: number) {
		await client.scrobble(mediaId, progress);
	}

	// When the user pauses or seeks to a new position
	async function onPauseOrSeek(mediaId: string, progress: number) {
		await client.scrobble(mediaId, progress);
	}

	// About every 30 seconds while playing
	async function heartbeat(mediaId: string, progress: number) {
		await client.scrobble(mediaId, progress);
	}
	// docs:end
	void onStart;
	void onPauseOrSeek;
	void heartbeat;
}
