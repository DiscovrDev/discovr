import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	// When the user pauses
	async function onPause(mediaId: string, progress: number) {
		await client.scrobble(mediaId, progress);
	}

	// When they skip or rewind — log the jump, then the position they landed on
	async function onSkip(mediaId: string, from: number, toProgress: number, secondsSkipped: number) {
		await client.scrobbleSkip(mediaId, from, toProgress, secondsSkipped);
		await client.scrobble(mediaId, toProgress);
	}

	// About every 30 seconds while playing
	async function heartbeat(mediaId: string, progress: number) {
		await client.scrobble(mediaId, progress);
	}
	// docs:end
}
