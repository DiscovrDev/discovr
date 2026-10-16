/**
 * Reorder Authorization Section in API Reference Pages
 *
 * Moves the Authorization/security requirements section to the bottom of API reference pages,
 * making variable fields (parameters, request body, responses) more prominent.
 *
 * Optimized for fast initial load - uses CSS-first approach with minimal JavaScript.
 * Uses DOM manipulation exclusively to avoid breaking Mintlify's grid layout
 * (which happened when forcing display:flex on the container).
 */

(function () {
	"use strict";

	const DEBUG = false;
	function log(...args) {
		if (DEBUG) console.log("[Reorder Auth]", ...args);
	}

	let lastPath = window.location.pathname;
	let observerThrottle = null;

	/**
	 * Find the authorization section
	 */
	function findAuthorizationSection() {
		// Look for .api-section that contains "Authorization" or "Security"
		const apiSections = document.querySelectorAll(".api-section");
		for (const section of apiSections) {
			// Check headers specifically to be more precise
			const header = section.querySelector("h2, h3, h4");
			if (header) {
				const text = (header.textContent || "").toLowerCase();
				if (text.includes("authorization") || text.includes("security")) {
					return section;
				}
			}

			// Fallback to full text content
			const text = (section.textContent || "").toLowerCase();
			// Heuristic: Check if strictly auth/security section
			if ((text.includes("authorization") && text.length < 500) || text.includes("security")) {
				return section;
			}
		}
		return null;
	}

	/**
	 * Move the section to the bottom of its parent using DOM manipulation
	 */
	function moveSectionToBottom() {
		const authSection = findAuthorizationSection();
		if (!authSection) return;

		const parent = authSection.parentElement;
		if (!parent) return;

		// Check if it's already the last child
		if (parent.lastElementChild === authSection) {
			log("Already at bottom");
			return;
		}

		// Move to end
		log("Moving auth section to bottom");
		parent.appendChild(authSection);
	}

	/**
	 * Handle reordering with checks for route changes
	 */
	function handleReorder() {
		// Always try to move it if found
		moveSectionToBottom();
	}

	/**
	 * Throttled mutation observer handler
	 */
	function handleMutations() {
		if (observerThrottle) return;

		observerThrottle = requestAnimationFrame(() => {
			observerThrottle = null;

			const currentPath = window.location.pathname;
			if (currentPath !== lastPath) {
				lastPath = currentPath;
				log("Route changed");
			}

			handleReorder();
		});
	}

	/**
	 * Initialize
	 */
	function init() {
		log("Script initialized");

		// Initial attempt
		handleReorder();

		// Retry shortly after to catch late renders (React hydration)
		setTimeout(handleReorder, 500);
		setTimeout(handleReorder, 1500);

		// Observer for SPA navigation and dynamic content
		const observer = new MutationObserver(handleMutations);
		try {
			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
		} catch (e) {
			console.error("Failed to start observer", e);
		}

		// Monkey-patch history API for SPA navigation support
		const originalPushState = history.pushState;
		const originalReplaceState = history.replaceState;

		history.pushState = function (...args) {
			originalPushState.apply(history, args);
			setTimeout(handleReorder, 100);
		};

		history.replaceState = function (...args) {
			originalReplaceState.apply(history, args);
			setTimeout(handleReorder, 100);
		};

		window.addEventListener("popstate", () => {
			setTimeout(handleReorder, 100);
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
