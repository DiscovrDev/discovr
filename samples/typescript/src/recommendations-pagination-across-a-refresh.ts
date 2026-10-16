import { DiscovrClient, ResponseError } from "discovr";

export async function sample(client: DiscovrClient, pageId: string) {
	// docs:start
	try {
		return await client.getRows(pageId, { nextPageToken: token });
	} catch (err) {
		if (err instanceof ResponseError && err.response.status === 409) {
			// The page is fine — only our position in it expired.
			return await client.getRows(pageId);
		}
		throw err;
	}
	// docs:end
}
