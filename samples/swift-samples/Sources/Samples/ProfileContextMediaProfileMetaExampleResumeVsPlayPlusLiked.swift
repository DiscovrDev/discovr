// docs:start
import Discovr
// docs:end

// docs:start
struct PrimaryCTA {
	var label: String
	var progress: Double?
}

func primaryCTA(from meta: MediaProfileMeta) -> PrimaryCTA {
	if meta.playback.inlist, let d = meta.playback.data {
		return PrimaryCTA(label: "Resume", progress: d.progress)
	}
	return PrimaryCTA(label: "Play", progress: nil)
}

func liked(_ meta: MediaProfileMeta) -> Bool {
	meta.liked
}
// docs:end
