// docs:start
import type { MediaProfileMeta } from "discovr";
// docs:end

// docs:start
function primaryCta(meta: MediaProfileMeta): { label: string; progress?: number } {
	if (meta.playback.inlist && meta.playback.data) {
		const d = meta.playback.data;
		return { label: "Resume", progress: d.progress };
	}
	return { label: "Play" };
}

function liked(meta: MediaProfileMeta): boolean {
	return meta.liked;
}
// docs:end
