/**
 * DiscovrClient — the single public entry point for the Discovr SDK.
 *
 * Extends the auto-generated `_DiscovrClientBase` (which contains all API
 * methods with ergonomic inlined arguments) and owns the internal `_DiscovrAuth`
 * instance that manages token storage, refresh, and auto-recovery.
 *
 * Customers never import `_DiscovrAuth` or `_DiscovrClientBase` directly.
 * Everything — authentication flows and API calls — is accessed through
 * this class.
 *
 * @example
 * ```typescript
 * const client = new DiscovrClient("your-client-id");
 *
 * // Sign in
 * await client.signInWithPopup();
 * const { profiles } = await client.getProfiles();
 * await client.selectProfile(profiles[0].id);
 *
 * // API calls
 * const page = await client.createPage();
 * const rows = await client.getRows(page.id);
 * await client.setRating("MV_550", "liked");
 * ```
 *
 * @example Try it without an account
 * ```typescript
 * // A throwaway sandbox with realistic data — no sign-up, no credentials.
 * // Every call below is identical to the real thing.
 * const client = new DiscovrClient("your-client-id", { demoMode: true });
 * const { profiles } = await client.getProfiles();
 * await client.selectProfile(profiles[0].id);
 * ```
 */

import { _DiscovrClientBase } from "./_DiscovrClientBase";
import { _DiscovrCache } from "./_DiscovrCache";
import { DiscovrApi } from "./apis/DiscovrApi";
import type {
	EpisodeRef,
	GetRowItemsResponse,
	GetRowsResponse,
	MediaAssetsResponse,
	MediaResponse,
	Page,
	Rating,
	Row,
	ScrobbleResponse,
	SeasonDetailsResponse,
	SeasonState,
	SimilarResponse,
	SuccessMessage,
	TitleState,
} from "./models/index";
import { PlaybackTracker, type TrackPlaybackOptions } from "./PlaybackTracker";
import _DiscovrAuth, {
	type AuthConfig,
	type AuthState,
	type AuthStateCallback,
	type DeviceCodeOptions,
	type DeviceCodeResult,
	type SessionState,
	type SessionStateCallback,
	type SignInResult,
	type SignOutReason,
	type Unsubscribe,
} from "./auth";

export type { AuthState, DeviceCodeOptions, DeviceCodeResult, SessionState, SignOutReason };
export type { PlaybackProgressInput, PlaybackTime, TrackPlaybackOptions } from "./PlaybackTracker";
export { PlaybackTracker } from "./PlaybackTracker";

/**
 * Any Discovr title item carrying an `id` and optional `ref` (e.g. `MediaItem`,
 * `TitleListItem`, `PlaybackItem`, `SearchResult`, `SimilarResult`, `KnownForItem`).
 *
 * `pageId?: never` prevents accidentally passing a navigation/provider tile to
 * a title-taking method at compile time.
 */
export interface DiscovrTitleRef {
	readonly id: string;
	readonly ref?: string | null;
	readonly pageId?: never;
	readonly season?: number | null;
	readonly episode?: number | null;
}

/**
 * Any Discovr navigation or provider tile opening a page (`NavigationItem`, `ProviderItem`).
 */
export interface DiscovrPageRef {
	readonly id: string;
	readonly pageId: string;
	readonly ref?: string | null;
}

/** Accepts either a Discovr title model (extracting `refOrId` automatically) or a raw ID / `ref` string. */
export type MediaIdOrItem = string | DiscovrTitleRef;

/** Accepts either a navigation/provider tile (extracting `refOrId` automatically) or a raw page ID / `ref` string. */
export type PageIdOrTile = string | DiscovrPageRef;

function resolveTitleRef(media: MediaIdOrItem): string {
	return typeof media === "string" ? media : (media.ref ?? media.id);
}

function resolvePageRef(tile: PageIdOrTile): string {
	return typeof tile === "string" ? tile : (tile.ref ?? tile.pageId ?? tile.id);
}

export interface DiscovrClientConfig extends AuthConfig {
	/**
	 * Enable the session-level response cache for deterministic/public
	 * endpoints (pages, rows, profiles, media, misc). Defaults to enabled —
	 * disable if you need every call to hit the network, e.g. in tests.
	 */
	cache?: boolean;
}

