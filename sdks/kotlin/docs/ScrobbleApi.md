# ScrobbleApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**markUnwatched**](ScrobbleApi.md#markUnwatched) | **DELETE** /profile/titles/{mediaId}/watched | Mark a title, season, or episode as unwatched |
| [**markWatched**](ScrobbleApi.md#markWatched) | **PUT** /profile/titles/{mediaId}/watched | Mark a title, season, or episode as watched |
| [**scrobble**](ScrobbleApi.md#scrobble) | **POST** /profile/scrobble/{mediaId} | Record playback progress |


<a id="markUnwatched"></a>
# **markUnwatched**
> TitleState markUnwatched(mediaId, season, episode)

Mark a title, season, or episode as unwatched

Takes a movie, a TV show, a season, or an episode back to unwatched in one atomic call.  It removes the watched state for that scope and clears any in-progress Continue Watching position inside it. Calling it for a title that isn&#39;t watched changes nothing and still succeeds, so it&#39;s safe to retry.  For TV shows, &#x60;season&#x60; and &#x60;episode&#x60; choose how much to undo:  - Omit both to undo **the whole show**, every season. - Pass &#x60;season&#x60; to undo **that season**. - Pass &#x60;season&#x60; and &#x60;episode&#x60; to undo **that episode**.  Returns the title&#39;s updated &#x60;TitleState&#x60;, so you don&#39;t need to refetch &#x60;getTitleState&#x60;.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ScrobbleApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = TV_1396 // kotlin.String | The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 
val season : kotlin.Int = 1 // kotlin.Int | TV only. Season number. Omit to undo every season of the show.
val episode : kotlin.Int = 5 // kotlin.Int | TV only, and only together with `season`. Episode number. Omit to undo the whole season.
try {
    val result : TitleState = discovr.markUnwatched(mediaId, season, episode)
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
| **mediaId** | **kotlin.String**| The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | |
| **season** | **kotlin.Int**| TV only. Season number. Omit to undo every season of the show. | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **episode** | **kotlin.Int**| TV only, and only together with &#x60;season&#x60;. Episode number. Omit to undo the whole season. | [optional] |

### Return type

[**TitleState**](TitleState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="markWatched"></a>
# **markWatched**
> TitleState markWatched(mediaId, season, episode)

Mark a title, season, or episode as watched

Marks a movie, an entire TV show, a season, or a single episode as watched in one atomic call.  For TV shows, &#x60;season&#x60; and &#x60;episode&#x60; pick the scope:  - Omit both to mark **every aired episode** across all regular seasons (season 1 and up) as watched. Specials (season &#x60;0&#x60;) are excluded. - Pass &#x60;season&#x60; to mark every aired episode of **that season**. - Pass &#x60;season&#x60; and &#x60;episode&#x60; to mark **that episode**.  Any in-progress Continue Watching position within the marked scope is cleared automatically. Returns the title&#39;s updated &#x60;TitleState&#x60;, so you don&#39;t need to refetch &#x60;getTitleState&#x60;.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ScrobbleApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = TV_1396 // kotlin.String | The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 
val season : kotlin.Int = 1 // kotlin.Int | TV only. Season number. Omit to mark every aired season of the show.
val episode : kotlin.Int = 5 // kotlin.Int | TV only, and only together with `season`. Episode number. Omit to mark the whole season.
try {
    val result : TitleState = discovr.markWatched(mediaId, season, episode)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ScrobbleApi#markWatched")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ScrobbleApi#markWatched")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | |
| **season** | **kotlin.Int**| TV only. Season number. Omit to mark every aired season of the show. | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **episode** | **kotlin.Int**| TV only, and only together with &#x60;season&#x60;. Episode number. Omit to mark the whole season. | [optional] |

### Return type

[**TitleState**](TitleState.md)

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

Scrobbling is Discovr&#39;s single-call way to track playback. One call updates live resume progress, watch history, completion, and the watchlist.  Send the viewer&#39;s real position when playback starts (not &#x60;0&#x60; when resuming), about every 30 seconds while watching, and right away on pause, resume, seek, and completion. Discovr handles the rest:  - The title stays in Continue Watching until the movie or episode crosses 80%. - Once progress reaches 20% or more, the title is automatically removed from the watchlist — for both movies and TV shows. - Once progress reaches 80% or more, the movie or episode is marked watched and leaves Continue Watching. Lower progress later (such as a rewind) moves the live position without undoing completion — use &#x60;markUnwatched&#x60; to undo a watch. - For TV shows, include &#x60;season&#x60; and &#x60;episode&#x60; in &#x60;tv&#x60;. When an episode crosses 80%, the response includes &#x60;completedSeasons&#x60; listing every season now fully watched.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

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

