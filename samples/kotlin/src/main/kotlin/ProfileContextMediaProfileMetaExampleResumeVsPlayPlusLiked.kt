import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.models.Rating
import api.discovr.models.TitleState
// docs:end

// docs:start
data class PrimaryCta(val label: String, val progress: Double? = null)

fun primaryCta(state: TitleState): PrimaryCta {
	val p = state.playback
	return if (p != null) {
		PrimaryCta(label = "Resume", progress = p.progress)
	} else {
		PrimaryCta(label = "Play")
	}
}

fun liked(state: TitleState): Boolean = state.rating == Rating.liked
// docs:end
