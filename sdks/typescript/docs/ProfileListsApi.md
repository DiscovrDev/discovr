# ProfileListsApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addToWatchlist**](ProfileListsApi.md#addtowatchlist) | **PUT** /profile/titles/{mediaId}/watchlist | Add a title to the watchlist |
| [**clearRating**](ProfileListsApi.md#clearrating) | **DELETE** /profile/titles/{mediaId}/rating | Clear a title\&#39;s rating |
| [**deletePlaybackItem**](ProfileListsApi.md#deleteplaybackitem) | **DELETE** /profile/playback/{mediaId} | Remove a title from Continue Watching |
| [**getPlaybackItems**](ProfileListsApi.md#getplaybackitems) | **GET** /profile/playback | Get playback items |
| [**getSeasonState**](ProfileListsApi.md#getseasonstate) | **GET** /profile/titles/{mediaId}/seasons/{seasonNumber} | Get which episodes of a TV season are watched |
| [**getTitleState**](ProfileListsApi.md#gettitlestate) | **GET** /profile/titles/{mediaId} | Get the active profile\&#39;s state for a title |
| [**getTitles**](ProfileListsApi.md#gettitles) | **GET** /profile/titles | List titles by rating, watchlist, or watch history |
| [**importHistory**](ProfileListsApi.md#importhistory) | **POST** /profile/history | Import a watch history entry |
| [**removeFromWatchlist**](ProfileListsApi.md#removefromwatchlist) | **DELETE** /profile/titles/{mediaId}/watchlist | Remove a title from the watchlist |
| [**setRating**](ProfileListsApi.md#setrating) | **PUT** /profile/titles/{mediaId}/rating | Set a title\&#39;s rating |



## addToWatchlist

> TitleState addToWatchlist(mediaId)

Add a title to the watchlist

Adds a title to the active profile\&#39;s watchlist. Safe to call if it is already on the watchlist.  Returns the title\&#39;s updated &#x60;TitleState&#x60;, so you can update your UI immediately without calling &#x60;getTitleState&#x60; again.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

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
  const result = await client.addToWatchlist(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The title\&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | [Defaults to `undefined`] |

### Return type

[**TitleState**](TitleState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Added to watchlist; returns the title\&#39;s new state. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## clearRating

> TitleState clearRating(mediaId)

Clear a title\&#39;s rating

Clears the active profile\&#39;s rating for a title. Safe to call if the title has no rating.  Returns the title\&#39;s updated &#x60;TitleState&#x60;, so you can update your UI immediately without calling &#x60;getTitleState&#x60; again.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

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
  const result = await client.clearRating(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The title\&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | [Defaults to `undefined`] |

### Return type

[**TitleState**](TitleState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Rating cleared; returns the title\&#39;s new state. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deletePlaybackItem

> SuccessMessage deletePlaybackItem(mediaId)

Remove a title from Continue Watching

Removes a title from the in-progress Continue Watching list without changing its watched history. Use &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;). 

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
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPlaybackItems

> PlaybackListResponse getPlaybackItems(nextPageToken, limit)

Get playback items

Returns the profile\&#39;s in-progress titles — everything with a saved playback position. Ordered by most recently updated. Use this to build a \&quot;Continue Watching\&quot; row.  Each item includes a &#x60;progress&#x60; field (0–100) showing how far through the title the user is. To update progress as a viewer watches, call &#x60;POST /profile/scrobble/{mediaId}&#x60;.  **Pagination:** Pass &#x60;nextPageToken&#x60; from the previous response to fetch the next page. If &#x60;hasMore&#x60; is &#x60;true&#x60;, more items are available. 

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
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSeasonState

> SeasonState getSeasonState(mediaId, seasonNumber)

Get which episodes of a TV season are watched

Returns which episodes of a single TV season the active profile has finished, plus whether the season as a whole is complete.  A season counts as complete when every aired episode in it is watched. Specials (season &#x60;0&#x60;) never count toward show completion. Pair this with &#x60;getSeasonDetails&#x60; for episode titles and artwork, and with &#x60;getTitleState&#x60; for title-level state and live playback position.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

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
  const result = await client.getSeasonState(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The TV show\&#39;s media ID (&#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | [Defaults to `undefined`] |
| **seasonNumber** | `number` | The season number (0 for specials, 1+ for regular seasons). | [Defaults to `undefined`] |

### Return type

[**SeasonState**](SeasonState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Season completion state returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getTitleState

> TitleState getTitleState(mediaId, providers)

Get the active profile\&#39;s state for a title

Returns everything your UI needs to show the active profile\&#39;s relationship with a title:  - **Rating**: &#x60;liked&#x60;, &#x60;disliked&#x60;, &#x60;super_liked&#x60;, or &#x60;null&#x60;. - **Watchlist**: whether the title is saved to the watchlist. - **Watch progress &amp; completion**: whether the profile has started (&#x60;watched&#x60;) or finished (&#x60;completed&#x60;) the title, total &#x60;plays&#x60;, watched &#x60;episodes&#x60; and &#x60;completedSeasons&#x60; for TV shows, and the live &#x60;playback&#x60; resume position when mid-watch. - **Providers** *(optional)*: pass &#x60;providers&#x3D;true&#x60; to include streaming availability filtered to the account\&#39;s chosen services.  **Title opens &amp; recommendations.** Calling &#x60;GET /profile/titles/{mediaId}&#x60; records that the viewer opened the title and directly affects the profile\&#39;s recommendations. Only call it when the title screen actually opens — prefetching or calling it on hover/focus registers every loaded tile similarly to the viewer liking the title and will skew their recommendations. Every state write (&#x60;setRating&#x60;, &#x60;clearRating&#x60;, &#x60;addToWatchlist&#x60;, &#x60;removeFromWatchlist&#x60;, &#x60;markWatched&#x60;, &#x60;markUnwatched&#x60;) returns the updated &#x60;TitleState&#x60;, so you don\&#39;t need to refetch this endpoint after a change.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

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
  const result = await client.getTitleState(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The title\&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; for movies, &#x60;TV_&lt;id&gt;&#x60; for TV shows).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the ID. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens recommendations.  | [Defaults to `undefined`] |
| **providers** | `boolean` | Set to &#x60;true&#x60; to include streaming provider availability filtered to the account\&#39;s selected services. | [Optional] [Defaults to `false`] |

### Return type

[**TitleState**](TitleState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Title state returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getTitles

> TitleListResponse getTitles(rating, watchlist, watched, nextPageToken, limit)

List titles by rating, watchlist, or watch history

Returns a paginated list of titles for the active profile, ordered most recent first.  Pass **exactly one** filter query parameter:  - &#x60;rating&#x3D;liked&#x60;, &#x60;rating&#x3D;disliked&#x60;, or &#x60;rating&#x3D;super_liked&#x60; — titles with that rating, newest rated first. - &#x60;watchlist&#x3D;true&#x60; — the profile\&#39;s watchlist, newest added first. - &#x60;watched&#x3D;true&#x60; — the profile\&#39;s watch history (one entry per title, with &#x60;completed&#x60;, &#x60;plays&#x60;, and the last episode for TV shows), most recently watched first.  Each item includes a &#x60;ref&#x60; alongside its &#x60;id&#x60;. Pass the &#x60;ref&#x60; when the viewer opens or acts on the title.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

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
  const result = await client.getTitles(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **rating** | `Rating` | Filter by rating (&#x60;liked&#x60;, &#x60;disliked&#x60;, or &#x60;super_liked&#x60;). | [Optional] [Defaults to `undefined`] [Enum: liked, disliked, super_liked] |
| **watchlist** | `boolean` | Set to &#x60;true&#x60; to list the profile\&#39;s watchlist. | [Optional] [Defaults to `undefined`] |
| **watched** | `boolean` | Set to &#x60;true&#x60; to list the profile\&#39;s watch history (one row per title). | [Optional] [Defaults to `undefined`] |
| **nextPageToken** | `string` | Opaque cursor token from the previous page. | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | Maximum number of titles to return (1–50, default 10). | [Optional] [Defaults to `10`] |

### Return type

[**TitleListResponse**](TitleListResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated list of matching titles. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## importHistory

> TitleState importHistory(importHistoryPayload)

Import a watch history entry

Imports a previously watched movie, show, season, or episode from an external source.  - &#x60;mediaId&#x60;: the title to import (&#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows). - &#x60;imported&#x60;: required string naming the external source (for example &#x60;\&quot;trakt\&quot;&#x60;). - &#x60;updatedAt&#x60;: optional ISO 8601 timestamp of when it was watched. Defaults to now. - &#x60;season&#x60; / &#x60;episode&#x60;: optional TV scope. Omit both to import all aired episodes of the show; pass &#x60;season&#x60; to import that season; pass both to import a single episode.  For live viewing use &#x60;scrobble()&#x60;, and for interactive \&quot;Mark as watched\&quot; buttons use &#x60;markWatched()&#x60;. To read watch history, use &#x60;GET /profile/titles?watched&#x3D;true&#x60;.  Returns the title\&#39;s updated &#x60;TitleState&#x60;.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

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
  const result = await client.importHistory(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **importHistoryPayload** | [ImportHistoryPayload](ImportHistoryPayload.md) |  | |

### Return type

[**TitleState**](TitleState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | History imported; returns the title\&#39;s new state. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## removeFromWatchlist

> TitleState removeFromWatchlist(mediaId)

Remove a title from the watchlist

Removes a title from the active profile\&#39;s watchlist. Safe to call if it is not on the watchlist.  Returns the title\&#39;s updated &#x60;TitleState&#x60;, so you can update your UI immediately without calling &#x60;getTitleState&#x60; again.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

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
  const result = await client.removeFromWatchlist(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The title\&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | [Defaults to `undefined`] |

### Return type

[**TitleState**](TitleState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Removed from watchlist; returns the title\&#39;s new state. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## setRating

> TitleState setRating(mediaId, setRatingPayload)

Set a title\&#39;s rating

Sets the active profile\&#39;s rating for a title to &#x60;liked&#x60;, &#x60;disliked&#x60;, or &#x60;super_liked&#x60;.  Ratings are mutually exclusive: setting a new rating automatically replaces any previous one. Setting the rating the title already has is a safe no-op.  Returns the title\&#39;s updated &#x60;TitleState&#x60;, so you can update your UI immediately without calling &#x60;getTitleState&#x60; again.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

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
  const result = await client.setRating(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The title\&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | [Defaults to `undefined`] |
| **setRatingPayload** | [SetRatingPayload](SetRatingPayload.md) |  | |

### Return type

[**TitleState**](TitleState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Rating updated; returns the title\&#39;s new state. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

