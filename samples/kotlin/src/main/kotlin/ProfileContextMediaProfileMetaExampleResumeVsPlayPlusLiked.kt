import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*
// docs:start
import api.discovr.models.MediaProfileMeta
// docs:end

// docs:start
data class PrimaryCta(val label: String, val progress: Double? = null)

fun primaryCta(meta: MediaProfileMeta): PrimaryCta {
	val d = meta.playback.data
	return if (meta.playback.inlist && d != null) {
		PrimaryCta(label = "Resume", progress = d.progress)
	} else {
		PrimaryCta(label = "Play")
	}
}

fun liked(meta: MediaProfileMeta): Boolean = meta.liked
// docs:end
