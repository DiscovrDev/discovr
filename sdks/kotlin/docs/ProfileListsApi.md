# ProfileListsApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**addToWatchlist**](ProfileListsApi.md#addToWatchlist) | **PUT** /profile/titles/{mediaId}/watchlist | Add a title to the watchlist |
| [**clearRating**](ProfileListsApi.md#clearRating) | **DELETE** /profile/titles/{mediaId}/rating | Clear a title&#39;s rating |
| [**deletePlaybackItem**](ProfileListsApi.md#deletePlaybackItem) | **DELETE** /profile/playback/{mediaId} | Remove a title from Continue Watching |
| [**getPlaybackItems**](ProfileListsApi.md#getPlaybackItems) | **GET** /profile/playback | Get playback items |
| [**getSeasonState**](ProfileListsApi.md#getSeasonState) | **GET** /profile/titles/{mediaId}/seasons/{seasonNumber} | Get which episodes of a TV season are watched |
| [**getTitleState**](ProfileListsApi.md#getTitleState) | **GET** /profile/titles/{mediaId} | Get the active profile&#39;s state for a title |
| [**getTitles**](ProfileListsApi.md#getTitles) | **GET** /profile/titles | List titles by rating, watchlist, or watch history |
| [**importHistory**](ProfileListsApi.md#importHistory) | **POST** /profile/history | Import a watch history entry |
| [**removeFromWatchlist**](ProfileListsApi.md#removeFromWatchlist) | **DELETE** /profile/titles/{mediaId}/watchlist | Remove a title from the watchlist |
| [**setRating**](ProfileListsApi.md#setRating) | **PUT** /profile/titles/{mediaId}/rating | Set a title&#39;s rating |


<a id="addToWatchlist"></a>
# **addToWatchlist**
> TitleState addToWatchlist(mediaId)

Add a title to the watchlist

Adds a title to the active profile&#39;s watchlist. Safe to call if it is already on the watchlist.  Returns the title&#39;s updated &#x60;TitleState&#x60;, so you can update your UI immediately without calling &#x60;getTitleState&#x60; again.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 
try {
    val result : TitleState = discovr.addToWatchlist(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#addToWatchlist")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#addToWatchlist")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String**| The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | |

### Return type

[**TitleState**](TitleState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="clearRating"></a>
# **clearRating**
> TitleState clearRating(mediaId)

Clear a title&#39;s rating

Clears the active profile&#39;s rating for a title. Safe to call if the title has no rating.  Returns the title&#39;s updated &#x60;TitleState&#x60;, so you can update your UI immediately without calling &#x60;getTitleState&#x60; again.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 
try {
    val result : TitleState = discovr.clearRating(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#clearRating")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#clearRating")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String**| The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | |

### Return type

[**TitleState**](TitleState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="deletePlaybackItem"></a>
# **deletePlaybackItem**
> SuccessMessage deletePlaybackItem(mediaId)

Remove a title from Continue Watching

Removes a title from the in-progress Continue Watching list without changing its watched history. Use &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;). 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | The media ID of the title to remove. Format: `MV_<number>` for movies, `TV_<number>` for TV shows.  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
try {
    val result : SuccessMessage = discovr.deletePlaybackItem(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#deletePlaybackItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#deletePlaybackItem")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String**| The media ID of the title to remove. Format: &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows.  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getPlaybackItems"></a>
# **getPlaybackItems**
> PlaybackListResponse getPlaybackItems(nextPageToken, limit)

Get playback items

Returns the profile&#39;s in-progress titles — everything with a saved playback position. Ordered by most recently updated. Use this to build a \&quot;Continue Watching\&quot; row.  Each item includes a &#x60;progress&#x60; field (0–100) showing how far through the title the user is. To update progress as a viewer watches, call &#x60;POST /profile/scrobble/{mediaId}&#x60;.  **Pagination:** Pass &#x60;nextPageToken&#x60; from the previous response to fetch the next page. If &#x60;hasMore&#x60; is &#x60;true&#x60;, more items are available. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val nextPageToken : kotlin.String = nextPageToken_example // kotlin.String | Opaque token from previous page for pagination
val limit : kotlin.Int = 56 // kotlin.Int | Maximum number of items to return (1-50, default: 10)
try {
    val result : PlaybackListResponse = discovr.getPlaybackItems(nextPageToken, limit)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#getPlaybackItems")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#getPlaybackItems")
    e.printStackTrace()
}
```

### Parameters
| **nextPageToken** | **kotlin.String**| Opaque token from previous page for pagination | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **limit** | **kotlin.Int**| Maximum number of items to return (1-50, default: 10) | [optional] [default to 10] |

### Return type

[**PlaybackListResponse**](PlaybackListResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getSeasonState"></a>
# **getSeasonState**
> SeasonState getSeasonState(mediaId, seasonNumber)

Get which episodes of a TV season are watched

Returns which episodes of a single TV season the active profile has finished, plus whether the season as a whole is complete.  A season counts as complete when every aired episode in it is watched. Specials (season &#x60;0&#x60;) never count toward show completion. Pair this with &#x60;getSeasonDetails&#x60; for episode titles and artwork, and with &#x60;getTitleState&#x60; for title-level state and live playback position.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = TV_1396 // kotlin.String | The TV show's media ID (`TV_<id>`), or an item `ref`. 
val seasonNumber : kotlin.Int = 1 // kotlin.Int | The season number (0 for specials, 1+ for regular seasons).
try {
    val result : SeasonState = discovr.getSeasonState(mediaId, seasonNumber)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#getSeasonState")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#getSeasonState")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The TV show&#39;s media ID (&#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **seasonNumber** | **kotlin.Int**| The season number (0 for specials, 1+ for regular seasons). | |

### Return type

[**SeasonState**](SeasonState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getTitleState"></a>
# **getTitleState**
> TitleState getTitleState(mediaId, providers)

Get the active profile&#39;s state for a title

Returns everything your UI needs to show the active profile&#39;s relationship with a title:  - **Rating**: &#x60;liked&#x60;, &#x60;disliked&#x60;, &#x60;super_liked&#x60;, or &#x60;null&#x60;. - **Watchlist**: whether the title is saved to the watchlist. - **Watch progress &amp; completion**: whether the profile has started (&#x60;watched&#x60;) or finished (&#x60;completed&#x60;) the title, total &#x60;plays&#x60;, watched &#x60;episodes&#x60; and &#x60;completedSeasons&#x60; for TV shows, and the live &#x60;playback&#x60; resume position when mid-watch. - **Providers** *(optional)*: pass &#x60;providers&#x3D;true&#x60; to include streaming availability filtered to the account&#39;s chosen services.  **Title opens &amp; recommendations.** Calling &#x60;GET /profile/titles/{mediaId}&#x60; records that the viewer opened the title and directly affects the profile&#39;s recommendations. Only call it when the title screen actually opens — prefetching or calling it on hover/focus registers every loaded tile similarly to the viewer liking the title and will skew their recommendations. Every state write (&#x60;setRating&#x60;, &#x60;clearRating&#x60;, &#x60;addToWatchlist&#x60;, &#x60;removeFromWatchlist&#x60;, &#x60;markWatched&#x60;, &#x60;markUnwatched&#x60;) returns the updated &#x60;TitleState&#x60;, so you don&#39;t need to refetch this endpoint after a change.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | The title's media ID (`MV_<id>` for movies, `TV_<id>` for TV shows).  Also accepts an item's `ref` in place of the ID. Prefer the `ref` when you have one — it resolves to the same title and sharpens recommendations. 
val providers : kotlin.Boolean = true // kotlin.Boolean | Set to `true` to include streaming provider availability filtered to the account's selected services.
try {
    val result : TitleState = discovr.getTitleState(mediaId, providers)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#getTitleState")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#getTitleState")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; for movies, &#x60;TV_&lt;id&gt;&#x60; for TV shows).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the ID. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens recommendations.  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **providers** | **kotlin.Boolean**| Set to &#x60;true&#x60; to include streaming provider availability filtered to the account&#39;s selected services. | [optional] [default to false] |

### Return type

[**TitleState**](TitleState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getTitles"></a>
# **getTitles**
> TitleListResponse getTitles(rating, watchlist, watched, nextPageToken, limit)

List titles by rating, watchlist, or watch history

Returns a paginated list of titles for the active profile, ordered most recent first.  Pass **exactly one** filter query parameter:  - &#x60;rating&#x3D;liked&#x60;, &#x60;rating&#x3D;disliked&#x60;, or &#x60;rating&#x3D;super_liked&#x60; — titles with that rating, newest rated first. - &#x60;watchlist&#x3D;true&#x60; — the profile&#39;s watchlist, newest added first. - &#x60;watched&#x3D;true&#x60; — the profile&#39;s watch history (one entry per title, with &#x60;completed&#x60;, &#x60;plays&#x60;, and the last episode for TV shows), most recently watched first.  Each item includes a &#x60;ref&#x60; alongside its &#x60;id&#x60;. Pass the &#x60;ref&#x60; when the viewer opens or acts on the title.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val rating : Rating =  // Rating | Filter by rating (`liked`, `disliked`, or `super_liked`).
val watchlist : kotlin.Boolean = true // kotlin.Boolean | Set to `true` to list the profile's watchlist.
val watched : kotlin.Boolean = true // kotlin.Boolean | Set to `true` to list the profile's watch history (one row per title).
val nextPageToken : kotlin.String = nextPageToken_example // kotlin.String | Opaque cursor token from the previous page.
val limit : kotlin.Int = 56 // kotlin.Int | Maximum number of titles to return (1–50, default 10).
try {
    val result : TitleListResponse = discovr.getTitles(rating, watchlist, watched, nextPageToken, limit)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#getTitles")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#getTitles")
    e.printStackTrace()
}
```

### Parameters
| **rating** | [**Rating**](.md)| Filter by rating (&#x60;liked&#x60;, &#x60;disliked&#x60;, or &#x60;super_liked&#x60;). | [optional] [enum: liked, disliked, super_liked] |
| **watchlist** | **kotlin.Boolean**| Set to &#x60;true&#x60; to list the profile&#39;s watchlist. | [optional] |
| **watched** | **kotlin.Boolean**| Set to &#x60;true&#x60; to list the profile&#39;s watch history (one row per title). | [optional] |
| **nextPageToken** | **kotlin.String**| Opaque cursor token from the previous page. | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **limit** | **kotlin.Int**| Maximum number of titles to return (1–50, default 10). | [optional] [default to 10] |

### Return type

[**TitleListResponse**](TitleListResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="importHistory"></a>
# **importHistory**
> TitleState importHistory(importHistoryPayload)

Import a watch history entry

Imports a previously watched movie, show, season, or episode from an external source.  - &#x60;mediaId&#x60;: the title to import (&#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows). - &#x60;imported&#x60;: required string naming the external source (for example &#x60;\&quot;trakt\&quot;&#x60;). - &#x60;updatedAt&#x60;: optional ISO 8601 timestamp of when it was watched. Defaults to now. - &#x60;season&#x60; / &#x60;episode&#x60;: optional TV scope. Omit both to import all aired episodes of the show; pass &#x60;season&#x60; to import that season; pass both to import a single episode.  For live viewing use &#x60;scrobble()&#x60;, and for interactive \&quot;Mark as watched\&quot; buttons use &#x60;markWatched()&#x60;. To read watch history, use &#x60;GET /profile/titles?watched&#x3D;true&#x60;.  Returns the title&#39;s updated &#x60;TitleState&#x60;.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val importHistoryPayload : ImportHistoryPayload = {"mediaId":"TV_1396","imported":"trakt","updatedAt":"2023-01-15T20:00:00.000Z","season":1,"episode":5} // ImportHistoryPayload | 
try {
    val result : TitleState = discovr.importHistory(importHistoryPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#importHistory")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#importHistory")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **importHistoryPayload** | [**ImportHistoryPayload**](ImportHistoryPayload.md)|  | |

### Return type

[**TitleState**](TitleState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="removeFromWatchlist"></a>
# **removeFromWatchlist**
> TitleState removeFromWatchlist(mediaId)

Remove a title from the watchlist

Removes a title from the active profile&#39;s watchlist. Safe to call if it is not on the watchlist.  Returns the title&#39;s updated &#x60;TitleState&#x60;, so you can update your UI immediately without calling &#x60;getTitleState&#x60; again.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 
try {
    val result : TitleState = discovr.removeFromWatchlist(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#removeFromWatchlist")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#removeFromWatchlist")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String**| The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | |

### Return type

[**TitleState**](TitleState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="setRating"></a>
# **setRating**
> TitleState setRating(mediaId, setRatingPayload)

Set a title&#39;s rating

Sets the active profile&#39;s rating for a title to &#x60;liked&#x60;, &#x60;disliked&#x60;, or &#x60;super_liked&#x60;.  Ratings are mutually exclusive: setting a new rating automatically replaces any previous one. Setting the rating the title already has is a safe no-op.  Returns the title&#39;s updated &#x60;TitleState&#x60;, so you can update your UI immediately without calling &#x60;getTitleState&#x60; again.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 
val setRatingPayload : SetRatingPayload = {"value":"liked"} // SetRatingPayload | 
try {
    val result : TitleState = discovr.setRating(mediaId, setRatingPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#setRating")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#setRating")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **setRatingPayload** | [**SetRatingPayload**](SetRatingPayload.md)|  | |

### Return type

[**TitleState**](TitleState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

