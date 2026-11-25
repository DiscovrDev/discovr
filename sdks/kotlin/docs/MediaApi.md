# MediaApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**getMedia**](MediaApi.md#getMedia) | **GET** /media/{mediaId} | Get media details |
| [**getMediaAssets**](MediaApi.md#getMediaAssets) | **GET** /media/{mediaId}/assets | Get media assets |
| [**getSeasonDetails**](MediaApi.md#getSeasonDetails) | **GET** /media/{mediaId}/seasons/{seasonNumber} | Get TV season details |
| [**getSimilarRecommendations**](MediaApi.md#getSimilarRecommendations) | **GET** /media/{mediaId}/similar | Get similar titles |


<a id="getMedia"></a>
# **getMedia**
> MediaResponse getMedia(mediaId)

Get media details

Returns full details for a movie or TV show — title, overview, genres, release date, runtime, cast, crew, watch providers, and more. Pass &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. The response is generic catalog metadata; the profile&#39;s own state for the title (lists, playback, completion) is &#x60;getMediaProfileMeta&#x60;, which is also the call that records the title as opened. 

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


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getMediaAssets"></a>
# **getMediaAssets**
> MediaAssetsResponse getMediaAssets(mediaId)

Get media assets

Returns the best-available poster, backdrop, logo, and trailer for a title — one resolved URL per asset type. Uses English/language-neutral preference for images, and picks the best official trailer when one is available.  Row items already carry &#x60;logo_path&#x60; and &#x60;trailer&#x60; when they are served, so you only need this for a title you reached some other way, such as search.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. The response is generic catalog metadata, but the call needs a profile: the title you open is attributed to it. 

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


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getSeasonDetails"></a>
# **getSeasonDetails**
> SeasonDetailsResponse getSeasonDetails(mediaId, seasonNumber, language)

Get TV season details

Returns episode details for a specific TV season — episode titles, overviews, air dates, and episode numbers.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. The response is generic catalog metadata (what the profile has watched is &#x60;getSeasonProfileMeta&#x60;), but the call needs a profile. 

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


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getSimilarRecommendations"></a>
# **getSimilarRecommendations**
> SimilarResponse getSimilarRecommendations(mediaId, language, page)

Get similar titles

Returns titles that are similar to the given movie or TV show. Useful for \&quot;More like this\&quot; sections.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. The refs on the results are sealed for the profile that asked. 

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


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

