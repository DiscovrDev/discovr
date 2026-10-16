export async function sample() {
	// docs:start
	// Native lazy loading (simplest)
	function renderMediaItem(item: { posterPath?: Record<string, string>; title: string }) {
		const img = document.createElement("img");
		img.src = item.posterPath?.w185 ?? ""; // Pick the size you need — see the Tip below
		img.loading = "lazy"; // Browser defers load until visible
		img.alt = item.title;
		return img;
	}

	// Or with Intersection Observer (more control)
	function observeImageVisibility(img: HTMLImageElement) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					img.src = img.dataset.src ?? ""; // Load on visibility
					observer.unobserve(img);
				}
			});
		});
		observer.observe(img);
	}
	// docs:end
}