export class DiscovrClient extends _DiscovrClientBase {
	/** @internal */
	protected override readonly _auth: _DiscovrAuth;
	/** @internal */
	protected override readonly _cache: _DiscovrCache;
	private selectingProfileDepth = 0;

	constructor(clientId: string, config: DiscovrClientConfig = {}) {
		super();
		this._auth = new _DiscovrAuth(clientId, config);
		this._cache = new _DiscovrCache({
			enabled: config.cache ?? true,
			retryScope: () => (this._auth.isSignedIn() ? this._auth.getActiveProfileId() : null),
		});

		// Clear cached page data when the *recommendations* turn over, not on
		// every session mint. Same-profile turnovers are retryable so in-flight
		// fetches transparently retry once; profile changes or explicit
		// selectProfile/switchProfile calls clear non-retryably before user
		// auth/session listeners fire so Profile A calls never retry under Profile B.
		let lastProfileId = this._auth.getActiveProfileId();
		this._auth._onSnapshotChange((changed) => {
			const currentProfileId = this._auth.getActiveProfileId();
			const profileChanged = currentProfileId !== lastProfileId;
			lastProfileId = currentProfileId;
			if (!changed && !profileChanged) return;
			const retryable = this.selectingProfileDepth === 0 && !profileChanged;
			this._cache.clearForSnapshot(this._auth._getSnapshotId(), retryable);
		});

		// Ensure forced sign-outs (e.g. expired/revoked refresh token during 401
		// recovery) also wipe cached data without retrying in-flight fetches.
		let wasSignedIn = this._auth.isSignedIn();
		this._auth.onAuthStateChanged((state) => {
			if (wasSignedIn && !state.signedIn) {
				lastProfileId = null;
				this._cache.clear(false);
			}
			wasSignedIn = state.signedIn;
		});
	}

	// ── Auth pass-throughs ────────────────────────────────────────────────────
	// All auth methods are flat on the client so users never need to import or
	// instantiate `_DiscovrAuth` themselves.

	/** Open an auth popup and sign in. Browser environments only. */
	signInWithPopup(): Promise<SignInResult> {
		return this._auth.signInWithPopup();
	}

	/**
	 * Redirect the current page to the auth flow. Call
	 * `handleRedirectResult()` on the return page.
	 */
	signInWithWebAuth(redirectURL: string): Promise<void> {
		return this._auth.signInWithWebAuth(redirectURL);
	}

	/**
	 * Call this on the redirect-return page. It checks the `state`, redeems the
	 * authorization code in the URL for the refresh token (with the PKCE verifier
	 * the SDK kept), signs in, and removes the parameters from the address bar.
	 * Resolves to `null` when the page load is not a sign-in return.
	 */
	handleRedirectResult(): Promise<SignInResult | null> {
		return this._auth.handleRedirectResult();
	}

	/**
	 * Begin device-code sign-in. Returns display data immediately;
	 * subscribe via `onAuthStateChanged` to detect completion, or await
	 * `completion` to also learn that the person declined or the code lapsed.
	 *
	 * `qrSize` is the QR code's size in pixels (100-1000, default 300); a TV
	 * screen wants 600-800. The poll pace and the timeout are the server's.
	 */
	signInWithDeviceCode(options?: DeviceCodeOptions): Promise<DeviceCodeResult> {
		return this._auth.signInWithDeviceCode(options);
	}

	/**
	 * Sign in to a throwaway demo sandbox — no credentials or sign-up needed.
	 *
	 * Everything afterwards is the ordinary flow (`getProfiles`,
	 * `selectProfile`, reads and writes), so code written against a demo
	 * sandbox works unchanged against a real account. Sandboxes expire after a
	 * short window and are deleted, so treat the data as disposable.
	 *
	 * Happens automatically on first use when the client is constructed with
	 * `{ demoMode: true }`.
	 */
	signInWithDemo(): Promise<SignInResult> {
		return this._auth.signInWithDemo();
	}

