# ProfileListsApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addDislikedItem**](ProfileListsApi.md#adddislikeditem) | **POST** /profile/disliked | Add an item to disliked list |
| [**addHistoryItem**](ProfileListsApi.md#addhistoryitem) | **POST** /profile/history | Add an item to history list |
| [**addLikedItem**](ProfileListsApi.md#addlikeditem) | **POST** /profile/liked | Add an item to liked list |
| [**addPlaybackItem**](ProfileListsApi.md#addplaybackitem) | **POST** /profile/playback | Add an item to playback list |
| [**addSuperLikedItem**](ProfileListsApi.md#addsuperlikeditem) | **POST** /profile/super_liked | Add an item to the super-liked list |
| [**addWatchlistItem**](ProfileListsApi.md#addwatchlistitem) | **POST** /profile/watchlist | Add an item to watchlist |
| [**deleteDislikedItem**](ProfileListsApi.md#deletedislikeditem) | **DELETE** /profile/disliked/{mediaId} | Delete an item from disliked list |
| [**deleteHistoryItem**](ProfileListsApi.md#deletehistoryitem) | **DELETE** /profile/history/{mediaId} | Delete an item from history list |
| [**deleteLikedItem**](ProfileListsApi.md#deletelikeditem) | **DELETE** /profile/liked/{mediaId} | Delete an item from liked list |
| [**deletePlaybackItem**](ProfileListsApi.md#deleteplaybackitem) | **DELETE** /profile/playback/{mediaId} | Delete an item from playback list |
| [**deleteSuperLikedItem**](ProfileListsApi.md#deletesuperlikeditem) | **DELETE** /profile/super_liked/{mediaId} | Delete an item from the super-liked list |
| [**deleteWatchlistItem**](ProfileListsApi.md#deletewatchlistitem) | **DELETE** /profile/watchlist/{mediaId} | Delete an item from watchlist |
| [**getDislikedItems**](ProfileListsApi.md#getdislikeditems) | **GET** /profile/disliked | Get disliked items |
| [**getHistoryItems**](ProfileListsApi.md#gethistoryitems) | **GET** /profile/history | Get history items |
| [**getHistoryItemsByMediaId**](ProfileListsApi.md#gethistoryitemsbymediaid) | **GET** /profile/history/{mediaId} | Get history items for a specific media |
| [**getLikedItems**](ProfileListsApi.md#getlikeditems) | **GET** /profile/liked | Get liked items |
| [**getPlaybackItems**](ProfileListsApi.md#getplaybackitems) | **GET** /profile/playback | Get playback items |
| [**getSuperLikedItems**](ProfileListsApi.md#getsuperlikeditems) | **GET** /profile/super_liked | Get super-liked items |
| [**getWatchlistItems**](ProfileListsApi.md#getwatchlistitems) | **GET** /profile/watchlist | Get watchlist items |
| [**patchHistoryItem**](ProfileListsApi.md#patchhistoryitem) | **PATCH** /profile/history/{mediaId} | Update or create a history item |
| [**updatePlaybackItem**](ProfileListsApi.md#updateplaybackitem) | **PATCH** /profile/playback | Update playback progress |



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

