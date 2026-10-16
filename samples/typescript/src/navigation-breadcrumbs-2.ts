import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient, pageId: string) {
	// docs:start
	// On tap:
	const pageData = await client.getPage(romanceItem.pageId);
	navigationStack.push({ id: romanceItem.pageId, name: pageData.name ?? romanceItem.title });
	// docs:end
}
