# ScrobbleAPI

All URIs are relative to *https://api.discovr.media*

Method | HTTP request | Description
------------- | ------------- | -------------
[**markUnwatched**](ScrobbleAPI.md#markunwatched) | **DELETE** /profile/titles/{mediaId}/watched | Mark a title, season, or episode as unwatched
[**markWatched**](ScrobbleAPI.md#markwatched) | **PUT** /profile/titles/{mediaId}/watched | Mark a title, season, or episode as watched
[**scrobble**](ScrobbleAPI.md#scrobble) | **POST** /profile/scrobble/{mediaId} | Record playback progress


# **markUnwatched**
```swift
    open class func markUnwatched(mediaId: String, season: Int? = nil, episode: Int? = nil, completion: @escaping (_ data: TitleState?, _ error: Error?) -> Void)
```

Mark a title, season, or episode as unwatched

Takes a movie, a TV show, a season, or an episode back to unwatched in one atomic call.  It removes the watched state for that scope and clears any in-progress Continue Watching position inside it. Calling it for a title that isn't watched changes nothing and still succeeds, so it's safe to retry.  For TV shows, `season` and `episode` choose how much to undo:  - Omit both to undo **the whole show**, every season. - Pass `season` to undo **that season**. - Pass `season` and `episode` to undo **that episode**.  Returns the title's updated `TitleState`, so you don't need to refetch `getTitleState`.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 
let season: Int = 987 // TV only. Season number. Omit to undo every season of the show. (optional)
let episode: Int = 987 // TV only, and only together with `season`. Episode number. Omit to undo the whole season. (optional)

Task {
    do {
        let result = try await discovr.markUnwatched(mediaId: mediaId, season: season, episode: episode)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | 
 **season** | **Int** | TV only. Season number. Omit to undo every season of the show. | [optional] 
 **episode** | **Int** | TV only, and only together with &#x60;season&#x60;. Episode number. Omit to undo the whole season. | [optional] 

### Return type

[**TitleState**](TitleState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **markWatched**
```swift
    open class func markWatched(mediaId: String, season: Int? = nil, episode: Int? = nil, completion: @escaping (_ data: TitleState?, _ error: Error?) -> Void)
```

Mark a title, season, or episode as watched

Marks a movie, an entire TV show, a season, or a single episode as watched in one atomic call.  For TV shows, `season` and `episode` pick the scope:  - Omit both to mark **every aired episode** across all regular seasons (season 1 and up) as watched. Specials (season `0`) are excluded. - Pass `season` to mark every aired episode of **that season**. - Pass `season` and `episode` to mark **that episode**.  Any in-progress Continue Watching position within the marked scope is cleared automatically. Returns the title's updated `TitleState`, so you don't need to refetch `getTitleState`.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 
let season: Int = 987 // TV only. Season number. Omit to mark every aired season of the show. (optional)
let episode: Int = 987 // TV only, and only together with `season`. Episode number. Omit to mark the whole season. (optional)

Task {
    do {
        let result = try await discovr.markWatched(mediaId: mediaId, season: season, episode: episode)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | 
 **season** | **Int** | TV only. Season number. Omit to mark every aired season of the show. | [optional] 
 **episode** | **Int** | TV only, and only together with &#x60;season&#x60;. Episode number. Omit to mark the whole season. | [optional] 

### Return type

[**TitleState**](TitleState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **scrobble**
```swift
    open class func scrobble(mediaId: String, scrobbleProgressBody: ScrobbleProgressBody, completion: @escaping (_ data: ScrobbleResponse?, _ error: Error?) -> Void)
```

Record playback progress

Scrobbling is Discovr's single-call way to track playback. One call updates live resume progress, watch history, completion, and the watchlist.  Send the viewer's real position when playback starts (not `0` when resuming), about every 30 seconds while watching, and right away on pause, resume, seek, and completion. Discovr handles the rest:  - The title stays in Continue Watching until the movie or episode crosses 80%. - Once progress reaches 20% or more, the title is automatically removed from the watchlist — for both movies and TV shows. - Once progress reaches 80% or more, the movie or episode is marked watched and leaves Continue Watching. Lower progress later (such as a rewind) moves the live position without undoing completion — use `markUnwatched` to undo a watch. - For TV shows, include `season` and `episode` in `tv`. When an episode crosses 80%, the response includes `completedSeasons` listing every season now fully watched.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The media ID in `MV_<number>` or `TV_<number>` format (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
let scrobbleProgressBody: ScrobbleProgressBody = ScrobbleProgressBody(progress: 123, tv: EpisodeRef(season: 123, episode: 123)) // 

Task {
    do {
        let result = try await discovr.scrobble(mediaId: mediaId, scrobbleProgressBody: scrobbleProgressBody)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | The media ID in &#x60;MV_&lt;number&gt;&#x60; or &#x60;TV_&lt;number&gt;&#x60; format (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 
 **scrobbleProgressBody** | [**ScrobbleProgressBody**](ScrobbleProgressBody.md) |  | 

### Return type

[**ScrobbleResponse**](ScrobbleResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

