// docs:start
import Discovr
// docs:end

// docs:start
enum AvatarView { case video, animatedImage, image }

/// Pick the view for a profile's avatar from its stored type, never from the URL.
func avatarView(for profile: Profile) -> AvatarView {
	guard let type = profile.avatarMediaType else { return .image }
	if type.rawValue.hasPrefix("video/") { return .video }
	if type == .imageSlashGif { return .animatedImage }
	// Still images.
	return .image
}
// docs:end
