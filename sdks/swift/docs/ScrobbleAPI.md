# ScrobbleAPI

All URIs are relative to *https://api.discovr.media*

Method | HTTP request | Description
------------- | ------------- | -------------
[**markUnwatched**](ScrobbleAPI.md#markunwatched) | **DELETE** /profile/watched/{mediaId} | Mark a title as unwatched
[**scrobble**](ScrobbleAPI.md#scrobble) | **POST** /profile/scrobble/{mediaId} | Record playback progress
[**scrobbleSkip**](ScrobbleAPI.md#scrobbleskip) | **POST** /profile/scrobble/{mediaId}/skip | Record a skip event


# **markUnwatched**
```swift
    open class func markUnwatched(mediaId: String, season: Int? = nil, episode: Int? = nil, completion: @escaping (_ data: SuccessMessage?, _ error: Error?) -> Void)
```

Mark a title as unwatched

Takes a movie, a TV show, a season, or an episode back to unwatched, in one call.  It removes the history that made it watched, takes it out of the user's **in-progress** list if that is where it was, and brings a TV show's `completed` state back in line. Use it for a \"Mark as unwatched\" button.  For TV shows, `season` and `episode` choose how much to undo:  - Omit both to undo **the whole show**, every season. - Pass `season` to undo **that season**: its episodes, and any entry that counted the whole season as watched. - Pass `season` and `episode` to undo **that episode**.  Calling it for a title that isn't watched changes nothing and still succeeds, so it is safe to retry.  This is not the same as [`DELETE /profile/history/{mediaId}`](/api-reference/discovr/delete-history-item), which removes history entries and nothing else. Marking something unwatched with that call and `DELETE /profile/playback/{mediaId}` leaves a TV show's `completed` out of date unless they run in a particular order; this endpoint does the right thing whichever way you reach it.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The media ID in `MV_<number>` or `TV_<number>` format (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. 
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
 **mediaId** | **String** | The media ID in &#x60;MV_&lt;number&gt;&#x60; or &#x60;TV_&lt;number&gt;&#x60; format (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id.  | 
 **season** | **Int** | TV only. Season number. Omit to undo every season of the show. | [optional] 
 **episode** | **Int** | TV only, and only together with &#x60;season&#x60;. Episode number. Omit to undo the whole season. | [optional] 

### Return type

[**SuccessMessage**](SuccessMessage.md)

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

Scrobbling is Discovr's single-call way to track playback. One call updates everything — progress, history, and watchlist — so you don't need to coordinate multiple endpoints.  Call this about every 30 seconds while the user watches, and straight away on pause, resume, seek and when playback ends. Discovr handles the rest:  - The item stays in the user's **in-progress** list until they finish watching. - Once they've watched 80% or more, it's marked as complete and moves to their **history**. - For movies, the item is removed from the user's watchlist once they've watched more than 20% — so it clears as soon as they're clearly watching it. For TV episodes, it's removed from the watchlist once the episode is complete (≥80%).  For TV shows, include `season` and `episode` in the request body so history is tracked per episode.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The media ID in `MV_<number>` or `TV_<number>` format (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
let scrobbleProgressBody: ScrobbleProgressBody = ScrobbleProgressBody(progress: 123, tv: ScrobbleTv(season: 123, episode: 123)) // 

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

# **scrobbleSkip**
```swift
    open class func scrobbleSkip(mediaId: String, scrobbleSkipBody: ScrobbleSkipBody, completion: @escaping (_ data: ScrobbleSkipResponse?, _ error: Error?) -> Void)
```

Record a skip event

Signals that the user jumped to another point in the content, forward (a skip) or backward (a rewind). Used for watch analytics. Returns immediately — no side effects on lists or history.  `from` and `to` are playback positions as a percentage (0–100) and must differ; `from` higher than `to` is a jump backward. `duration` is how many seconds were jumped. After a jump, also send the position the viewer landed on as a progress update with `POST /profile/scrobble/{mediaId}`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The media ID in `MV_<number>` or `TV_<number>` format (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
let scrobbleSkipBody: ScrobbleSkipBody = ScrobbleSkipBody(from: 123, to: 123, duration: 123, tv: ScrobbleTv(season: 123, episode: 123)) // 

Task {
    do {
        let result = try await discovr.scrobbleSkip(mediaId: mediaId, scrobbleSkipBody: scrobbleSkipBody)
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
 **scrobbleSkipBody** | [**ScrobbleSkipBody**](ScrobbleSkipBody.md) |  | 

### Return type

[**ScrobbleSkipResponse**](ScrobbleSkipResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

