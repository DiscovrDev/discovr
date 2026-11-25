// docs:start
import type { TitleState } from "discovr";
// docs:end

// docs:start
function primaryCta(state: TitleState): { label: string; progress?: number } {
	if (state.playback) {
		return { label: "Resume", progress: state.playback.progress };
	}
	return { label: "Play" };
}

function liked(state: TitleState): boolean {
	return state.rating === "liked";
}
// docs:end
