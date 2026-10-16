import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	client.onRecommendationsChanged(() => {
		// Same page ID — only the rows behind it moved. Flag it and reload on the
		// user's next navigation — not mid-scroll. See "Applying a turnover" below.
		markRecommendationsStale();
	});
	// docs:end
}
