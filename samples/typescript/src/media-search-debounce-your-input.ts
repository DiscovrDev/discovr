import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient) {
	// docs:start
	let timer: ReturnType<typeof setTimeout>;

	input.addEventListener("input", () => {
		clearTimeout(timer);
		const query = input.value.trim();
		if (query.length < 2) return;

		timer = setTimeout(async () => {
			const response = await client.searchMedia({ query });
			render(response.results);
		}, 350);
	});
	// docs:end
}
