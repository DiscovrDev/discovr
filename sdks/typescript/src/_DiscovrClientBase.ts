// AUTO-GENERATED — do not edit.
// prettier-ignore

import type {
  AvatarMediaType,
  CreatePageResponse,
  CreateProfileResponse,
  DeleteProfileResponse,
  DemoSessionResponse,
  DeviceCodeResponse,
  FilterSpec,
  GetProfilesResponse,
  GetRowItemsResponse,
  GetRowsResponse,
  GifSearchResponse,
  HistoryListResponse,
  MediaAssetsResponse,
  MediaProfileMeta,
  MediaResponse,
  Page,
  PlaybackListResponse,
  PollDeviceCode200Response,
  Profile,
  ProfileImagesResponse,
  RefreshTokenResponse,
  Row,
  ScrobbleResponse,
  ScrobbleSkipResponse,
  ScrobbleTv,
  SearchResponse,
  SeasonDetailsResponse,
  SeasonProfileMeta,
  SessionTokenResponse,
  SignOutSession200Response,
  SimilarResponse,
  SimpleListResponse,
  SuccessMessage
} from './models/index';
import type { _DiscovrAuth } from './auth';
import type { _DiscovrCache } from './_DiscovrCache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class _DiscovrClientBase {
  protected abstract readonly _auth: _DiscovrAuth;
  protected abstract readonly _cache: _DiscovrCache;

  // ── Identity tier — refresh token bearer (/profiles, /auth/sessions) ────────────────────────────────────

  mintSessionToken(profileId: string, options?: { ttlMs?: number; snapshotId?: string }): Promise<SessionTokenResponse> {
    return this._auth.identityApi().mintSessionToken({ profileId, ttlMs: options?.ttlMs, snapshotId: options?.snapshotId });
  }

  signOutSession(): Promise<SignOutSession200Response> {
    return this._auth.identityApi().signOutSession();
  }

  getProfiles(options?: { bypassCache?: boolean }): Promise<GetProfilesResponse> {
    return this._cache.wrap(
      "getProfiles",
      {  },
      undefined,
      options?.bypassCache,
      () => this._auth.identityApi().getProfiles(),
    );
  }

  async createProfile(name: string, avatarUrl: string, options?: { avatarMediaType?: AvatarMediaType }): Promise<CreateProfileResponse> {
    const result = await this._auth.identityApi().createProfile({ name, avatarUrl, avatarMediaType: options?.avatarMediaType });
    this._cache.invalidate(["getProfiles"]);
    return result;
  }

  getProfile(profileId: string, options?: { bypassCache?: boolean }): Promise<Profile> {
    return this._cache.wrap(
      "getProfile",
      { profileId },
      undefined,
      options?.bypassCache,
      () => this._auth.identityApi().getProfile(profileId),
    );
  }

  async updateProfile(profileId: string, options?: { name?: string; avatarUrl?: string; avatarMediaType?: AvatarMediaType }): Promise<Profile> {
    const result = await this._auth.identityApi().updateProfile(profileId, { name: options?.name, avatarUrl: options?.avatarUrl, avatarMediaType: options?.avatarMediaType });
    this._cache.invalidate(["getProfiles","getProfile"]);
    return result;
  }

  async deleteProfile(profileId: string): Promise<DeleteProfileResponse> {
    const result = await this._auth.identityApi().deleteProfile(profileId);
    this._cache.invalidate(["getProfiles","getProfile"]);
    return result;
  }

  // ── Session tier — session token bearer ────────────────────────────────────

  createPage(options?: { pageFilters?: FilterSpec; name?: string; bypassCache?: boolean }): Promise<CreatePageResponse> {
    return this._cache.wrap(
      "createPage",
      { pageFilters: options?.pageFilters, name: options?.name },
      undefined,
      options?.bypassCache,
      () => this._auth.sessionApi().createPage({ pageFilters: options?.pageFilters, name: options?.name }),
    );
  }

  getPage(pageId: string, options?: { bypassCache?: boolean }): Promise<Page> {
    return this._cache.wrap(
      "getPage",
      { pageId },
      undefined,
      options?.bypassCache,
      () => this._auth.sessionApi().getPage(pageId),
    );
  }

  getRows(pageId: string, options?: { nextPageToken?: string; limit?: number; bypassCache?: boolean }): Promise<GetRowsResponse> {
    return this._cache.wrap(
      "getRows",
      { pageId, nextPageToken: options?.nextPageToken, limit: options?.limit },
      undefined,
      options?.bypassCache,
      () => this._auth.sessionApi().getRows(pageId, options?.nextPageToken, options?.limit),
    );
  }

  getRow(pageId: string, rowId: string, options?: { bypassCache?: boolean }): Promise<Row> {
    return this._cache.wrap(
      "getRow",
      { pageId, rowId },
      undefined,
      options?.bypassCache,
      () => this._auth.sessionApi().getRow(pageId, rowId),
    );
  }

  getRowItems(pageId: string, rowId: string, options?: { nextPageToken?: string; limit?: number; bypassCache?: boolean }): Promise<GetRowItemsResponse> {
    return this._cache.wrap(
      "getRowItems",
      { pageId, rowId, nextPageToken: options?.nextPageToken, limit: options?.limit },
      undefined,
      options?.bypassCache,
      () => this._auth.sessionApi().getRowItems(pageId, rowId, options?.nextPageToken, options?.limit),
    );
  }

  getLikedItems(options?: { nextPageToken?: string; limit?: number }): Promise<SimpleListResponse> {
    return this._auth.sessionApi().getLikedItems(options?.nextPageToken, options?.limit);
  }

  addLikedItem(mediaId: string): Promise<SuccessMessage> {
    return this._auth.sessionApi().addLikedItem({ mediaId });
  }

  deleteLikedItem(mediaId: string): Promise<SuccessMessage> {
    return this._auth.sessionApi().deleteLikedItem(mediaId);
  }

  getDislikedItems(options?: { nextPageToken?: string; limit?: number }): Promise<SimpleListResponse> {
    return this._auth.sessionApi().getDislikedItems(options?.nextPageToken, options?.limit);
  }

  addDislikedItem(mediaId: string): Promise<SuccessMessage> {
    return this._auth.sessionApi().addDislikedItem({ mediaId });
  }

  deleteDislikedItem(mediaId: string): Promise<SuccessMessage> {
    return this._auth.sessionApi().deleteDislikedItem(mediaId);
  }

  getSuperLikedItems(options?: { nextPageToken?: string; limit?: number }): Promise<SimpleListResponse> {
    return this._auth.sessionApi().getSuperLikedItems(options?.nextPageToken, options?.limit);
  }

  addSuperLikedItem(mediaId: string): Promise<SuccessMessage> {
    return this._auth.sessionApi().addSuperLikedItem({ mediaId });
  }

  deleteSuperLikedItem(mediaId: string): Promise<SuccessMessage> {
    return this._auth.sessionApi().deleteSuperLikedItem(mediaId);
  }

  getWatchlistItems(options?: { nextPageToken?: string; limit?: number }): Promise<SimpleListResponse> {
    return this._auth.sessionApi().getWatchlistItems(options?.nextPageToken, options?.limit);
  }

  addWatchlistItem(mediaId: string): Promise<SuccessMessage> {
    return this._auth.sessionApi().addWatchlistItem({ mediaId });
  }

  deleteWatchlistItem(mediaId: string): Promise<SuccessMessage> {
    return this._auth.sessionApi().deleteWatchlistItem(mediaId);
  }

  getPlaybackItems(options?: { nextPageToken?: string; limit?: number }): Promise<PlaybackListResponse> {
    return this._auth.sessionApi().getPlaybackItems(options?.nextPageToken, options?.limit);
  }

  addPlaybackItem(mediaId: string, options?: { progress?: number; updatedAt?: Date }): Promise<SuccessMessage> {
    return this._auth.sessionApi().addPlaybackItem({ mediaId, progress: options?.progress, updatedAt: options?.updatedAt });
  }

  updatePlaybackItem(mediaId: string, options?: { progress?: number; updatedAt?: Date }): Promise<SuccessMessage> {
    return this._auth.sessionApi().updatePlaybackItem({ mediaId, progress: options?.progress, updatedAt: options?.updatedAt });
  }

  deletePlaybackItem(mediaId: string): Promise<SuccessMessage> {
    return this._auth.sessionApi().deletePlaybackItem(mediaId);
  }

  markUnwatched(mediaId: string, options?: { season?: number; episode?: number }): Promise<SuccessMessage> {
    return this._auth.sessionApi().markUnwatched(mediaId, options?.season, options?.episode);
  }

  scrobble(mediaId: string, progress: number, options?: { tv?: ScrobbleTv }): Promise<ScrobbleResponse> {
    return this._auth.sessionApi().scrobble(mediaId, { progress, tv: options?.tv });
  }

  scrobbleSkip(mediaId: string, from: number, to: number, duration: number, options?: { tv?: ScrobbleTv }): Promise<ScrobbleSkipResponse> {
    return this._auth.sessionApi().scrobbleSkip(mediaId, { from, to, duration, tv: options?.tv });
  }

  getHistoryItems(options?: { nextPageToken?: string; limit?: number }): Promise<HistoryListResponse> {
    return this._auth.sessionApi().getHistoryItems(options?.nextPageToken, options?.limit);
  }

  addHistoryItem(mediaId: string, options?: { updatedAt?: Date; progress?: number; season?: number; episode?: number; imported?: string }): Promise<SuccessMessage> {
    return this._auth.sessionApi().addHistoryItem({ mediaId, updatedAt: options?.updatedAt, progress: options?.progress, season: options?.season, episode: options?.episode, imported: options?.imported });
  }

  getHistoryItemsByMediaId(mediaId: string, options?: { season?: number; episode?: number; nextPageToken?: string; limit?: number }): Promise<HistoryListResponse> {
    return this._auth.sessionApi().getHistoryItemsByMediaId(mediaId, options?.season, options?.episode, options?.nextPageToken, options?.limit);
  }

  patchHistoryItem(mediaId: string, progress: number, options?: { season?: number; episode?: number }): Promise<SuccessMessage> {
    return this._auth.sessionApi().patchHistoryItem(mediaId, { progress }, options?.season, options?.episode);
  }

  deleteHistoryItem(mediaId: string, options?: { season?: number; episode?: number }): Promise<SuccessMessage> {
    return this._auth.sessionApi().deleteHistoryItem(mediaId, options?.season, options?.episode);
  }

  getMediaProfileMeta(mediaId: string, options?: { providers?: boolean }): Promise<MediaProfileMeta> {
    return this._auth.sessionApi().getMediaProfileMeta(mediaId, options?.providers);
  }

  getSeasonProfileMeta(mediaId: string, seasonNumber: number): Promise<SeasonProfileMeta> {
    return this._auth.sessionApi().getSeasonProfileMeta(mediaId, seasonNumber);
  }

  searchMedia(options?: { query?: string; q?: string; page?: number; bypassCache?: boolean }): Promise<SearchResponse> {
    return this._cache.wrap(
      "searchMedia",
      { query: options?.query, q: options?.q, page: options?.page },
      3600000,
      options?.bypassCache,
      () => this._auth.sessionApi().searchMedia(options?.query, options?.q, options?.page),
    );
  }

  // ── Public endpoints — no bearer required ────────────────────────────────────

  requestDeviceCode(clientID: string, options?: { demo?: boolean; size?: number; format?: string }): Promise<DeviceCodeResponse> {
    return this._auth.publicApi().requestDeviceCode({ clientID, demo: options?.demo }, options?.size, options?.format as any);
  }

  pollDeviceCode(deviceCode: string, options?: { deviceId?: string }): Promise<PollDeviceCode200Response> {
    return this._auth.publicApi().pollDeviceCode(deviceCode, { deviceId: options?.deviceId });
  }

  authorizeClientWeb(clientID: string, state: string, codeChallenge: string, codeChallengeMethod: string, options?: { redirectURL?: string; platform?: string }): Promise<void> {
    return this._auth.publicApi().authorizeClientWeb(clientID, state, codeChallenge, codeChallengeMethod as any, options?.redirectURL, options?.platform as any);
  }

  exchangeWebAuthCode(clientID: string, code: string, codeVerifier: string, options?: { deviceId?: string }): Promise<RefreshTokenResponse> {
    return this._auth.publicApi().exchangeWebAuthCode({ clientID, code, codeVerifier, deviceId: options?.deviceId });
  }

  startDemoSession(clientId: string, options?: { ttlMs?: number }): Promise<DemoSessionResponse> {
    return this._auth.publicApi().startDemoSession({ clientId, ttlMs: options?.ttlMs });
  }

  getMedia(mediaId: string, options?: { bypassCache?: boolean }): Promise<MediaResponse> {
    return this._cache.wrap(
      "getMedia",
      { mediaId },
      undefined,
      options?.bypassCache,
      () => this._auth.publicApi().getMedia(mediaId),
    );
  }

  getMediaAssets(mediaId: string, options?: { bypassCache?: boolean }): Promise<MediaAssetsResponse> {
    return this._cache.wrap(
      "getMediaAssets",
      { mediaId },
      undefined,
      options?.bypassCache,
      () => this._auth.publicApi().getMediaAssets(mediaId),
    );
  }

  getSeasonDetails(mediaId: string, seasonNumber: number, options?: { language?: string; bypassCache?: boolean }): Promise<SeasonDetailsResponse> {
    return this._cache.wrap(
      "getSeasonDetails",
      { mediaId, seasonNumber, language: options?.language },
      undefined,
      options?.bypassCache,
      () => this._auth.publicApi().getSeasonDetails(mediaId, seasonNumber, options?.language),
    );
  }

  getSimilarRecommendations(mediaId: string, options?: { language?: string; page?: number; bypassCache?: boolean }): Promise<SimilarResponse> {
    return this._cache.wrap(
      "getSimilarRecommendations",
      { mediaId, language: options?.language, page: options?.page },
      3600000,
      options?.bypassCache,
      () => this._auth.publicApi().getSimilarRecommendations(mediaId, options?.language, options?.page),
    );
  }

  getProfileImages(options?: { limit?: number; pageToken?: string; bypassCache?: boolean }): Promise<ProfileImagesResponse> {
    return this._cache.wrap(
      "getProfileImages",
      { limit: options?.limit, pageToken: options?.pageToken },
      undefined,
      options?.bypassCache,
      () => this._auth.publicApi().getProfileImages(options?.limit, options?.pageToken),
    );
  }

  searchGifs(q: string, options?: { limit?: number; pos?: string; contentfilter?: string; country?: string; locale?: string; bypassCache?: boolean }): Promise<GifSearchResponse> {
    return this._cache.wrap(
      "searchGifs",
      { q, limit: options?.limit, pos: options?.pos, contentfilter: options?.contentfilter, country: options?.country, locale: options?.locale },
      3600000,
      options?.bypassCache,
      () => this._auth.publicApi().searchGifs(q, options?.limit, options?.pos, options?.contentfilter as any, options?.country, options?.locale),
    );
  }

}