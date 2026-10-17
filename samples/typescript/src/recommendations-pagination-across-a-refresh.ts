import { DiscovrClient, ResponseError } from "discovr";

export async function sample(client: DiscovrClient, pageId: string) {
	// docs:start
	try {
		return await client.getRows(pageId, { nextPageToken: token });
	} catch (err) {
		if (err instanceof ResponseError && err.response.status === 409) {
			// The recommendations turned over, so this token is done. The page ID is
			// still good: reload the hero and the first rows, and replace what you
			// were showing. Don't append them to the old list.
			const [page, rows] = await Promise.all([client.getPage(pageId), client.getRows(pageId)]);
			return { page, rows };
		}
		throw err;
	}
	// docs:end
}
