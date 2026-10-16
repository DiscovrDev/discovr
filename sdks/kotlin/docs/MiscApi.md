# MiscApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**getProfileImages**](MiscApi.md#getProfileImages) | **GET** /profile-images | List avatar images |
| [**searchGifs**](MiscApi.md#searchGifs) | **GET** /gif-search | Search GIFs |


<a id="getProfileImages"></a>
# **getProfileImages**
> ProfileImagesResponse getProfileImages(limit, pageToken)

List avatar images

Returns publicly available avatar images for use in profile setup. Paginated — pass &#x60;nextToken&#x60; from the previous response as &#x60;pageToken&#x60; to load more. These are curated still images.  No authentication required. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = MiscApi()

val limit : kotlin.Int = 16 // kotlin.Int | Maximum number of images to return (1–50).
val pageToken : kotlin.String = pageToken_example // kotlin.String | Pagination cursor from the `nextToken` field of the previous response. Omit to start from the beginning.
try {
    val result : ProfileImagesResponse = discovr.getProfileImages(limit, pageToken)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling MiscApi#getProfileImages")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling MiscApi#getProfileImages")
    e.printStackTrace()
}
```

### Parameters
| **limit** | **kotlin.Int**| Maximum number of images to return (1–50). | [optional] [default to 16] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **pageToken** | **kotlin.String**| Pagination cursor from the &#x60;nextToken&#x60; field of the previous response. Omit to start from the beginning. | [optional] |

### Return type

[**ProfileImagesResponse**](ProfileImagesResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="searchGifs"></a>
# **searchGifs**
> GifSearchResponse searchGifs(q, limit, pos, contentfilter, country, locale)

Search GIFs

Searches for animated GIFs by keyword. Use the &#x60;contentfilter&#x60; parameter to control content safety (&#x60;off&#x60;, &#x60;low&#x60;, &#x60;medium&#x60;, &#x60;high&#x60;); if you omit it, the filtering configured for Discovr&#39;s Klipy account applies, which is not a fixed level, so pass it explicitly when you need a guaranteed one. Results are paginated — pass &#x60;next&#x60; from the previous response as &#x60;pos&#x60; to load more.  Each result&#39;s &#x60;url&#x60; is the full-size file and is an **MP4 whenever one is available**, otherwise a GIF, so render it with a video player or an image view according to its file extension (see &#x60;avatarMediaType&#x60; on profiles). &#x60;preview.url&#x60; is a lighter version for grids; use it for thumbnails and save &#x60;url&#x60; only for the one the user picks.  Klipy attribution is required wherever you show these results.  No authentication required. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = MiscApi()

val q : kotlin.String = happy dance // kotlin.String | Search term.
val limit : kotlin.Int = 20 // kotlin.Int | Maximum number of results to return (1–50).
val pos : kotlin.String = 1:20 // kotlin.String | Pagination cursor from the `next` field of the previous response. Omit to start from the beginning.
val contentfilter : kotlin.String = medium // kotlin.String | Content safety level. `high` is the most restrictive; `off` applies no filtering. Omit it and Discovr's default filtering applies, not a fixed level.
val country : kotlin.String = US // kotlin.String | ISO 3166-1 alpha-2 country code for regional content preferences (e.g., `US`). Takes precedence over `locale`.
val locale : kotlin.String = en_US // kotlin.String | Only its region part is used (`en_US` is treated as `US`), and only when `country` is not sent.
try {
    val result : GifSearchResponse = discovr.searchGifs(q, limit, pos, contentfilter, country, locale)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling MiscApi#searchGifs")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling MiscApi#searchGifs")
    e.printStackTrace()
}
```

### Parameters
| **q** | **kotlin.String**| Search term. | |
| **limit** | **kotlin.Int**| Maximum number of results to return (1–50). | [optional] [default to 20] |
| **pos** | **kotlin.String**| Pagination cursor from the &#x60;next&#x60; field of the previous response. Omit to start from the beginning. | [optional] |
| **contentfilter** | **kotlin.String**| Content safety level. &#x60;high&#x60; is the most restrictive; &#x60;off&#x60; applies no filtering. Omit it and Discovr&#39;s default filtering applies, not a fixed level. | [optional] [enum: high, medium, low, off] |
| **country** | **kotlin.String**| ISO 3166-1 alpha-2 country code for regional content preferences (e.g., &#x60;US&#x60;). Takes precedence over &#x60;locale&#x60;. | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **locale** | **kotlin.String**| Only its region part is used (&#x60;en_US&#x60; is treated as &#x60;US&#x60;), and only when &#x60;country&#x60; is not sent. | [optional] |

### Return type

[**GifSearchResponse**](GifSearchResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

