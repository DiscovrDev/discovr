# DiscovrApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addDislikedItem**](DiscovrApi.md#adddislikeditem) | **POST** /profile/disliked | Add an item to disliked list |
| [**addHistoryItem**](DiscovrApi.md#addhistoryitem) | **POST** /profile/history | Add an item to history list |
| [**addLikedItem**](DiscovrApi.md#addlikeditem) | **POST** /profile/liked | Add an item to liked list |
| [**addPlaybackItem**](DiscovrApi.md#addplaybackitem) | **POST** /profile/playback | Add an item to playback list |
| [**addSuperLikedItem**](DiscovrApi.md#addsuperlikeditem) | **POST** /profile/super_liked | Add an item to the super-liked list |
| [**addWatchlistItem**](DiscovrApi.md#addwatchlistitem) | **POST** /profile/watchlist | Add an item to watchlist |
| [**authorizeClientWeb**](DiscovrApi.md#authorizeclientweb) | **GET** /auth/web/authorize | Redirect to web authentication |
| [**createPage**](DiscovrApi.md#createpage) | **POST** /pages | Create a recommendation page |
| [**createProfile**](DiscovrApi.md#createprofile) | **POST** /profiles | Create a profile |
| [**deleteDislikedItem**](DiscovrApi.md#deletedislikeditem) | **DELETE** /profile/disliked/{mediaId} | Delete an item from disliked list |
| [**deleteHistoryItem**](DiscovrApi.md#deletehistoryitem) | **DELETE** /profile/history/{mediaId} | Delete an item from history list |
| [**deleteLikedItem**](DiscovrApi.md#deletelikeditem) | **DELETE** /profile/liked/{mediaId} | Delete an item from liked list |
| [**deletePlaybackItem**](DiscovrApi.md#deleteplaybackitem) | **DELETE** /profile/playback/{mediaId} | Delete an item from playback list |
| [**deleteProfile**](DiscovrApi.md#deleteprofile) | **DELETE** /profiles/{profileId} | Delete a profile |
| [**deleteSuperLikedItem**](DiscovrApi.md#deletesuperlikeditem) | **DELETE** /profile/super_liked/{mediaId} | Delete an item from the super-liked list |
| [**deleteWatchlistItem**](DiscovrApi.md#deletewatchlistitem) | **DELETE** /profile/watchlist/{mediaId} | Delete an item from watchlist |
| [**exchangeWebAuthCode**](DiscovrApi.md#exchangewebauthcode) | **POST** /auth/web/token | Redeem a web sign-in code |
| [**getDislikedItems**](DiscovrApi.md#getdislikeditems) | **GET** /profile/disliked | Get disliked items |
| [**getHistoryItems**](DiscovrApi.md#gethistoryitems) | **GET** /profile/history | Get history items |
| [**getHistoryItemsByMediaId**](DiscovrApi.md#gethistoryitemsbymediaid) | **GET** /profile/history/{mediaId} | Get history items for a specific media |
| [**getLikedItems**](DiscovrApi.md#getlikeditems) | **GET** /profile/liked | Get liked items |
| [**getMedia**](DiscovrApi.md#getmedia) | **GET** /media/{mediaId} | Get media details |
| [**getMediaAssets**](DiscovrApi.md#getmediaassets) | **GET** /media/{mediaId}/assets | Get media assets |
| [**getMediaProfileMeta**](DiscovrApi.md#getmediaprofilemeta) | **GET** /media/{mediaId}/profile_meta | Get profile interaction data for a title |
| [**getPage**](DiscovrApi.md#getpage) | **GET** /pages/{pageId} | Get a page |
| [**getPlaybackItems**](DiscovrApi.md#getplaybackitems) | **GET** /profile/playback | Get playback items |
| [**getProfile**](DiscovrApi.md#getprofile) | **GET** /profiles/{profileId} | Get a profile |
| [**getProfileImages**](DiscovrApi.md#getprofileimages) | **GET** /profile-images | List avatar images |
| [**getProfiles**](DiscovrApi.md#getprofiles) | **GET** /profiles | List profiles |
| [**getRow**](DiscovrApi.md#getrow) | **GET** /pages/{pageId}/rows/{rowId} | Get a row |
| [**getRowItems**](DiscovrApi.md#getrowitems) | **GET** /pages/{pageId}/rows/{rowId}/items | List row items |
| [**getRows**](DiscovrApi.md#getrows) | **GET** /pages/{pageId}/rows | List rows |
| [**getSeasonDetails**](DiscovrApi.md#getseasondetails) | **GET** /media/{mediaId}/seasons/{seasonNumber} | Get TV season details |
| [**getSeasonProfileMeta**](DiscovrApi.md#getseasonprofilemeta) | **GET** /media/{mediaId}/seasons/{seasonNumber}/meta | Get which episodes of a TV season are finished |
| [**getSimilarRecommendations**](DiscovrApi.md#getsimilarrecommendations) | **GET** /media/{mediaId}/similar | Get similar titles |
| [**getSuperLikedItems**](DiscovrApi.md#getsuperlikeditems) | **GET** /profile/super_liked | Get super-liked items |
| [**getWatchlistItems**](DiscovrApi.md#getwatchlistitems) | **GET** /profile/watchlist | Get watchlist items |
| [**markUnwatched**](DiscovrApi.md#markunwatched) | **DELETE** /profile/watched/{mediaId} | Mark a title as unwatched |
| [**mintSessionToken**](DiscovrApi.md#mintsessiontoken) | **POST** /auth/session-token | Mint a session token |
| [**patchHistoryItem**](DiscovrApi.md#patchhistoryitem) | **PATCH** /profile/history/{mediaId} | Update or create a history item |
| [**pollDeviceCode**](DiscovrApi.md#polldevicecode) | **POST** /auth/device-codes/{deviceCode}/poll | Poll for auth token |
| [**requestDeviceCode**](DiscovrApi.md#requestdevicecode) | **POST** /auth/device-codes | Request device code |
| [**scrobble**](DiscovrApi.md#scrobble) | **POST** /profile/scrobble/{mediaId} | Record playback progress |
| [**scrobbleSkip**](DiscovrApi.md#scrobbleskip) | **POST** /profile/scrobble/{mediaId}/skip | Record a skip event |
| [**searchGifs**](DiscovrApi.md#searchgifs) | **GET** /gif-search | Search GIFs |
| [**searchMedia**](DiscovrApi.md#searchmedia) | **GET** /search | Search media |
| [**signOutSession**](DiscovrApi.md#signoutsession) | **DELETE** /auth/session | Sign out the current device |
| [**startDemoSession**](DiscovrApi.md#startdemosession) | **POST** /auth/demo-session | Start a demo session |
| [**updatePlaybackItem**](DiscovrApi.md#updateplaybackitem) | **PATCH** /profile/playback | Update playback progress |
| [**updateProfile**](DiscovrApi.md#updateprofile) | **PATCH** /profiles/{profileId} | Update a profile |



## addDislikedItem

> SuccessMessage addDislikedItem(addSimpleListItemPayload)

Add an item to disliked list

Adds a title to the disliked list.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Liked, disliked, and super-liked are exclusive — disliking something automatically removes any existing like or super-like for the same title.  Returns &#x60;201&#x60; if the item was newly added, &#x60;200&#x60; if it was already disliked. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.addDislikedItem(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **addSimpleListItemPayload** | [AddSimpleListItemPayload](AddSimpleListItemPayload.md) |  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Item was already disliked — no change made. |  -  |
| **201** | Item added to disliked list. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## addHistoryItem

> SuccessMessage addHistoryItem(addHistoryPayload)

Add an item to history list

Records a watch history entry. Unlike other lists, history allows multiple entries for the same title — each completed viewing is tracked separately.  - &#x60;mediaId&#x60;: the title to record. Use &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows. - &#x60;progress&#x60;: how far through the title the user watched, as a percentage (0–100). Optional. - &#x60;updatedAt&#x60;: the ISO 8601 timestamp of when the viewing was recorded. Defaults to now if omitted.  **TV Shows:** Include &#x60;season&#x60; (required for TV shows) and optionally &#x60;episode&#x60; to track per-episode history. Omitting &#x60;episode&#x60; records a season-level entry — clients can use this to mark all episodes in a season as watched in a single call. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.addHistoryItem(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **addHistoryPayload** | [AddHistoryPayload](AddHistoryPayload.md) |  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Item added successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## addLikedItem

> SuccessMessage addLikedItem(addSimpleListItemPayload)

Add an item to liked list

Adds a title to the liked list.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Liked, disliked, and super-liked are exclusive — liking something automatically removes any existing dislike or super-like for the same title.  Returns &#x60;201&#x60; if the item was newly added, &#x60;200&#x60; if it was already liked. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.addLikedItem(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **addSimpleListItemPayload** | [AddSimpleListItemPayload](AddSimpleListItemPayload.md) |  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Item was already liked — no change made. |  -  |
| **201** | Item added to liked list. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## addPlaybackItem

> SuccessMessage addPlaybackItem(addPlaybackPayload)

Add an item to playback list

Records a new playback position for a title. If the title is already being tracked, returns 409 — use PATCH to update an existing entry.  - &#x60;mediaId&#x60;: the title to track. Use &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;). - &#x60;progress&#x60;: how far through the title the user is, as a percentage (0–100). Optional — omit if you don\&#39;t have a position yet. - &#x60;updatedAt&#x60;: the ISO 8601 timestamp of when this progress was recorded. Defaults to now. Send the actual client time so resume positions stay accurate if the user is offline. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.addPlaybackItem(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **addPlaybackPayload** | [AddPlaybackPayload](AddPlaybackPayload.md) |  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Item added successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## addSuperLikedItem

> SuccessMessage addSuperLikedItem(addSimpleListItemPayload)

Add an item to the super-liked list

Adds a title to the super-liked list.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Super-liking a title says the viewer loves it. Like the liked list, adding a super-like automatically removes any existing dislike or like for the same title.  Returns &#x60;201&#x60; if the item was newly added, &#x60;200&#x60; if it was already super-liked. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.addSuperLikedItem(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **addSimpleListItemPayload** | [AddSimpleListItemPayload](AddSimpleListItemPayload.md) |  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Item was already super-liked — no change made. |  -  |
| **201** | Item added to super-liked list. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## addWatchlistItem

> SuccessMessage addWatchlistItem(addSimpleListItemPayload)

Add an item to watchlist

Adds a title to the watchlist.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Unlike liked/disliked/super-liked, the watchlist is non-exclusive — you can watchlist something regardless of how it\&#39;s rated. Titles are automatically removed from the watchlist when the user starts watching via &#x60;scrobble&#x60;. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.addWatchlistItem(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **addSimpleListItemPayload** | [AddSimpleListItemPayload](AddSimpleListItemPayload.md) |  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Item added to watchlist. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authorizeClientWeb

> authorizeClientWeb(clientID, state, codeChallenge, codeChallengeMethod, redirectURL, platform)

Redirect to web authentication

Starts a web sign-in: sends the user\&#39;s browser to the Discovr page where they sign in and approve your app. After they do, Discovr hands your app a short-lived, single-use **authorization code** (never the long-lived credential), and your app trades it for a refresh token with &#x60;POST /auth/web/token&#x60;. This is the OAuth authorization code flow with PKCE, so the SDKs do all of it for you.  - **&#x60;clientID&#x60;** — your registered app ID, so Discovr knows which app is requesting access. - **&#x60;state&#x60;** — your app\&#39;s CSRF token. Discovr echoes it back unchanged so you can verify the response came from Discovr and not a third party. - **&#x60;codeChallenge&#x60;** / **&#x60;codeChallengeMethod&#x60;** — &#x60;base64url(SHA-256(verifier))&#x60; of a random &#x60;codeVerifier&#x60; you keep, and &#x60;S256&#x60;. Required on every request. - **&#x60;redirectURL&#x60;** — where to send the user after sign-in; it must be registered for your client. For a popup, send &#x60;openerOrigin&#x60; instead (the SDK does).  **What your app receives.** On your &#x60;redirectURL&#x60; as query parameters, or as a &#x60;postMessage&#x60; to the popup\&#39;s opener: &#x60;{ code, state }&#x60; on success, or &#x60;{ error, state }&#x60; when the person cancels (&#x60;authorization-cancelled&#x60;) or sign-in cannot complete. &#x60;error&#x60; is one of the codes in &#x60;ApiError&#x60;. Check &#x60;state&#x60; first, then redeem &#x60;code&#x60; with your &#x60;codeVerifier&#x60;. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  const result = await client.authorizeClientWeb(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **clientID** | `string` | The client ID of the third-party application | [Defaults to `undefined`] |
| **state** | `string` | Opaque value to prevent CSRF; echoed back in the callback response. 16 to 256 URL-safe characters (&#x60;A-Z a-z 0-9 - _&#x60;); 32 random bytes, hex-encoded, is 64.  | [Defaults to `undefined`] |
| **codeChallenge** | `string` | &#x60;base64url(SHA-256(codeVerifier))&#x60;, 43 characters. Generate a fresh random &#x60;codeVerifier&#x60; per sign-in and keep it; you send it to &#x60;POST /auth/web/token&#x60; when you redeem the code.  | [Defaults to `undefined`] |
| **codeChallengeMethod** | `S256` | Always &#x60;S256&#x60;. &#x60;plain&#x60; is not accepted. | [Defaults to `undefined`] [Enum: S256] |
| **redirectURL** | `string` | Optional custom redirect URL. If omitted, redirects to the hosted callback page at  https://auth.discovr.media/callback.html which handles token exchange via postMessage  for web popup flows or deep links for mobile apps. Must be URL encoded when provided.  | [Optional] [Defaults to `undefined`] |
| **platform** | `web`, `mobile`, `tv` | Optional platform hint (web popup, mobile deep link, etc.). Not currently used.  | [Optional] [Defaults to `undefined`] [Enum: web, mobile, tv] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful operation (Documentation only). In practice, this endpoint always redirects (302).  |  -  |
| **302** | Redirect to authentication page |  * Location - The authentication URL <br>  |
| **400** | Bad request — missing, invalid, or unregistered query parameters |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createPage

> CreatePageResponse createPage(createPagePayload)

Create a recommendation page

Resolves a set of filters to the page that represents them.  A page\&#39;s ID is determined by its filters alone, so the same filters always return the same ID — for every profile, on every device, indefinitely. Call this once and keep the ID.  Creating pages up front for your top-level tabs is cheap.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.createPage(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **createPagePayload** | [CreatePagePayload](CreatePagePayload.md) |  | [Optional] |

### Return type

[**CreatePageResponse**](CreatePageResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Page created successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createProfile

> CreateProfileResponse createProfile(createProfilePayload)

Create a profile

Creates a new profile for the signed-in user. Provide a display name and an avatar URL.  On success you\&#39;ll get back a &#x60;profileId&#x60;. Use that ID with &#x60;POST /auth/session-token&#x60; to mint a session token and start browsing recommendations for this profile. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.createProfile(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **createProfilePayload** | [CreateProfilePayload](CreateProfilePayload.md) |  | |

### Return type

[**CreateProfileResponse**](CreateProfileResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Profile created. The response contains the new profile\&#39;s ID. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteDislikedItem

> SuccessMessage deleteDislikedItem(mediaId)

Delete an item from disliked list

Removes a title from the disliked list. Pass the full media ID (e.g., &#x60;MV_550&#x60; for a movie, &#x60;TV_1396&#x60; for a TV show). 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.deleteDislikedItem(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | Full media ID — &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Item deleted successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteHistoryItem

> SuccessMessage deleteHistoryItem(mediaId, season, episode)

Delete an item from history list

Deletes history entries for a title. Because history allows duplicates, this removes all matching entries for the specified media (and episode, if provided).  For TV shows, pass &#x60;season&#x60; as a query parameter (required) and optionally &#x60;episode&#x60;. Include &#x60;episode&#x60; to delete that episode\&#39;s entries. Omit it to delete the entries that were recorded for the season as a whole, without an episode (for example, marking a season watched in one go); entries for individual episodes are kept.  To take a title back to unwatched, use [&#x60;DELETE /profile/watched/{mediaId}&#x60;](/api-reference/discovr/mark-unwatched) instead. This call removes history entries and nothing else: it doesn\&#39;t touch the in-progress list, and a TV show\&#39;s &#x60;completed&#x60; state is brought up to date from whatever history is left. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.deleteHistoryItem(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The media ID of the title to delete. Format: &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows.  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |
| **season** | `number` | Season number. Required for TV shows (&#x60;TV_&#x60; mediaId); ignored for movies. | [Optional] [Defaults to `undefined`] |
| **episode** | `number` | Episode number. Optional — omit to delete the season-level entries (those recorded without an episode); include to delete a specific episode\&#39;s entries only. | [Optional] [Defaults to `undefined`] |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Item deleted successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteLikedItem

> SuccessMessage deleteLikedItem(mediaId)

Delete an item from liked list

Removes a title from the liked list. Pass the full media ID (e.g., &#x60;MV_550&#x60; for a movie, &#x60;TV_1396&#x60; for a TV show). 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.deleteLikedItem(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | Full media ID — &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Item deleted successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deletePlaybackItem

> SuccessMessage deletePlaybackItem(mediaId)

Delete an item from playback list

Removes a title from the in-progress list. Use &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;). 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.deletePlaybackItem(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The media ID of the title to remove. Format: &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows.  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Item deleted successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteProfile

> DeleteProfileResponse deleteProfile(profileId)

Delete a profile

Permanently deletes the profile. This action can\&#39;t be undone.  Deleting an account\&#39;s only profile is allowed. The account then has no profiles and can\&#39;t mint a session token until a new one is created — see [Handle zero profiles](/guides/profiles/listing-and-selecting-profiles). Returns 404 if the profile doesn\&#39;t exist or doesn\&#39;t belong to the signed-in user. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.deleteProfile(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **profileId** | `string` | The ID of the profile to delete. | [Defaults to `undefined`] |

### Return type

[**DeleteProfileResponse**](DeleteProfileResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Profile deleted. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteSuperLikedItem

> SuccessMessage deleteSuperLikedItem(mediaId)

Delete an item from the super-liked list

Removes a title from the super-liked list. Pass the full media ID (e.g., &#x60;MV_550&#x60; for a movie, &#x60;TV_1396&#x60; for a TV show). 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.deleteSuperLikedItem(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | Full media ID — &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Item deleted successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteWatchlistItem

> SuccessMessage deleteWatchlistItem(mediaId)

Delete an item from watchlist

Removes a title from the watchlist. Pass the full media ID (e.g., &#x60;MV_550&#x60; for a movie, &#x60;TV_1396&#x60; for a TV show). 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.deleteWatchlistItem(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | Full media ID — &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Item deleted successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## exchangeWebAuthCode

> RefreshTokenResponse exchangeWebAuthCode(webTokenPayload)

Redeem a web sign-in code

The last step of a web sign-in. Trade the authorization code Discovr delivered to your app, together with the &#x60;codeVerifier&#x60; you generated when you started, for the refresh token. The SDKs call this for you.  The code is single-use and lives 60 seconds. A request with a wrong &#x60;codeVerifier&#x60; fails **and spends the code**, so whoever intercepted it gets one try, not unlimited guesses. The refresh token comes back in this response only — it is never in a URL or a &#x60;postMessage&#x60;. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  const result = await client.exchangeWebAuthCode(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **webTokenPayload** | [WebTokenPayload](WebTokenPayload.md) |  | |

### Return type

[**RefreshTokenResponse**](RefreshTokenResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Code redeemed — your credential. |  -  |
| **400** | A required field is missing, or the code or verifier is malformed. |  -  |
| **401** | The code cannot be redeemed. The &#x60;error&#x60; field is a machine-readable code, and every failed attempt spends the code, so start a new sign-in rather than retrying.  |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getDislikedItems

> SimpleListResponse getDislikedItems(nextPageToken, limit)

Get disliked items

Returns the disliked list for a specific profile.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Items are ordered newest-first and support cursor-based pagination via &#x60;nextPageToken&#x60;.  **Pagination:** - Pass &#x60;nextPageToken&#x60; from a previous response to fetch the next page. - If &#x60;hasMore&#x60; is &#x60;true&#x60;, there are more items available.  **Exclusive lists:** Liked, disliked, and super-liked are mutually exclusive — a title can only be in one of those lists at a time. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.getDislikedItems(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **nextPageToken** | `string` | Opaque token from previous page for pagination | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | Maximum number of items to return (1-50, default: 10) | [Optional] [Defaults to `10`] |

### Return type

[**SimpleListResponse**](SimpleListResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of disliked items retrieved successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getHistoryItems

> HistoryListResponse getHistoryItems(nextPageToken, limit)

Get history items

Returns the profile\&#39;s full watch history, newest entries first.  History allows multiple entries for the same title — every completed viewing is tracked separately, so you may see the same &#x60;mediaId&#x60; more than once.  **Pagination:** Pass &#x60;nextPageToken&#x60; from the previous response to fetch the next page. If &#x60;hasMore&#x60; is &#x60;true&#x60;, more items are available. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.getHistoryItems(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **nextPageToken** | `string` | Opaque token from previous page for pagination | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | Maximum number of items to return (1-50, default: 10) | [Optional] [Defaults to `10`] |

### Return type

[**HistoryListResponse**](HistoryListResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of history items retrieved successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getHistoryItemsByMediaId

> HistoryListResponse getHistoryItemsByMediaId(mediaId, season, episode, nextPageToken, limit)

Get history items for a specific media

Returns history entries for a specific title. Newest entries first.  For TV shows, pass &#x60;season&#x60; as a query parameter (required) and optionally &#x60;episode&#x60; to filter by episode. Omitting &#x60;episode&#x60; returns all entries for the whole season.  **Pagination:** Pass &#x60;nextPageToken&#x60; from the previous response to fetch the next page. If &#x60;hasMore&#x60; is &#x60;true&#x60;, more items are available. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.getHistoryItemsByMediaId(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The media ID of the title. Format: &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows.  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |
| **season** | `number` | Season number. Required for TV shows (&#x60;TV_&#x60; mediaId); ignored for movies. | [Optional] [Defaults to `undefined`] |
| **episode** | `number` | Episode number. Optional — omit to return all entries for the season; include to filter to a specific episode. | [Optional] [Defaults to `undefined`] |
| **nextPageToken** | `string` | Opaque token from previous page for pagination | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | Maximum number of items to return (1-50, default: 10) | [Optional] [Defaults to `10`] |

### Return type

[**HistoryListResponse**](HistoryListResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of history items retrieved successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getLikedItems

> SimpleListResponse getLikedItems(nextPageToken, limit)

Get liked items

Returns the liked list for a specific profile.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Items are ordered newest-first and support cursor-based pagination via &#x60;nextPageToken&#x60;.  **Pagination:** - Pass &#x60;nextPageToken&#x60; from a previous response to fetch the next page. - If &#x60;hasMore&#x60; is &#x60;true&#x60;, there are more items available.  **Exclusive lists:** Liked, disliked, and super-liked are mutually exclusive — a title can only be in one of those lists at a time. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.getLikedItems(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **nextPageToken** | `string` | Opaque token from previous page for pagination | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | Maximum number of items to return (1-50, default: 10) | [Optional] [Defaults to `10`] |

### Return type

[**SimpleListResponse**](SimpleListResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of liked items retrieved successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getMedia

> MediaResponse getMedia(mediaId)

Get media details

Returns full details for a movie or TV show — title, overview, genres, release date, runtime, cast, crew, watch providers, and more. Pass &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  This is a public endpoint — no authentication required. Returns only generic catalog metadata; personalized fields live under &#x60;profile_meta&#x60;. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  const result = await client.getMedia(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The unique identifier of the media item. Use &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |

### Return type

[**MediaResponse**](MediaResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Full media details returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getMediaAssets

> MediaAssetsResponse getMediaAssets(mediaId)

Get media assets

Returns the best-available poster, backdrop, logo, and trailer for a title — one resolved URL per asset type. Uses English/language-neutral preference for images, and picks the best official trailer when one is available.  This is a public endpoint — no authentication required. Returns only generic catalog metadata. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  const result = await client.getMediaAssets(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The unique identifier of the media item. Use &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |

### Return type

[**MediaAssetsResponse**](MediaAssetsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Media assets returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getMediaProfileMeta

> MediaProfileMeta getMediaProfileMeta(mediaId, providers)

Get profile interaction data for a title

Returns the current profile\&#39;s interaction data for a title — everything you need to render the right UI state for that title.  Response includes: - **List status**: whether the title is liked, disliked, super-liked, watchlisted, or in watch history (&#x60;true&#x60;/&#x60;false&#x60; for each). - **Playback**: whether the title has a saved position, and the position details (progress 0–100, updated timestamp, season/episode for TV shows). - **Providers** *(optional)*: the streaming services where this title is available for the profile\&#39;s selected region. Pass &#x60;providers&#x3D;true&#x60; to include this. - **Completion**: whether the profile has finished this title (&#x60;completed&#x60;), and for TV shows, which season numbers are fully watched (&#x60;completedSeasons&#x60;).  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.getMediaProfileMeta(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The unique identifier of the media item. Use &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |
| **providers** | `boolean` | Set to &#x60;true&#x60; to include streaming provider availability in the response. | [Optional] [Defaults to `false`] |

### Return type

[**MediaProfileMeta**](MediaProfileMeta.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Profile interaction data returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPage

> Page getPage(pageId)

Get a page

Returns a page and its metadata.  Page IDs are stable and permanent. The same ID keeps working across sessions, profiles and devices, so it\&#39;s safe in a URL, a bookmark or a deep link.  What changes is the content: recommendations refresh roughly every 30 minutes, and after they do this returns the same page with re-ranked rows. There\&#39;s nothing to handle — no error, no ID to swap.  **Auth tier:** session. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.getPage(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **pageId** | `string` | The page to retrieve. Accepts either a page id or the &#x60;ref&#x60; from the navigation or provider tile you\&#39;re opening — both resolve to the same page.  | [Defaults to `undefined`] |

### Return type

[**Page**](Page.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Page retrieved successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPlaybackItems

> PlaybackListResponse getPlaybackItems(nextPageToken, limit)

Get playback items

Returns the profile\&#39;s in-progress titles — everything with a saved playback position. Ordered by most recently updated. Use this to build a \&quot;Continue Watching\&quot; row.  Each item includes a &#x60;progress&#x60; field (0–100) showing how far through the title the user is.  **Pagination:** Pass &#x60;nextPageToken&#x60; from the previous response to fetch the next page. If &#x60;hasMore&#x60; is &#x60;true&#x60;, more items are available. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.getPlaybackItems(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **nextPageToken** | `string` | Opaque token from previous page for pagination | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | Maximum number of items to return (1-50, default: 10) | [Optional] [Defaults to `10`] |

### Return type

[**PlaybackListResponse**](PlaybackListResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of playback items retrieved successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getProfile

> Profile getProfile(profileId)

Get a profile

Returns a single profile by ID. Returns 404 if the profile doesn\&#39;t exist or doesn\&#39;t belong to the signed-in user. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.getProfile(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **profileId** | `string` | The ID of the profile to retrieve. | [Defaults to `undefined`] |

### Return type

[**Profile**](Profile.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Profile returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getProfileImages

> ProfileImagesResponse getProfileImages(limit, pageToken)

List avatar images

Returns publicly available avatar images for use in profile setup. Paginated — pass &#x60;nextToken&#x60; from the previous response as &#x60;pageToken&#x60; to load more. These are curated still images.  No authentication required. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  const result = await client.getProfileImages(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` | Maximum number of images to return (1–50). | [Optional] [Defaults to `16`] |
| **pageToken** | `string` | Pagination cursor from the &#x60;nextToken&#x60; field of the previous response. Omit to start from the beginning. | [Optional] [Defaults to `undefined`] |

### Return type

[**ProfileImagesResponse**](ProfileImagesResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Avatar images returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getProfiles

> GetProfilesResponse getProfiles()

List profiles

Returns the signed-in user\&#39;s profiles, newest first. Each one carries its ID, display name, avatar URL, and creation timestamp.  A profile that can\&#39;t be read is left out of the response rather than failing it, so a single bad profile never costs the user their whole picker. Treat the list as complete for display purposes, and don\&#39;t assume a missing profile means it was deleted.  **Auth tier:** identity — send your refresh token in the &#x60;Authorization: Bearer&#x60; header. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.getProfiles(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**GetProfilesResponse**](GetProfilesResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Profiles returned successfully |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getRow

> Row getRow(pageId, rowId)

Get a row

Returns metadata for a specific row.  A row ID keeps resolving after recommendations refresh, so a rail the user has already opened stays usable. It\&#39;s only readable by the profile it was built for.  **Auth tier:** session. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.getRow(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **pageId** | `string` | The unique identifier of the page | [Defaults to `undefined`] |
| **rowId** | `string` | The unique identifier of the row | [Defaults to `undefined`] |

### Return type

[**Row**](Row.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Row retrieved successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **409** | Your pagination cursor or row reference points at a set of results that has since been replaced. The page itself is fine and its ID is still valid — start its pagination again from the beginning.  |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getRowItems

> GetRowItemsResponse getRowItems(pageId, rowId, nextPageToken, limit)

List row items

Returns paginated items within a row. Items include the full display metadata needed to render a media card — title, poster, backdrop, type, and more.  Row IDs stay valid across a recommendations refresh, so a user can finish scrolling a rail they\&#39;ve already opened.  **Auth tier:** session. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.getRowItems(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **pageId** | `string` | The unique identifier of the page | [Defaults to `undefined`] |
| **rowId** | `string` | The unique identifier of the row | [Defaults to `undefined`] |
| **nextPageToken** | `string` | Opaque pagination token returned from the previous page | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | Maximum number of items to return | [Optional] [Defaults to `10`] |

### Return type

[**GetRowItemsResponse**](GetRowItemsResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of row items retrieved successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **409** | Your pagination cursor or row reference points at a set of results that has since been replaced. The page itself is fine and its ID is still valid — start its pagination again from the beginning.  |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getRows

> GetRowsResponse getRows(pageId, nextPageToken, limit)

List rows

Returns paginated rows for a page. Each row is a labeled group of media titles — the building blocks of your recommendation UI.  Row IDs are opaque references — pass them straight back to &#x60;GET /pages/{pageId}/rows/{rowId}/items&#x60;. They keep working even if recommendations refresh while the user is scrolling, so a rail they\&#39;ve already opened stays readable to the end.  Pagination continues in the set of results it started with. Very occasionally that set is no longer available and you\&#39;ll get &#x60;409 CURSOR_EXPIRED&#x60;; restart pagination on the same page ID.  **Auth tier:** session. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.getRows(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **pageId** | `string` | The unique identifier of the page | [Defaults to `undefined`] |
| **nextPageToken** | `string` | Opaque pagination token returned from the previous page | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | Maximum number of rows to return | [Optional] [Defaults to `5`] |

### Return type

[**GetRowsResponse**](GetRowsResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of rows retrieved successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **409** | Your pagination cursor or row reference points at a set of results that has since been replaced. The page itself is fine and its ID is still valid — start its pagination again from the beginning.  |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSeasonDetails

> SeasonDetailsResponse getSeasonDetails(mediaId, seasonNumber, language)

Get TV season details

Returns episode details for a specific TV season — episode titles, overviews, air dates, and episode numbers.  This is a public endpoint — no authentication required. Returns only generic catalog metadata. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  const result = await client.getSeasonDetails(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The unique identifier of the TV show (e.g., &#x60;TV_1396&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |
| **seasonNumber** | `number` | The season number. | [Defaults to `undefined`] |
| **language** | `string` | ISO 639-1 language code for localised results (e.g., &#x60;en&#x60;). | [Optional] [Defaults to `undefined`] |

### Return type

[**SeasonDetailsResponse**](SeasonDetailsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Season details returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSeasonProfileMeta

> SeasonProfileMeta getSeasonProfileMeta(mediaId, seasonNumber)

Get which episodes of a TV season are finished

Returns which episodes of a TV season the current profile has finished, plus whether the whole season is complete.  Pair this with &#x60;getSeasonDetails&#x60; for episode titles and artwork, and with &#x60;getMediaProfileMeta&#x60; for title-level state (liked, watchlisted, playback position). Use this endpoint when you need per-episode detail for a season view — for example, putting a checkmark on each episode the profile has finished. It reports finished or not; a half-watched episode isn\&#39;t tracked, so it won\&#39;t show a progress bar. The profile\&#39;s place in the episode it is watching now is &#x60;playback&#x60; on &#x60;getMediaProfileMeta&#x60;.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.getSeasonProfileMeta(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The unique identifier of the TV show (e.g., &#x60;TV_1396&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |
| **seasonNumber** | `number` | The season number. | [Defaults to `undefined`] |

### Return type

[**SeasonProfileMeta**](SeasonProfileMeta.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Season progress returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSimilarRecommendations

> SimilarResponse getSimilarRecommendations(mediaId, language, page)

Get similar titles

Returns titles that are similar to the given movie or TV show. Useful for \&quot;More like this\&quot; sections.  This is a public endpoint — no authentication required. Returns only generic catalog metadata. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  const result = await client.getSimilarRecommendations(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The unique identifier of the media item. Use &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |
| **language** | `string` | Language code for results (e.g., &#x60;en-US&#x60;). | [Optional] [Defaults to `undefined`] |
| **page** | `number` | Page number for pagination (default: 1). | [Optional] [Defaults to `1`] |

### Return type

[**SimilarResponse**](SimilarResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Similar titles returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSuperLikedItems

> SimpleListResponse getSuperLikedItems(nextPageToken, limit)

Get super-liked items

Returns the super-liked list for a specific profile.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Items are ordered newest-first and support cursor-based pagination via &#x60;nextPageToken&#x60;.  **Pagination:** - Pass &#x60;nextPageToken&#x60; from a previous response to fetch the next page. - If &#x60;hasMore&#x60; is &#x60;true&#x60;, there are more items available.  **Exclusive lists:** Liked, disliked, and super-liked are mutually exclusive — a title can only be in one of those lists at a time. Super-liked titles are the ones the viewer loves most. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.getSuperLikedItems(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **nextPageToken** | `string` | Opaque token from previous page for pagination | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | Maximum number of items to return (1-50, default: 10) | [Optional] [Defaults to `10`] |

### Return type

[**SimpleListResponse**](SimpleListResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of super_liked items retrieved successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getWatchlistItems

> SimpleListResponse getWatchlistItems(nextPageToken, limit)

Get watchlist items

Returns the profile\&#39;s watchlist — titles saved to watch later.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Ordered by when they were added (newest first). Supports cursor-based pagination via &#x60;nextPageToken&#x60;.  **Pagination:** - Pass &#x60;nextPageToken&#x60; from a previous response to fetch the next page. - If &#x60;hasMore&#x60; is &#x60;true&#x60;, there are more items available. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.getWatchlistItems(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **nextPageToken** | `string` | Opaque token from previous page for pagination | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | Maximum number of items to return (1-50, default: 10) | [Optional] [Defaults to `10`] |

### Return type

[**SimpleListResponse**](SimpleListResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of watchlist items retrieved successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## markUnwatched

> SuccessMessage markUnwatched(mediaId, season, episode)

Mark a title as unwatched

Takes a movie, a TV show, a season, or an episode back to unwatched, in one call.  It removes the history that made it watched, takes it out of the user\&#39;s **in-progress** list if that is where it was, and brings a TV show\&#39;s &#x60;completed&#x60; state back in line. Use it for a \&quot;Mark as unwatched\&quot; button.  For TV shows, &#x60;season&#x60; and &#x60;episode&#x60; choose how much to undo:  - Omit both to undo **the whole show**, every season. - Pass &#x60;season&#x60; to undo **that season**: its episodes, and any entry that counted the whole season as watched. - Pass &#x60;season&#x60; and &#x60;episode&#x60; to undo **that episode**.  Calling it for a title that isn\&#39;t watched changes nothing and still succeeds, so it is safe to retry.  This is not the same as [&#x60;DELETE /profile/history/{mediaId}&#x60;](/api-reference/discovr/delete-history-item), which removes history entries and nothing else. Marking something unwatched with that call and &#x60;DELETE /profile/playback/{mediaId}&#x60; leaves a TV show\&#39;s &#x60;completed&#x60; out of date unless they run in a particular order; this endpoint does the right thing whichever way you reach it.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.markUnwatched(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The media ID in &#x60;MV_&lt;number&gt;&#x60; or &#x60;TV_&lt;number&gt;&#x60; format (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id.  | [Defaults to `undefined`] |
| **season** | `number` | TV only. Season number. Omit to undo every season of the show. | [Optional] [Defaults to `undefined`] |
| **episode** | `number` | TV only, and only together with &#x60;season&#x60;. Episode number. Omit to undo the whole season. | [Optional] [Defaults to `undefined`] |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The title is unwatched. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## mintSessionToken

> SessionTokenResponse mintSessionToken(mintSessionTokenPayload)

Mint a session token

Scopes your browsing session to a specific profile. You\&#39;ll call this: - after sign-in, to pick which profile is active - when the user switches to a different profile - when the previous session token has expired  Returns a short-lived session token (valid for 30 minutes) and its expiry time. Use this token in the &#x60;Authorization&#x60; header for all session-tier endpoints — pages, rows, and profile-scoped lists.  The response also carries a &#x60;snapshotId&#x60;, which identifies the recommendations the user is currently browsing. Send it back on your next call so renewing a credential doesn\&#39;t reshuffle the screen underneath them. Omit it on a first sign-in or a profile switch, where there\&#39;s nothing to carry. Page IDs are unaffected either way.  **Auth tier:** identity — send your refresh token in the &#x60;Authorization: Bearer&#x60; header. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.mintSessionToken(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mintSessionTokenPayload** | [MintSessionTokenPayload](MintSessionTokenPayload.md) |  | |

### Return type

[**SessionTokenResponse**](SessionTokenResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A new session token. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **403** | Returned when you send a session token where a refresh token is required (&#x60;WRONG_TOKEN_KIND&#x60;), or when the &#x60;profileId&#x60; doesn\&#39;t belong to the signed-in user (&#x60;PROFILE_NOT_FOUND&#x60;).  |  -  |
| **405** | Method not allowed. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## patchHistoryItem

> SuccessMessage patchHistoryItem(mediaId, patchHistoryPayload, season, episode)

Update or create a history item

Updates the history entry for a title. If no entry exists, creates one (upsert). This ensures only one entry exists per &#x60;mediaId&#x60; + &#x60;season&#x60; + &#x60;episode&#x60; combination.  For TV shows, &#x60;season&#x60; is required as a query parameter. Include &#x60;episode&#x60; to target a specific episode; omit it to update the season-level entry.  - &#x60;progress&#x60;: how far through the title the user watched, as a percentage (0–100). 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.patchHistoryItem(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The media ID of the title. Format: &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows.  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |
| **patchHistoryPayload** | [PatchHistoryPayload](PatchHistoryPayload.md) |  | |
| **season** | `number` | Season number. Required for TV shows (&#x60;TV_&#x60; mediaId); ignored for movies. | [Optional] [Defaults to `undefined`] |
| **episode** | `number` | Episode number. Optional — omit to update the season-level entry; include to target a specific episode. | [Optional] [Defaults to `undefined`] |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | History item updated or created successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## pollDeviceCode

> PollDeviceCode200Response pollDeviceCode(deviceCode)

Poll for auth token

The second step of the device code flow. Call this repeatedly after showing the user code or QR code.  While the user hasn\&#39;t confirmed yet, you\&#39;ll get &#x60;{ status: \&quot;pending\&quot;, interval }&#x60; — wait &#x60;interval&#x60; seconds and poll again. Once they approve, the response changes to &#x60;{ refreshToken, publicId, expiresAt }&#x60;. Store the &#x60;refreshToken&#x60; securely — it\&#39;s your long-lived credential for all identity-tier calls.  **Polling interval:** the server sets it and repeats it in every pending answer; it grows the longer the code has been waiting, so always use the latest value. The SDKs do this for you. Stop polling when you receive a &#x60;refreshToken&#x60; or a &#x60;401&#x60; error.  A person can decline on their phone. Your next poll then returns &#x60;401&#x60; with &#x60;device-code-denied&#x60; straight away (and on every poll after, until the code expires), so you can say so on screen instead of waiting out the timeout. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  const result = await client.pollDeviceCode(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **deviceCode** | `string` | The device code obtained from the request device code endpoint | [Defaults to `undefined`] |

### Return type

[**PollDeviceCode200Response**](PollDeviceCode200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Poll result. Two possible shapes: - **Authorized**: device code was approved — contains &#x60;refreshToken&#x60;, &#x60;publicId&#x60;, &#x60;expiresAt&#x60;. - **Pending**: user has not yet approved — contains &#x60;status: \&quot;pending\&quot;&#x60; and the &#x60;interval&#x60; to wait. Keep polling.  |  -  |
| **400** | Bad request - invalid path structure |  -  |
| **401** | Device code expired, already consumed, or declined by the person on their phone. The &#x60;error&#x60; field contains a machine-readable code.  |  -  |
| **403** | The account is on the closed-programme waitlist and may not be issued a credential yet. Deliberately not a &#x60;401&#x60;: the credential presented was valid and re-authenticating will not change the answer, so a client that retries on &#x60;401&#x60; must not retry on this.  |  -  |
| **404** | Device code does not exist |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## requestDeviceCode

> DeviceCodeResponse requestDeviceCode(deviceCodePayload, size, format)

Request device code

Starts the TV / device sign-in flow. Call this to get a user code and QR code to display on screen. The user opens Discovr on their phone, scans the QR code or types the user code, and confirms sign-in. Once they do, your next poll to &#x60;/auth/device-codes/{deviceCode}/poll&#x60; returns a refresh token.  **Response format:** - &#x60;format&#x3D;json&#x60; (default) — returns &#x60;{ deviceCode, userCode, authQRCode, verificationUrl, expiresIn, interval }&#x60;. The &#x60;authQRCode&#x60; is a base64 data URL — drop it straight into an &#x60;&lt;img&gt;&#x60; tag. Show &#x60;verificationUrl&#x60; next to the code so people who can\&#39;t scan can type &#x60;userCode&#x60; there.  Keep &#x60;deviceCode&#x60; on the device. It is what you poll with, so it is never put in the QR code or shown to the person; the QR code and the screen carry only &#x60;userCode&#x60;. - &#x60;format&#x3D;image&#x60; — returns a raw PNG binary. Handy if you\&#39;re embedding the image directly without a data URL wrapper.  **QR code size:** Use the &#x60;size&#x60; parameter to match your display. TV screens benefit from larger codes (600–800 px). Default is 300 px. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  const result = await client.requestDeviceCode(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **deviceCodePayload** | [DeviceCodePayload](DeviceCodePayload.md) |  | |
| **size** | `number` | QR code size in pixels. Larger sizes are recommended for TV displays. | [Optional] [Defaults to `300`] |
| **format** | `json`, `image` | Response format. Use \&quot;image\&quot; for native clients to receive binary PNG directly. | [Optional] [Defaults to `&#39;json&#39;`] [Enum: json, image] |

### Return type

[**DeviceCodeResponse**](DeviceCodeResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`, `image/png`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Device code created successfully. Response format depends on &#x60;format&#x60; query parameter. |  -  |
| **400** | Bad request — missing or invalid clientID |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## scrobble

> ScrobbleResponse scrobble(mediaId, scrobbleProgressBody)

Record playback progress

Scrobbling is Discovr\&#39;s single-call way to track playback. One call updates everything — progress, history, and watchlist — so you don\&#39;t need to coordinate multiple endpoints.  Call this about every 30 seconds while the user watches, and straight away on pause, resume, seek and when playback ends. Discovr handles the rest:  - The item stays in the user\&#39;s **in-progress** list until they finish watching. - Once they\&#39;ve watched 80% or more, it\&#39;s marked as complete and moves to their **history**. - For movies, the item is removed from the user\&#39;s watchlist once they\&#39;ve watched more than 20% — so it clears as soon as they\&#39;re clearly watching it. For TV episodes, it\&#39;s removed from the watchlist once the episode is complete (≥80%).  For TV shows, include &#x60;season&#x60; and &#x60;episode&#x60; in the request body so history is tracked per episode.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.scrobble(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The media ID in &#x60;MV_&lt;number&gt;&#x60; or &#x60;TV_&lt;number&gt;&#x60; format (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |
| **scrobbleProgressBody** | [ScrobbleProgressBody](ScrobbleProgressBody.md) |  | |

### Return type

[**ScrobbleResponse**](ScrobbleResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Progress recorded. Check &#x60;completed&#x60; to know if the item was marked as watched. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## scrobbleSkip

> ScrobbleSkipResponse scrobbleSkip(mediaId, scrobbleSkipBody)

Record a skip event

Signals that the user jumped to another point in the content, forward (a skip) or backward (a rewind). Used for watch analytics. Returns immediately — no side effects on lists or history.  &#x60;from&#x60; and &#x60;to&#x60; are playback positions as a percentage (0–100) and must differ; &#x60;from&#x60; higher than &#x60;to&#x60; is a jump backward. &#x60;duration&#x60; is how many seconds were jumped. After a jump, also send the position the viewer landed on as a progress update with &#x60;POST /profile/scrobble/{mediaId}&#x60;. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.scrobbleSkip(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The media ID in &#x60;MV_&lt;number&gt;&#x60; or &#x60;TV_&lt;number&gt;&#x60; format (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |
| **scrobbleSkipBody** | [ScrobbleSkipBody](ScrobbleSkipBody.md) |  | |

### Return type

[**ScrobbleSkipResponse**](ScrobbleSkipResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Skip event recorded. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## searchGifs

> GifSearchResponse searchGifs(q, limit, pos, contentfilter, country, locale)

Search GIFs

Searches for animated GIFs by keyword. Use the &#x60;contentfilter&#x60; parameter to control content safety (&#x60;off&#x60;, &#x60;low&#x60;, &#x60;medium&#x60;, &#x60;high&#x60;); if you omit it, the filtering configured for Discovr\&#39;s Klipy account applies, which is not a fixed level, so pass it explicitly when you need a guaranteed one. Results are paginated — pass &#x60;next&#x60; from the previous response as &#x60;pos&#x60; to load more.  Each result\&#39;s &#x60;url&#x60; is the full-size file and is an **MP4 whenever one is available**, otherwise a GIF, so render it with a video player or an image view according to its file extension (see &#x60;avatarMediaType&#x60; on profiles). &#x60;preview.url&#x60; is a lighter version for grids; use it for thumbnails and save &#x60;url&#x60; only for the one the user picks.  Klipy attribution is required wherever you show these results.  No authentication required. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  const result = await client.searchGifs(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **q** | `string` | Search term. | [Defaults to `undefined`] |
| **limit** | `number` | Maximum number of results to return (1–50). | [Optional] [Defaults to `20`] |
| **pos** | `string` | Pagination cursor from the &#x60;next&#x60; field of the previous response. Omit to start from the beginning. | [Optional] [Defaults to `undefined`] |
| **contentfilter** | `high`, `medium`, `low`, `off` | Content safety level. &#x60;high&#x60; is the most restrictive; &#x60;off&#x60; applies no filtering. Omit it and Discovr\&#39;s default filtering applies, not a fixed level. | [Optional] [Defaults to `undefined`] [Enum: high, medium, low, off] |
| **country** | `string` | ISO 3166-1 alpha-2 country code for regional content preferences (e.g., &#x60;US&#x60;). Takes precedence over &#x60;locale&#x60;. | [Optional] [Defaults to `undefined`] |
| **locale** | `string` | Only its region part is used (&#x60;en_US&#x60; is treated as &#x60;US&#x60;), and only when &#x60;country&#x60; is not sent. | [Optional] [Defaults to `undefined`] |

### Return type

[**GifSearchResponse**](GifSearchResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | GIF results returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## searchMedia

> SearchResponse searchMedia(query, q, page)

Search media

Searches across movies, TV shows, and people. Returns a ranked list of matches. Use the &#x60;query&#x60; (or &#x60;q&#x60;) parameter for the search term.  Results are ordered by relevance — preserve that order rather than re-sorting client-side.  This endpoint does not accept filters. To browse by genre, runtime, release window, or watch provider, create a page with &#x60;pageFilters&#x60; instead. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.searchMedia(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **query** | `string` | Search term. Use &#x60;query&#x60; or &#x60;q&#x60; — if both are provided, &#x60;query&#x60; takes precedence.  | [Optional] [Defaults to `undefined`] |
| **q** | `string` | Search term (shorthand for &#x60;query&#x60;). At least one of &#x60;query&#x60; or &#x60;q&#x60; is required.  | [Optional] [Defaults to `undefined`] |
| **page** | `number` | Page of results to return, starting at 1. Check &#x60;has_more&#x60; on the response to decide whether to request the next page.  | [Optional] [Defaults to `1`] |

### Return type

[**SearchResponse**](SearchResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Search results returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## signOutSession

> SignOutSession200Response signOutSession()

Sign out the current device

Signs out the current device by revoking the refresh token you send in the &#x60;Authorization&#x60; header. Other devices the user is signed into aren\&#39;t affected — you can only sign out the current device from a third-party app.  Identity-tier calls using this token fail immediately after revocation. Any existing session tokens (valid for 30 minutes) remain usable until they naturally expire.  Works the same way for a demo session\&#39;s refresh token — a demo sandbox is an ordinary account, so this is a quick way to end one early and test how your app handles it.  Using an SDK? Call &#x60;signOut()&#x60; instead — it wraps this endpoint and also clears the credentials stored on the device.  **Auth tier:** identity — send your refresh token in the &#x60;Authorization: Bearer&#x60; header. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.signOutSession(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**SignOutSession200Response**](SignOutSession200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Refresh token revoked. Device is signed out. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **405** | Method not allowed. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## startDemoSession

> DemoSessionResponse startDemoSession(demoSessionRequest)

Start a demo session

Gives you a working Discovr account in one call — no sign-up, no credentials, nothing to configure. Use it while you build: to explore the API, prototype against realistic data, or try requests right here in the docs. It\&#39;s a development tool, not something to put in front of your users.  You get a private sandbox pre-loaded with profiles, watchlists, and viewing history, so recommendation rows are populated from the very first request. It behaves like any other account: writes really do save, and reading them back returns what you\&#39;d expect.  The response is a refresh token. From here you\&#39;re on the normal path — call [&#x60;POST /auth/session-token&#x60;](/api-reference/discovr/mint-session-token) with a profile ID to start browsing. Nothing else about your integration changes, which is the point: code you write against a demo session works unchanged against a real one.  Two things to keep in mind: - **Sandboxes are temporary.** Yours lasts 30 minutes (you can ask for a shorter one with &#x60;ttlMs&#x60;, never a longer one) and everything in it is deleted afterwards. Once it has ended, requests made with its token fail with &#x60;401&#x60; &#x60;TOKEN_EXPIRED&#x60;. Don\&#39;t build anything that expects it to still be there tomorrow. - **Sandboxes are rate limited.** You can start five per hour from the same network address, and that allowance is shared with the demo button on Discovr\&#39;s sign-in screens and with a TV\&#39;s device-code demo. When it runs out you get a &#x60;429&#x60; with a &#x60;Retry-After&#x60; header, so hold on to the token you\&#39;re given rather than requesting a new one per request.  You do still need a &#x60;clientId&#x60; — the same one your SDK constructor already takes regardless of demo mode, so this asks nothing new of a real integration. Trying this endpoint directly from this page? Use &#x60;discovr-docs-playground&#x60;, a client id that\&#39;s always available for exactly that.  It also powers the \&quot;Continue as Demo\&quot; button that Discovr\&#39;s sign-in screens show to a client created with &#x60;demoMode&#x60;, which is meant for development builds.  **Auth tier:** none — this is the one endpoint you can call without a credential. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  const result = await client.startDemoSession(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **demoSessionRequest** | [DemoSessionRequest](DemoSessionRequest.md) |  | |

### Return type

[**DemoSessionResponse**](DemoSessionResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | A new demo sandbox is ready. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **403** | &#x60;clientId&#x60; doesn\&#39;t match a registered client.  |  -  |
| **405** | Method not allowed. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **503** | Demo sessions are temporarily unavailable. This is on our side, not yours — retry shortly.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updatePlaybackItem

> SuccessMessage updatePlaybackItem(editPlaybackPayload)

Update playback progress

Updates the playback position for an existing entry. Same fields as the add endpoint. If no entry exists for the &#x60;mediaId&#x60;, one is created. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.updatePlaybackItem(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **editPlaybackPayload** | [EditPlaybackPayload](EditPlaybackPayload.md) |  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Item updated successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateProfile

> Profile updateProfile(profileId, updateProfilePayload)

Update a profile

Updates a profile\&#39;s name, avatar URL, or both. Provide only the fields you want to change — omitted fields stay as-is.  Returns the updated profile object. Returns 404 if the profile doesn\&#39;t exist or doesn\&#39;t belong to the signed-in user. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.updateProfile(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **profileId** | `string` | The ID of the profile to update. | [Defaults to `undefined`] |
| **updateProfilePayload** | [UpdateProfilePayload](UpdateProfilePayload.md) |  | |

### Return type

[**Profile**](Profile.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Profile updated successfully. Returns the full updated profile object. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

