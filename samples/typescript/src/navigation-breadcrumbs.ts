import { DiscovrClient } from "discovr";

export async function sample() {
	// docs:start
	// navigationStack: [{ id: "...", name: "Home" }, { id: "...", name: "Movies" }, ...]
	const breadcrumbTrail = navigationStack.map((p) => p.name).join(" > ");
	// "Home > Movies > Anime"
	// docs:end
}
