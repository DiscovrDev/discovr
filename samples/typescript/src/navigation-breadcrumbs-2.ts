import { DiscovrClient } from "discovr";

export async function sample(client: DiscovrClient, pageId: string) {
	// docs:start
	// On tap: pass the tile so its ref is preserved
	const pageData = await client.getPage(romanceItem);
	navigationStack.push({ id: romanceItem.pageId, name: pageData.name ?? romanceItem.title });
	// docs:end
	void pageId;
}
