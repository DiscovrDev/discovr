// docs:start
import { DiscovrClient } from "discovr";
// docs:end

export async function sample(query: string) {
	// docs:start
	const client = new DiscovrClient("your-client-id");
	const response = await client.searchMedia({ query: "blade runner" });

	for (const result of response.results) {
		console.log(result.id, result.mediaType, result.title ?? result.name);
	}
	// MV_335984  movie  Blade Runner 2049
	// TV_92782   tv     Blade Runner: Black Lotus
	// 30614      person Ryan Gosling
	// docs:end
}
