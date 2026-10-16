import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient, mediaId: string, progress: number) {
	// docs:start
	await client.scrobble(mediaId, progress);
	// docs:end
}
