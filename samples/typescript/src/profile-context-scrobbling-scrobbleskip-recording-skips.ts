import { DiscovrClient } from "discovr";

export async function sample(
	client: DiscovrClient,
	mediaId: string,
	from: number,
	to: number,
	secondsSkipped: number,
) {
	// docs:start
	await client.scrobbleSkip(mediaId, from, to, secondsSkipped);
	// docs:end
}
