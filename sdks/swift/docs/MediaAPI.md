# MediaAPI

All URIs are relative to *https://api.discovr.media*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getMedia**](MediaAPI.md#getmedia) | **GET** /media/{mediaId} | Get media details
[**getMediaAssets**](MediaAPI.md#getmediaassets) | **GET** /media/{mediaId}/assets | Get media assets
[**getMediaProfileMeta**](MediaAPI.md#getmediaprofilemeta) | **GET** /media/{mediaId}/profile_meta | Get profile interaction data for a title
[**getSeasonDetails**](MediaAPI.md#getseasondetails) | **GET** /media/{mediaId}/seasons/{seasonNumber} | Get TV season details
[**getSeasonProfileMeta**](MediaAPI.md#getseasonprofilemeta) | **GET** /media/{mediaId}/seasons/{seasonNumber}/meta | Get which episodes of a TV season are finished
[**getSimilarRecommendations**](MediaAPI.md#getsimilarrecommendations) | **GET** /media/{mediaId}/similar | Get similar titles


# **getMedia**
```swift
    open class func getMedia(mediaId: String, completion: @escaping (_ data: MediaResponse?, _ error: Error?) -> Void)
```

Get media details

Returns full details for a movie or TV show — title, overview, genres, release date, runtime, cast, crew, watch providers, and more. Pass `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  **Auth tier:** session — send your session token in `Authorization: Bearer`. The response is generic catalog metadata; the profile's own state for the title (lists, playback, completion) is `getMediaProfileMeta`, which is also the call that records the title as opened. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The unique identifier of the media item. Use `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 

Task {
    do {
        let result = try await discovr.getMedia(mediaId: mediaId)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | The unique identifier of the media item. Use &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 

### Return type

[**MediaResponse**](MediaResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMediaAssets**
```swift
    open class func getMediaAssets(mediaId: String, completion: @escaping (_ data: MediaAssetsResponse?, _ error: Error?) -> Void)
```

Get media assets

Returns the best-available poster, backdrop, logo, and trailer for a title — one resolved URL per asset type. Uses English/language-neutral preference for images, and picks the best official trailer when one is available.  **Auth tier:** session — send your session token in `Authorization: Bearer`. The response is generic catalog metadata, but the call needs a profile: the title you open is attributed to it. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The unique identifier of the media item. Use `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 

Task {
    do {
        let result = try await discovr.getMediaAssets(mediaId: mediaId)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | The unique identifier of the media item. Use &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 

### Return type

[**MediaAssetsResponse**](MediaAssetsResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMediaProfileMeta**
```swift
    open class func getMediaProfileMeta(mediaId: String, providers: Bool? = nil, completion: @escaping (_ data: MediaProfileMeta?, _ error: Error?) -> Void)
```

Get profile interaction data for a title

Returns the current profile's interaction data for a title — everything you need to render the right UI state for that title.  Response includes: - **List status**: whether the title is liked, disliked, super-liked, watchlisted, or in watch history (`true`/`false` for each). - **Playback**: whether the title has a saved position, and the position details (progress 0–100, updated timestamp, season/episode for TV shows). - **Providers** *(optional)*: the streaming services where this title is available for the profile's selected region. Pass `providers=true` to include this. - **Completion**: whether the profile has finished this title (`completed`), and for TV shows, which season numbers are fully watched (`completedSeasons`).  **This call directly affects the profile's recommendations.** It records that the viewer opened the title (and is the only endpoint that does), so only call it when the title screen actually opens — never prefetch or hover-load it. Calling it for tiles the viewer didn't open registers similarly to liking those titles and will skew their recommendations. Pass the item's `ref` when you have one.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The unique identifier of the media item. Use `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
let providers: Bool = true // Set to `true` to include streaming provider availability in the response. (optional) (default: false)

Task {
    do {
        let result = try await discovr.getMediaProfileMeta(mediaId: mediaId, providers: providers)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | The unique identifier of the media item. Use &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 
 **providers** | **Bool** | Set to &#x60;true&#x60; to include streaming provider availability in the response. | [optional] [default to false]

### Return type

[**MediaProfileMeta**](MediaProfileMeta.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSeasonDetails**
```swift
    open class func getSeasonDetails(mediaId: String, seasonNumber: Int, language: String? = nil, completion: @escaping (_ data: SeasonDetailsResponse?, _ error: Error?) -> Void)
```

Get TV season details

Returns episode details for a specific TV season — episode titles, overviews, air dates, and episode numbers.  **Auth tier:** session — send your session token in `Authorization: Bearer`. The response is generic catalog metadata (what the profile has watched is `getSeasonProfileMeta`), but the call needs a profile. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The unique identifier of the TV show (e.g., `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
let seasonNumber: Int = 987 // The season number.
let language: String = "language_example" // ISO 639-1 language code for localised results (e.g., `en`). (optional)

Task {
    do {
        let result = try await discovr.getSeasonDetails(mediaId: mediaId, seasonNumber: seasonNumber, language: language)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | The unique identifier of the TV show (e.g., &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 
 **seasonNumber** | **Int** | The season number. | 
 **language** | **String** | ISO 639-1 language code for localised results (e.g., &#x60;en&#x60;). | [optional] 

### Return type

[**SeasonDetailsResponse**](SeasonDetailsResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSeasonProfileMeta**
```swift
    open class func getSeasonProfileMeta(mediaId: String, seasonNumber: Int, completion: @escaping (_ data: SeasonProfileMeta?, _ error: Error?) -> Void)
```

Get which episodes of a TV season are finished

Returns which episodes of a TV season the current profile has finished, plus whether the whole season is complete.  Pair this with `getSeasonDetails` for episode titles and artwork, and with `getMediaProfileMeta` for title-level state (liked, watchlisted, playback position). Use this endpoint when you need per-episode detail for a season view — for example, putting a checkmark on each episode the profile has finished. It reports finished or not; a half-watched episode isn't tracked, so it won't show a progress bar. The profile's place in the episode it is watching now is `playback` on `getMediaProfileMeta`.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The unique identifier of the TV show (e.g., `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
let seasonNumber: Int = 987 // The season number.

Task {
    do {
        let result = try await discovr.getSeasonProfileMeta(mediaId: mediaId, seasonNumber: seasonNumber)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | The unique identifier of the TV show (e.g., &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 
 **seasonNumber** | **Int** | The season number. | 

### Return type

[**SeasonProfileMeta**](SeasonProfileMeta.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSimilarRecommendations**
```swift
    open class func getSimilarRecommendations(mediaId: String, language: String? = nil, page: Int? = nil, completion: @escaping (_ data: SimilarResponse?, _ error: Error?) -> Void)
```

Get similar titles

Returns titles that are similar to the given movie or TV show. Useful for \"More like this\" sections.  **Auth tier:** session — send your session token in `Authorization: Bearer`. The refs on the results are sealed for the profile that asked. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The unique identifier of the media item. Use `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
let language: String = "language_example" // Language code for results (e.g., `en-US`). (optional)
let page: Int = 987 // Page number for pagination (default: 1). (optional) (default: 1)

Task {
    do {
        let result = try await discovr.getSimilarRecommendations(mediaId: mediaId, language: language, page: page)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | The unique identifier of the media item. Use &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 
 **language** | **String** | Language code for results (e.g., &#x60;en-US&#x60;). | [optional] 
 **page** | **Int** | Page number for pagination (default: 1). | [optional] [default to 1]

### Return type

[**SimilarResponse**](SimilarResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

