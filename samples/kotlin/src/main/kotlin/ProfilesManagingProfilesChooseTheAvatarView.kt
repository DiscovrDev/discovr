import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.models.AvatarMediaType
import api.discovr.models.Profile
// docs:end

// docs:start
enum class AvatarView { VIDEO, ANIMATED_IMAGE, IMAGE }

/** Pick the view for a profile's avatar from its stored type, never from the URL. */
fun avatarView(profile: Profile): AvatarView {
	val type = profile.avatarMediaType
	return when {
		type?.value?.startsWith("video/") == true -> AvatarView.VIDEO
		type == AvatarMediaType.imageSlashGif -> AvatarView.ANIMATED_IMAGE
		// Still images, and profiles with no type recorded.
		else -> AvatarView.IMAGE
	}
}
// docs:end
