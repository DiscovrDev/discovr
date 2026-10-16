import { DiscovrClient } from "discovr";

// docs:start
async function goBack() {
	if (navigationStack.length > 1) {
		navigationStack.pop(); // Remove current page
		const previous = navigationStack[navigationStack.length - 1];
		const pageData = await client.getPage(previous.id);
		renderPage(pageData); // Show the previous page (same snapshot)
	}
}
// docs:end
