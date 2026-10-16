# MediaApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**getMedia**](MediaApi.md#getMedia) | **GET** /media/{mediaId} | Get media details |
| [**getMediaAssets**](MediaApi.md#getMediaAssets) | **GET** /media/{mediaId}/assets | Get media assets |
| [**getMediaProfileMeta**](MediaApi.md#getMediaProfileMeta) | **GET** /media/{mediaId}/profile_meta | Get profile interaction data for a title |
| [**getSeasonDetails**](MediaApi.md#getSeasonDetails) | **GET** /media/{mediaId}/seasons/{seasonNumber} | Get TV season details |
| [**getSeasonProfileMeta**](MediaApi.md#getSeasonProfileMeta) | **GET** /media/{mediaId}/seasons/{seasonNumber}/meta | Get which episodes of a TV season are finished |
| [**getSimilarRecommendations**](MediaApi.md#getSimilarRecommendations) | **GET** /media/{mediaId}/similar | Get similar titles |


<a id="getMedia"></a>
# **getMedia**
> MediaResponse getMedia(mediaId)

Get media details

Returns full details for a movie or TV show — title, overview, genres, release date, runtime, cast, crew, watch providers, and more. Pass &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  This is a public endpoint — no authentication required. Returns only generic catalog metadata; personalized fields live under &#x60;profile_meta&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = MediaApi()

val mediaId : kotlin.String = mediaId_example // kotlin.String | The unique identifier of the media item. Use `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
try {
    val result : MediaResponse = discovr.getMedia(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling MediaApi#getMedia")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling MediaApi#getMedia")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String**| The unique identifier of the media item. Use &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |

### Return type

[**MediaResponse**](MediaResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getMediaAssets"></a>
# **getMediaAssets**
> MediaAssetsResponse getMediaAssets(mediaId)

Get media assets

Returns the best-available poster, backdrop, logo, and trailer for a title — one resolved URL per asset type. Uses English/language-neutral preference for images, and picks the best official trailer when one is available.  This is a public endpoint — no authentication required. Returns only generic catalog metadata. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = MediaApi()

val mediaId : kotlin.String = mediaId_example // kotlin.String | The unique identifier of the media item. Use `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
try {
    val result : MediaAssetsResponse = discovr.getMediaAssets(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling MediaApi#getMediaAssets")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling MediaApi#getMediaAssets")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String**| The unique identifier of the media item. Use &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |

### Return type

[**MediaAssetsResponse**](MediaAssetsResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getMediaProfileMeta"></a>
# **getMediaProfileMeta**
> MediaProfileMeta getMediaProfileMeta(mediaId, providers)

Get profile interaction data for a title

Returns the current profile&#39;s interaction data for a title — everything you need to render the right UI state for that title.  Response includes: - **List status**: whether the title is liked, disliked, super-liked, watchlisted, or in watch history (&#x60;true&#x60;/&#x60;false&#x60; for each). - **Playback**: whether the title has a saved position, and the position details (progress 0–100, updated timestamp, season/episode for TV shows). - **Providers** *(optional)*: the streaming services where this title is available for the profile&#39;s selected region. Pass &#x60;providers&#x3D;true&#x60; to include this. - **Completion**: whether the profile has finished this title (&#x60;completed&#x60;), and for TV shows, which season numbers are fully watched (&#x60;completedSeasons&#x60;).  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = MediaApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = mediaId_example // kotlin.String | The unique identifier of the media item. Use `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
val providers : kotlin.Boolean = true // kotlin.Boolean | Set to `true` to include streaming provider availability in the response.
try {
    val result : MediaProfileMeta = discovr.getMediaProfileMeta(mediaId, providers)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling MediaApi#getMediaProfileMeta")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling MediaApi#getMediaProfileMeta")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The unique identifier of the media item. Use &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **providers** | **kotlin.Boolean**| Set to &#x60;true&#x60; to include streaming provider availability in the response. | [optional] [default to false] |

### Return type

[**MediaProfileMeta**](MediaProfileMeta.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getSeasonDetails"></a>
# **getSeasonDetails**
> SeasonDetailsResponse getSeasonDetails(mediaId, seasonNumber, language)

Get TV season details

Returns episode details for a specific TV season — episode titles, overviews, air dates, and episode numbers.  This is a public endpoint — no authentication required. Returns only generic catalog metadata. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = MediaApi()

val mediaId : kotlin.String = mediaId_example // kotlin.String | The unique identifier of the TV show (e.g., `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
val seasonNumber : kotlin.Int = 1 // kotlin.Int | The season number.
val language : kotlin.String = en // kotlin.String | ISO 639-1 language code for localised results (e.g., `en`).
try {
    val result : SeasonDetailsResponse = discovr.getSeasonDetails(mediaId, seasonNumber, language)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling MediaApi#getSeasonDetails")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling MediaApi#getSeasonDetails")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The unique identifier of the TV show (e.g., &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |
| **seasonNumber** | **kotlin.Int**| The season number. | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **language** | **kotlin.String**| ISO 639-1 language code for localised results (e.g., &#x60;en&#x60;). | [optional] |

### Return type

[**SeasonDetailsResponse**](SeasonDetailsResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getSeasonProfileMeta"></a>
# **getSeasonProfileMeta**
> SeasonProfileMeta getSeasonProfileMeta(mediaId, seasonNumber)

Get which episodes of a TV season are finished

Returns which episodes of a TV season the current profile has finished, plus whether the whole season is complete.  Pair this with &#x60;getSeasonDetails&#x60; for episode titles and artwork, and with &#x60;getMediaProfileMeta&#x60; for title-level state (liked, watchlisted, playback position). Use this endpoint when you need per-episode detail for a season view — for example, putting a checkmark on each episode the profile has finished. It reports finished or not; a half-watched episode isn&#39;t tracked, so it won&#39;t show a progress bar. The profile&#39;s place in the episode it is watching now is &#x60;playback&#x60; on &#x60;getMediaProfileMeta&#x60;.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = MediaApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = mediaId_example // kotlin.String | The unique identifier of the TV show (e.g., `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
val seasonNumber : kotlin.Int = 1 // kotlin.Int | The season number.
try {
    val result : SeasonProfileMeta = discovr.getSeasonProfileMeta(mediaId, seasonNumber)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling MediaApi#getSeasonProfileMeta")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling MediaApi#getSeasonProfileMeta")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The unique identifier of the TV show (e.g., &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **seasonNumber** | **kotlin.Int**| The season number. | |

### Return type

[**SeasonProfileMeta**](SeasonProfileMeta.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getSimilarRecommendations"></a>
# **getSimilarRecommendations**
> SimilarResponse getSimilarRecommendations(mediaId, language, page)

Get similar titles

Returns titles that are similar to the given movie or TV show. Useful for \&quot;More like this\&quot; sections.  This is a public endpoint — no authentication required. Returns only generic catalog metadata. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = MediaApi()

val mediaId : kotlin.String = mediaId_example // kotlin.String | The unique identifier of the media item. Use `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
val language : kotlin.String = en-US // kotlin.String | Language code for results (e.g., `en-US`).
val page : kotlin.Int = 1 // kotlin.Int | Page number for pagination (default: 1).
try {
    val result : SimilarResponse = discovr.getSimilarRecommendations(mediaId, language, page)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling MediaApi#getSimilarRecommendations")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling MediaApi#getSimilarRecommendations")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The unique identifier of the media item. Use &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |
| **language** | **kotlin.String**| Language code for results (e.g., &#x60;en-US&#x60;). | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **page** | **kotlin.Int**| Page number for pagination (default: 1). | [optional] [default to 1] |

### Return type

[**SimilarResponse**](SimilarResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

