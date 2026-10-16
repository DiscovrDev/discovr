// docs:start
import type { Profile } from "discovr";
// docs:end

// docs:start
type AvatarView = "video" | "animated-image" | "image";

/** Pick the view for a profile's avatar from its stored type, never from the URL. */
function avatarView(profile: Profile): AvatarView {
	const type = profile.avatarMediaType;
	if (type?.startsWith("video/")) return "video";
	if (type === "image/gif") return "animated-image";
	// Still images, and profiles with no type recorded.
	return "image";
}
// docs:end
