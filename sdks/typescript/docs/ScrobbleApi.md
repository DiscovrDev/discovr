# ScrobbleApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**markUnwatched**](ScrobbleApi.md#markunwatched) | **DELETE** /profile/titles/{mediaId}/watched | Mark a title, season, or episode as unwatched |
| [**markWatched**](ScrobbleApi.md#markwatched) | **PUT** /profile/titles/{mediaId}/watched | Mark a title, season, or episode as watched |
| [**scrobble**](ScrobbleApi.md#scrobble) | **POST** /profile/scrobble/{mediaId} | Record playback progress |



## markUnwatched

> TitleState markUnwatched(mediaId, season, episode)

Mark a title, season, or episode as unwatched

Takes a movie, a TV show, a season, or an episode back to unwatched in one atomic call.  It removes the watched state for that scope and clears any in-progress Continue Watching position inside it. Calling it for a title that isn\&#39;t watched changes nothing and still succeeds, so it\&#39;s safe to retry.  For TV shows, &#x60;season&#x60; and &#x60;episode&#x60; choose how much to undo:  - Omit both to undo **the whole show**, every season. - Pass &#x60;season&#x60; to undo **that season**. - Pass &#x60;season&#x60; and &#x60;episode&#x60; to undo **that episode**.  Returns the title\&#39;s updated &#x60;TitleState&#x60;, so you don\&#39;t need to refetch &#x60;getTitleState&#x60;.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

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
| **mediaId** | `string` | The title\&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | [Defaults to `undefined`] |
| **season** | `number` | TV only. Season number. Omit to undo every season of the show. | [Optional] [Defaults to `undefined`] |
| **episode** | `number` | TV only, and only together with &#x60;season&#x60;. Episode number. Omit to undo the whole season. | [Optional] [Defaults to `undefined`] |

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
| **200** | Marked as unwatched; returns the title\&#39;s new state. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## markWatched

> TitleState markWatched(mediaId, season, episode)

Mark a title, season, or episode as watched

Marks a movie, an entire TV show, a season, or a single episode as watched in one atomic call.  For TV shows, &#x60;season&#x60; and &#x60;episode&#x60; pick the scope:  - Omit both to mark **every aired episode** across all regular seasons (season 1 and up) as watched. Specials (season &#x60;0&#x60;) are excluded. - Pass &#x60;season&#x60; to mark every aired episode of **that season**. - Pass &#x60;season&#x60; and &#x60;episode&#x60; to mark **that episode**.  Any in-progress Continue Watching position within the marked scope is cleared automatically. Returns the title\&#39;s updated &#x60;TitleState&#x60;, so you don\&#39;t need to refetch &#x60;getTitleState&#x60;.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

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
  const result = await client.markWatched(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The title\&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | [Defaults to `undefined`] |
| **season** | `number` | TV only. Season number. Omit to mark every aired season of the show. | [Optional] [Defaults to `undefined`] |
| **episode** | `number` | TV only, and only together with &#x60;season&#x60;. Episode number. Omit to mark the whole season. | [Optional] [Defaults to `undefined`] |

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
| **200** | Marked as watched; returns the title\&#39;s new state. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## scrobble

> ScrobbleResponse scrobble(mediaId, scrobbleProgressBody)

Record playback progress

Scrobbling is Discovr\&#39;s single-call way to track playback. One call updates live resume progress, watch history, completion, and the watchlist.  Send the viewer\&#39;s real position when playback starts (not &#x60;0&#x60; when resuming), about every 30 seconds while watching, and right away on pause, resume, seek, and completion. Discovr handles the rest:  - The title stays in Continue Watching until the movie or episode crosses 80%. - Once progress reaches 20% or more, the title is automatically removed from the watchlist — for both movies and TV shows. - Once progress reaches 80% or more, the movie or episode is marked watched and leaves Continue Watching. Lower progress later (such as a rewind) moves the live position without undoing completion — use &#x60;markUnwatched&#x60; to undo a watch. - For TV shows, include &#x60;season&#x60; and &#x60;episode&#x60; in &#x60;tv&#x60;. When an episode crosses 80%, the response includes &#x60;completedSeasons&#x60; listing every season now fully watched.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

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
| **200** | Progress recorded. Check &#x60;completed&#x60; to know if the movie or episode reached 80%. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

