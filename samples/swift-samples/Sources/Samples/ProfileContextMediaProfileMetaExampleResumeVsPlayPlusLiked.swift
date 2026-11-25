// docs:start
import Discovr
// docs:end

// docs:start
struct PrimaryCTA {
	var label: String
	var progress: Double?
}

func primaryCTA(from state: TitleState) -> PrimaryCTA {
	if let p = state.playback {
		return PrimaryCTA(label: "Resume", progress: p.progress)
	}
	return PrimaryCTA(label: "Play", progress: nil)
}

func liked(_ state: TitleState) -> Bool {
	state.rating == .liked
}
// docs:end
