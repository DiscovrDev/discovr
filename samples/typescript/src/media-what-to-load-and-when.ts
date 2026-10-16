// docs:start
import { DiscovrClient } from "discovr";
import type { MediaAssetsResponse, MediaResponse } from "discovr";
// docs:end

export async function sample() {
	// docs:start
	const client = new DiscovrClient("your-client-id");

	async function loadHeader(mediaId: string) {
		const [details, images]: [MediaResponse, MediaAssetsResponse] = await Promise.all([
			client.getMedia(mediaId),
			client.getMediaAssets(mediaId),
		]);
		// Prefer a localized logo when present — exact shape is in MediaAssetsResponse / OpenAPI.
		return { details, images };
	}
	// docs:end
}
