// docs:start
async function switchProfile(newProfileId: string) {
	// Clear the old home page
	document.getElementById("home-container")!.innerHTML = "";

	// Select new profile (creates new session)
	await client.selectProfile(newProfileId);

	// Load new home page
	const newHome = await client.createPage({ name: "Home" });
	await loadHomePageEfficiently(newHome.id);
}
// docs:end