	/**
	 * Select a profile and mint a session token bound to it. Must be called
	 * after sign-in before any session-tier API calls.
	 */
	async selectProfile(profileId: string): Promise<void> {
		this.selectingProfileDepth++;
		try {
			await this._auth.selectProfile(profileId);
			// `_onSnapshotChange` already cleared non-retryably before user
			// auth/session listeners fired; `clearForSnapshot` is a no-op for
			// the same snapshot so brand-new fetches started by listeners stay
			// intact, while still clearing if snapshotId is null/reused.
			this._cache.clearForSnapshot(this._auth._getSnapshotId(), false);
		} finally {
			this.selectingProfileDepth--;
		}
	}

	/**
	 * Switch to a different profile. Starts a fresh set of recommendations,
	 * since the previous profile's would be the wrong ones to keep.
	 */
	async switchProfile(profileId: string): Promise<void> {
		this.selectingProfileDepth++;
		try {
			await this._auth.switchProfile(profileId);
			this._cache.clearForSnapshot(this._auth._getSnapshotId(), false);
		} finally {
			this.selectingProfileDepth--;
		}
	}

	/** Revoke the current device's refresh token and clear local state. */
	async signOut(): Promise<void> {
		// Clear first with retryable=false: local auth state is wiped synchronously
		// inside _auth.signOut() before it awaits the server-side revocation call,
		// and in-flight fetches must not retry into a signed-out session.
		this._cache.clear(false);
		await this._auth.signOut();
	}

	/** True if a refresh token is held (signed in). */
	isSignedIn(): boolean {
		return this._auth.isSignedIn();
	}

	/** True if a profile has been selected and a session token is held. */
	hasActiveProfile(): boolean {
		return this._auth.hasActiveProfile();
	}

	/** Returns the currently selected profile ID, or null. */
	getActiveProfileId(): string | null {
		return this._auth.getActiveProfileId();
	}

	/**
	 * Subscribe to auth-state changes. The callback fires immediately with
	 * the current state and again on every sign-in/out or profile change.
	 *
	 * @returns An unsubscribe function.
	 */
	onAuthStateChanged(cb: AuthStateCallback): Unsubscribe {
		return this._auth.onAuthStateChanged(cb);
	}

	/**
	 * Subscribe to session changes. Fires immediately with the current state,
	 * then on every new session — the initial `selectProfile()`, a profile
	 * switch, and each automatic renewal.
	 *
	 * Watch `snapshotId` rather than the event itself to know when to rebuild
	 * page data: most of these are routine credential renewals that leave the
	 * user's recommendations exactly as they were.
	 *
	 * @returns An unsubscribe function.
	 */
	onSessionRefreshed(cb: SessionStateCallback): Unsubscribe {
		return this._auth.onSessionRefreshed(cb);
	}

	/**
	 * Subscribe to recommendation turnovers — the signal to rebuild what's on
	 * screen.
	 *
	 * Fires when the user's recommendations actually move, roughly every 30
	 * minutes as a snapshot ages out. Routine
	 * credential renewals don't fire it. Page ids don't change, so refetch the
	 * page you're already showing rather than recreating it.
	 *
	 * Does not fire on subscribe — it reports an event, not a state.
	 *
	 * @returns An unsubscribe function.
	 */
	onRecommendationsChanged(cb: () => void): Unsubscribe {
		return this._auth.onRecommendationsChanged(cb);
	}

	/**
	 * Low-level session-tier `DiscovrApi` — prefer typed facade methods
	 * (`createPage`, `getRows`, …) when possible.
	 */
	sessionApi(): DiscovrApi {
		return this._auth.sessionApi();
	}

	/** Low-level identity-tier `DiscovrApi` (`/profiles`, `/auth/session`). */
	identityApi(): DiscovrApi {
		return this._auth.identityApi();
	}

	/** Unauthenticated `DiscovrApi` for public endpoints. */
	publicApi(): DiscovrApi {
		return this._auth.publicApi();
	}

	/**
	 * Clear the session-level response cache. Cacheable calls (pages, rows,
	 * profiles, media, misc) after this will hit the network again. Also
	 * called automatically on profile switch, sign-out, and session rotation.
	 */
	clearCache(): void {
		this._cache.clear();
	}

