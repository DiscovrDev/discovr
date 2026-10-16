# ScrobbleApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**markUnwatched**](ScrobbleApi.md#markUnwatched) | **DELETE** /profile/watched/{mediaId} | Mark a title as unwatched |
| [**scrobble**](ScrobbleApi.md#scrobble) | **POST** /profile/scrobble/{mediaId} | Record playback progress |
| [**scrobbleSkip**](ScrobbleApi.md#scrobbleSkip) | **POST** /profile/scrobble/{mediaId}/skip | Record a skip event |


<a id="markUnwatched"></a>
# **markUnwatched**
> SuccessMessage markUnwatched(mediaId, season, episode)

Mark a title as unwatched

Takes a movie, a TV show, a season, or an episode back to unwatched, in one call.  It removes the history that made it watched, takes it out of the user&#39;s **in-progress** list if that is where it was, and brings a TV show&#39;s &#x60;completed&#x60; state back in line. Use it for a \&quot;Mark as unwatched\&quot; button.  For TV shows, &#x60;season&#x60; and &#x60;episode&#x60; choose how much to undo:  - Omit both to undo **the whole show**, every season. - Pass &#x60;season&#x60; to undo **that season**: its episodes, and any entry that counted the whole season as watched. - Pass &#x60;season&#x60; and &#x60;episode&#x60; to undo **that episode**.  Calling it for a title that isn&#39;t watched changes nothing and still succeeds, so it is safe to retry.  This is not the same as [&#x60;DELETE /profile/history/{mediaId}&#x60;](/api-reference/discovr/delete-history-item), which removes history entries and nothing else. Marking something unwatched with that call and &#x60;DELETE /profile/playback/{mediaId}&#x60; leaves a TV show&#39;s &#x60;completed&#x60; out of date unless they run in a particular order; this endpoint does the right thing whichever way you reach it.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ScrobbleApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = TV_1396 // kotlin.String | The media ID in `MV_<number>` or `TV_<number>` format (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. 
val season : kotlin.Int = 1 // kotlin.Int | TV only. Season number. Omit to undo every season of the show.
val episode : kotlin.Int = 5 // kotlin.Int | TV only, and only together with `season`. Episode number. Omit to undo the whole season.
try {
    val result : SuccessMessage = discovr.markUnwatched(mediaId, season, episode)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ScrobbleApi#markUnwatched")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ScrobbleApi#markUnwatched")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The media ID in &#x60;MV_&lt;number&gt;&#x60; or &#x60;TV_&lt;number&gt;&#x60; format (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id.  | |
| **season** | **kotlin.Int**| TV only. Season number. Omit to undo every season of the show. | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **episode** | **kotlin.Int**| TV only, and only together with &#x60;season&#x60;. Episode number. Omit to undo the whole season. | [optional] |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="scrobble"></a>
# **scrobble**
> ScrobbleResponse scrobble(mediaId, scrobbleProgressBody)

Record playback progress

Scrobbling is Discovr&#39;s single-call way to track playback. One call updates everything — progress, history, and watchlist — so you don&#39;t need to coordinate multiple endpoints.  Call this about every 30 seconds while the user watches, and straight away on pause, resume, seek and when playback ends. Discovr handles the rest:  - The item stays in the user&#39;s **in-progress** list until they finish watching. - Once they&#39;ve watched 80% or more, it&#39;s marked as complete and moves to their **history**. - For movies, the item is removed from the user&#39;s watchlist once they&#39;ve watched more than 20% — so it clears as soon as they&#39;re clearly watching it. For TV episodes, it&#39;s removed from the watchlist once the episode is complete (≥80%).  For TV shows, include &#x60;season&#x60; and &#x60;episode&#x60; in the request body so history is tracked per episode.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ScrobbleApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = TV_1396 // kotlin.String | The media ID in `MV_<number>` or `TV_<number>` format (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
val scrobbleProgressBody : ScrobbleProgressBody = {"progress":15.5,"tv":{"season":1,"episode":2}} // ScrobbleProgressBody | 
try {
    val result : ScrobbleResponse = discovr.scrobble(mediaId, scrobbleProgressBody)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ScrobbleApi#scrobble")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ScrobbleApi#scrobble")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The media ID in &#x60;MV_&lt;number&gt;&#x60; or &#x60;TV_&lt;number&gt;&#x60; format (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **scrobbleProgressBody** | [**ScrobbleProgressBody**](ScrobbleProgressBody.md)|  | |

### Return type

[**ScrobbleResponse**](ScrobbleResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="scrobbleSkip"></a>
# **scrobbleSkip**
> ScrobbleSkipResponse scrobbleSkip(mediaId, scrobbleSkipBody)

Record a skip event

Signals that the user jumped to another point in the content, forward (a skip) or backward (a rewind). Used for watch analytics. Returns immediately — no side effects on lists or history.  &#x60;from&#x60; and &#x60;to&#x60; are playback positions as a percentage (0–100) and must differ; &#x60;from&#x60; higher than &#x60;to&#x60; is a jump backward. &#x60;duration&#x60; is how many seconds were jumped. After a jump, also send the position the viewer landed on as a progress update with &#x60;POST /profile/scrobble/{mediaId}&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ScrobbleApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = TV_1396 // kotlin.String | The media ID in `MV_<number>` or `TV_<number>` format (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
val scrobbleSkipBody : ScrobbleSkipBody = {"from":10,"to":20,"duration":45,"tv":{"season":1,"episode":4}} // ScrobbleSkipBody | 
try {
    val result : ScrobbleSkipResponse = discovr.scrobbleSkip(mediaId, scrobbleSkipBody)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ScrobbleApi#scrobbleSkip")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ScrobbleApi#scrobbleSkip")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The media ID in &#x60;MV_&lt;number&gt;&#x60; or &#x60;TV_&lt;number&gt;&#x60; format (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **scrobbleSkipBody** | [**ScrobbleSkipBody**](ScrobbleSkipBody.md)|  | |

### Return type

[**ScrobbleSkipResponse**](ScrobbleSkipResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

