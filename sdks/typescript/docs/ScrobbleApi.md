# ScrobbleApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**markUnwatched**](ScrobbleApi.md#markunwatched) | **DELETE** /profile/watched/{mediaId} | Mark a title as unwatched |
| [**scrobble**](ScrobbleApi.md#scrobble) | **POST** /profile/scrobble/{mediaId} | Record playback progress |
| [**scrobbleSkip**](ScrobbleApi.md#scrobbleskip) | **POST** /profile/scrobble/{mediaId}/skip | Record a skip event |



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