	/**
	 * Release resources and stop listening for changes from other tabs.
	 *
	 * Call this when the client is no longer needed — a component unmount, a
	 * test teardown, or anywhere you would dispose a long-lived object. After
	 * `close()`, this client must not be used again. Long-lived singletons never
	 * need it; anything created more than once does, or each instance leaves a
	 * live `storage` listener behind.
	 */
	close(): void {
		this._auth.close();
		this._cache.clear(false);
	}

	// ── Playback tracker (A18) ────────────────────────────────────────────────

	/**
	 * Create a percentage-first {@link PlaybackTracker} for a movie or TV episode.
	 *
	 * Accepts any title item (`MediaItem`, `TitleListItem`, `PlaybackItem`, etc.)
	 * — automatically extracting `refOrId` (and `EpisodeRef(season, episode)` for
	 * TV `PlaybackItem`s unless `options.tv` is explicitly provided) — or a raw
	 * media ID / `ref` string.
	 */
	trackPlayback(item: MediaIdOrItem, options: TrackPlaybackOptions = {}): PlaybackTracker {
		const mediaRefOrId = resolveTitleRef(item);
		let tv = options.tv;
		if (
			tv === undefined &&
			typeof item !== "string" &&
			!("watchlist" in item) &&
			typeof item.season === "number" &&
			typeof item.episode === "number"
		) {
			tv = { season: item.season, episode: item.episode };
		}
		return new PlaybackTracker(
			mediaRefOrId,
			{ ...options, tv },
			{
				send: (id, progress, episodeRef) =>
					super.scrobble(id, progress, episodeRef ? { tv: episodeRef } : undefined),
			},
		);
	}

	// ── Item-taking overloads (A16) ───────────────────────────────────────────
	// Widen the generated string methods so callers can pass item/tile models
	// directly and get automatic `refOrId` attribution, while still accepting
	// raw ID / `ref` strings for deep links and stored IDs.

	override getMedia(
		media: MediaIdOrItem,
		options?: { bypassCache?: boolean },
	): Promise<MediaResponse> {
		return super.getMedia(resolveTitleRef(media), options);
	}

	override getMediaAssets(
		media: MediaIdOrItem,
		options?: { bypassCache?: boolean },
	): Promise<MediaAssetsResponse> {
		return super.getMediaAssets(resolveTitleRef(media), options);
	}

	override getSimilarRecommendations(
		media: MediaIdOrItem,
		options?: { language?: string; page?: number; bypassCache?: boolean },
	): Promise<SimilarResponse> {
		return super.getSimilarRecommendations(resolveTitleRef(media), options);
	}

	override getSeasonDetails(
		media: MediaIdOrItem,
		seasonNumber: number,
		options?: { language?: string; bypassCache?: boolean },
	): Promise<SeasonDetailsResponse> {
		return super.getSeasonDetails(resolveTitleRef(media), seasonNumber, options);
	}

	override getTitleState(
		media: MediaIdOrItem,
		options?: { providers?: boolean },
	): Promise<TitleState> {
		return super.getTitleState(resolveTitleRef(media), options);
	}

	override getSeasonState(media: MediaIdOrItem, seasonNumber: number): Promise<SeasonState> {
		return super.getSeasonState(resolveTitleRef(media), seasonNumber);
	}

	override setRating(media: MediaIdOrItem, value: Rating): Promise<TitleState> {
		return super.setRating(resolveTitleRef(media), value);
	}

	override clearRating(media: MediaIdOrItem): Promise<TitleState> {
		return super.clearRating(resolveTitleRef(media));
	}

	override addToWatchlist(media: MediaIdOrItem): Promise<TitleState> {
		return super.addToWatchlist(resolveTitleRef(media));
	}

	override removeFromWatchlist(media: MediaIdOrItem): Promise<TitleState> {
		return super.removeFromWatchlist(resolveTitleRef(media));
	}

	override markWatched(
		media: MediaIdOrItem,
		options?: { season?: number; episode?: number },
	): Promise<TitleState> {
		return super.markWatched(resolveTitleRef(media), options);
	}

	override markUnwatched(
		media: MediaIdOrItem,
		options?: { season?: number; episode?: number },
	): Promise<TitleState> {
		return super.markUnwatched(resolveTitleRef(media), options);
	}

	override deletePlaybackItem(media: MediaIdOrItem): Promise<SuccessMessage> {
		return super.deletePlaybackItem(resolveTitleRef(media));
	}

	override scrobble(
		media: MediaIdOrItem,
		progress: number,
		options?: { tv?: EpisodeRef },
	): Promise<ScrobbleResponse> {
		return super.scrobble(resolveTitleRef(media), progress, options);
	}

	override getPage(tile: PageIdOrTile, options?: { bypassCache?: boolean }): Promise<Page> {
		return super.getPage(resolvePageRef(tile), options);
	}

	override getRows(
		tile: PageIdOrTile,
		options?: { nextPageToken?: string; limit?: number; bypassCache?: boolean },
	): Promise<GetRowsResponse> {
		return super.getRows(resolvePageRef(tile), options);
	}

	override getRow(
		tile: PageIdOrTile,
		rowId: string,
		options?: { bypassCache?: boolean },
	): Promise<Row> {
		return super.getRow(resolvePageRef(tile), rowId, options);
	}

	override getRowItems(
		tile: PageIdOrTile,
		rowId: string,
		options?: { nextPageToken?: string; limit?: number; bypassCache?: boolean },
	): Promise<GetRowItemsResponse> {
		return super.getRowItems(resolvePageRef(tile), rowId, options);
	}

	// ── Convenience title-list wrappers ───────────────────────────────────────

	/** List titles rated `liked` by the active profile, newest rated first. */
	getLiked(options?: { nextPageToken?: string; limit?: number }) {
		return this.getTitles({ rating: "liked", ...options });
	}

	/** List titles rated `disliked` by the active profile, newest rated first. */
	getDisliked(options?: { nextPageToken?: string; limit?: number }) {
		return this.getTitles({ rating: "disliked", ...options });
	}

	/** List titles rated `super_liked` by the active profile, newest rated first. */
	getSuperLiked(options?: { nextPageToken?: string; limit?: number }) {
		return this.getTitles({ rating: "super_liked", ...options });
	}

	/** List titles on the active profile's watchlist, newest added first. */
	getWatchlist(options?: { nextPageToken?: string; limit?: number }) {
		return this.getTitles({ watchlist: true, ...options });
	}

	/** List the active profile's watch history (one entry per title), most recently watched first. */
	getHistory(options?: { nextPageToken?: string; limit?: number }) {
		return this.getTitles({ watched: true, ...options });
	}
}

/**
 * The value to pass onward for an item Discovr returned.
 *
 * Every media, navigation, provider and search item carries an `id` and,
 * usually, a `ref` — the same id with the place it was shown attached. The ref
 * works anywhere the id does and tells Discovr which row or search surfaced the
 * item, which sharpens that profile's recommendations.
 *
 * Prefer this over reaching for `.id` directly:
 *
 * ```typescript
 * const details = await client.getMedia(refOrId(item));
 * const page = await client.getPage(refOrId(navigationTile));
 * ```
 *
 * Navigation and provider tiles are keyed by the page they open rather than by
 * their own id, and this picks the right one — so the same call works for every
 * kind of item a row can contain.
 */
export function refOrId(item: { ref?: string | null; pageId?: string | null; id: string }): string {
	return item.ref ?? item.pageId ?? item.id;
}

/**
 * The plain id behind a `ref`, or the id itself if that's what you were given.
 *
 * Pass the `ref` to anything your user does or any screen they move to. But
 * when all you're holding is that one string — a navigation argument, a saved
 * "recently viewed" list — and you need the title's id for a cache key, a
 * shareable URL, or a log line, this gets it back:
 *
 * ```typescript
 * idOf("MV_550@…"); // "MV_550"
 * idOf("MV_550"); // "MV_550"
 * ```
 */
export function idOf(refOrId: string): string {
	const at = refOrId.indexOf("@");
	return at < 0 ? refOrId : refOrId.slice(0, at);
}
