# ProfileListsAPI

All URIs are relative to *https://api.discovr.media*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addToWatchlist**](ProfileListsAPI.md#addtowatchlist) | **PUT** /profile/titles/{mediaId}/watchlist | Add a title to the watchlist
[**clearRating**](ProfileListsAPI.md#clearrating) | **DELETE** /profile/titles/{mediaId}/rating | Clear a title&#39;s rating
[**deletePlaybackItem**](ProfileListsAPI.md#deleteplaybackitem) | **DELETE** /profile/playback/{mediaId} | Remove a title from Continue Watching
[**getPlaybackItems**](ProfileListsAPI.md#getplaybackitems) | **GET** /profile/playback | Get playback items
[**getSeasonState**](ProfileListsAPI.md#getseasonstate) | **GET** /profile/titles/{mediaId}/seasons/{seasonNumber} | Get which episodes of a TV season are watched
[**getTitleState**](ProfileListsAPI.md#gettitlestate) | **GET** /profile/titles/{mediaId} | Get the active profile&#39;s state for a title
[**getTitles**](ProfileListsAPI.md#gettitles) | **GET** /profile/titles | List titles by rating, watchlist, or watch history
[**importHistory**](ProfileListsAPI.md#importhistory) | **POST** /profile/history | Import a watch history entry
[**removeFromWatchlist**](ProfileListsAPI.md#removefromwatchlist) | **DELETE** /profile/titles/{mediaId}/watchlist | Remove a title from the watchlist
[**setRating**](ProfileListsAPI.md#setrating) | **PUT** /profile/titles/{mediaId}/rating | Set a title&#39;s rating


# **addToWatchlist**
```swift
    open class func addToWatchlist(mediaId: String, completion: @escaping (_ data: TitleState?, _ error: Error?) -> Void)
```

Add a title to the watchlist

Adds a title to the active profile's watchlist. Safe to call if it is already on the watchlist.  Returns the title's updated `TitleState`, so you can update your UI immediately without calling `getTitleState` again.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 

Task {
    do {
        let result = try await discovr.addToWatchlist(mediaId: mediaId)
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

### Return type

[**TitleState**](TitleState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **clearRating**
```swift
    open class func clearRating(mediaId: String, completion: @escaping (_ data: TitleState?, _ error: Error?) -> Void)
```

Clear a title's rating

Clears the active profile's rating for a title. Safe to call if the title has no rating.  Returns the title's updated `TitleState`, so you can update your UI immediately without calling `getTitleState` again.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 

Task {
    do {
        let result = try await discovr.clearRating(mediaId: mediaId)
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

### Return type

[**TitleState**](TitleState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deletePlaybackItem**
```swift
    open class func deletePlaybackItem(mediaId: String, completion: @escaping (_ data: SuccessMessage?, _ error: Error?) -> Void)
```

Remove a title from Continue Watching

Removes a title from the in-progress Continue Watching list without changing its watched history. Use `MV_<number>` for movies, `TV_<number>` for TV shows (e.g., `MV_550`, `TV_1396`). 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The media ID of the title to remove. Format: `MV_<number>` for movies, `TV_<number>` for TV shows.  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 

Task {
    do {
        let result = try await discovr.deletePlaybackItem(mediaId: mediaId)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | The media ID of the title to remove. Format: &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows.  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPlaybackItems**
```swift
    open class func getPlaybackItems(nextPageToken: String? = nil, limit: Int? = nil, completion: @escaping (_ data: PlaybackListResponse?, _ error: Error?) -> Void)
```

Get playback items

Returns the profile's in-progress titles — everything with a saved playback position. Ordered by most recently updated. Use this to build a \"Continue Watching\" row.  Each item includes a `progress` field (0–100) showing how far through the title the user is. To update progress as a viewer watches, call `POST /profile/scrobble/{mediaId}`.  **Pagination:** Pass `nextPageToken` from the previous response to fetch the next page. If `hasMore` is `true`, more items are available. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let nextPageToken: String = "nextPageToken_example" // Opaque token from previous page for pagination (optional)
let limit: Int = 987 // Maximum number of items to return (1-50, default: 10) (optional) (default: 10)

Task {
    do {
        let result = try await discovr.getPlaybackItems(nextPageToken: nextPageToken, limit: limit)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nextPageToken** | **String** | Opaque token from previous page for pagination | [optional] 
 **limit** | **Int** | Maximum number of items to return (1-50, default: 10) | [optional] [default to 10]

### Return type

[**PlaybackListResponse**](PlaybackListResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSeasonState**
```swift
    open class func getSeasonState(mediaId: String, seasonNumber: Int, completion: @escaping (_ data: SeasonState?, _ error: Error?) -> Void)
```

Get which episodes of a TV season are watched

Returns which episodes of a single TV season the active profile has finished, plus whether the season as a whole is complete.  A season counts as complete when every aired episode in it is watched. Specials (season `0`) never count toward show completion. Pair this with `getSeasonDetails` for episode titles and artwork, and with `getTitleState` for title-level state and live playback position.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The TV show's media ID (`TV_<id>`), or an item `ref`. 
let seasonNumber: Int = 987 // The season number (0 for specials, 1+ for regular seasons).

Task {
    do {
        let result = try await discovr.getSeasonState(mediaId: mediaId, seasonNumber: seasonNumber)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | The TV show&#39;s media ID (&#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | 
 **seasonNumber** | **Int** | The season number (0 for specials, 1+ for regular seasons). | 

### Return type

[**SeasonState**](SeasonState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTitleState**
```swift
    open class func getTitleState(mediaId: String, providers: Bool? = nil, completion: @escaping (_ data: TitleState?, _ error: Error?) -> Void)
```

Get the active profile's state for a title

Returns everything your UI needs to show the active profile's relationship with a title:  - **Rating**: `liked`, `disliked`, `super_liked`, or `null`. - **Watchlist**: whether the title is saved to the watchlist. - **Watch progress & completion**: whether the profile has started (`watched`) or finished (`completed`) the title, total `plays`, watched `episodes` and `completedSeasons` for TV shows, and the live `playback` resume position when mid-watch. - **Providers** *(optional)*: pass `providers=true` to include streaming availability filtered to the account's chosen services.  **Title opens & recommendations.** Calling `GET /profile/titles/{mediaId}` records that the viewer opened the title and directly affects the profile's recommendations. Only call it when the title screen actually opens — prefetching or calling it on hover/focus registers every loaded tile similarly to the viewer liking the title and will skew their recommendations. Every state write (`setRating`, `clearRating`, `addToWatchlist`, `removeFromWatchlist`, `markWatched`, `markUnwatched`) returns the updated `TitleState`, so you don't need to refetch this endpoint after a change.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The title's media ID (`MV_<id>` for movies, `TV_<id>` for TV shows).  Also accepts an item's `ref` in place of the ID. Prefer the `ref` when you have one — it resolves to the same title and sharpens recommendations. 
let providers: Bool = true // Set to `true` to include streaming provider availability filtered to the account's selected services. (optional) (default: false)

Task {
    do {
        let result = try await discovr.getTitleState(mediaId: mediaId, providers: providers)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; for movies, &#x60;TV_&lt;id&gt;&#x60; for TV shows).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the ID. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens recommendations.  | 
 **providers** | **Bool** | Set to &#x60;true&#x60; to include streaming provider availability filtered to the account&#39;s selected services. | [optional] [default to false]

### Return type

[**TitleState**](TitleState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTitles**
```swift
    open class func getTitles(rating: Rating? = nil, watchlist: Bool? = nil, watched: Bool? = nil, nextPageToken: String? = nil, limit: Int? = nil, completion: @escaping (_ data: TitleListResponse?, _ error: Error?) -> Void)
```

List titles by rating, watchlist, or watch history

Returns a paginated list of titles for the active profile, ordered most recent first.  Pass **exactly one** filter query parameter:  - `rating=liked`, `rating=disliked`, or `rating=super_liked` — titles with that rating, newest rated first. - `watchlist=true` — the profile's watchlist, newest added first. - `watched=true` — the profile's watch history (one entry per title, with `completed`, `plays`, and the last episode for TV shows), most recently watched first.  Each item includes a `ref` alongside its `id`. Pass the `ref` when the viewer opens or acts on the title.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let rating: Rating = Rating() // Filter by rating (`liked`, `disliked`, or `super_liked`). (optional)
let watchlist: Bool = true // Set to `true` to list the profile's watchlist. (optional)
let watched: Bool = true // Set to `true` to list the profile's watch history (one row per title). (optional)
let nextPageToken: String = "nextPageToken_example" // Opaque cursor token from the previous page. (optional)
let limit: Int = 987 // Maximum number of titles to return (1–50, default 10). (optional) (default: 10)

Task {
    do {
        let result = try await discovr.getTitles(rating: rating, watchlist: watchlist, watched: watched, nextPageToken: nextPageToken, limit: limit)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **rating** | [**Rating**](.md) | Filter by rating (&#x60;liked&#x60;, &#x60;disliked&#x60;, or &#x60;super_liked&#x60;). | [optional] 
 **watchlist** | **Bool** | Set to &#x60;true&#x60; to list the profile&#39;s watchlist. | [optional] 
 **watched** | **Bool** | Set to &#x60;true&#x60; to list the profile&#39;s watch history (one row per title). | [optional] 
 **nextPageToken** | **String** | Opaque cursor token from the previous page. | [optional] 
 **limit** | **Int** | Maximum number of titles to return (1–50, default 10). | [optional] [default to 10]

### Return type

[**TitleListResponse**](TitleListResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **importHistory**
```swift
    open class func importHistory(importHistoryPayload: ImportHistoryPayload, completion: @escaping (_ data: TitleState?, _ error: Error?) -> Void)
```

Import a watch history entry

Imports a previously watched movie, show, season, or episode from an external source.  - `mediaId`: the title to import (`MV_<number>` for movies, `TV_<number>` for TV shows). - `imported`: required string naming the external source (for example `\"trakt\"`). - `updatedAt`: optional ISO 8601 timestamp of when it was watched. Defaults to now. - `season` / `episode`: optional TV scope. Omit both to import all aired episodes of the show; pass `season` to import that season; pass both to import a single episode.  For live viewing use `scrobble()`, and for interactive \"Mark as watched\" buttons use `markWatched()`. To read watch history, use `GET /profile/titles?watched=true`.  Returns the title's updated `TitleState`.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let importHistoryPayload: ImportHistoryPayload = ImportHistoryPayload(mediaId: "mediaId_example", imported: "imported_example", updatedAt: Date(), season: 123, episode: 123) // 

Task {
    do {
        let result = try await discovr.importHistory(importHistoryPayload: importHistoryPayload)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **importHistoryPayload** | [**ImportHistoryPayload**](ImportHistoryPayload.md) |  | 

### Return type

[**TitleState**](TitleState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **removeFromWatchlist**
```swift
    open class func removeFromWatchlist(mediaId: String, completion: @escaping (_ data: TitleState?, _ error: Error?) -> Void)
```

Remove a title from the watchlist

Removes a title from the active profile's watchlist. Safe to call if it is not on the watchlist.  Returns the title's updated `TitleState`, so you can update your UI immediately without calling `getTitleState` again.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 

Task {
    do {
        let result = try await discovr.removeFromWatchlist(mediaId: mediaId)
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

### Return type

[**TitleState**](TitleState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **setRating**
```swift
    open class func setRating(mediaId: String, setRatingPayload: SetRatingPayload, completion: @escaping (_ data: TitleState?, _ error: Error?) -> Void)
```

Set a title's rating

Sets the active profile's rating for a title to `liked`, `disliked`, or `super_liked`.  Ratings are mutually exclusive: setting a new rating automatically replaces any previous one. Setting the rating the title already has is a safe no-op.  Returns the title's updated `TitleState`, so you can update your UI immediately without calling `getTitleState` again.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 
let setRatingPayload: SetRatingPayload = SetRatingPayload(value: Rating()) // 

Task {
    do {
        let result = try await discovr.setRating(mediaId: mediaId, setRatingPayload: setRatingPayload)
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
 **setRatingPayload** | [**SetRatingPayload**](SetRatingPayload.md) |  | 

### Return type

[**TitleState**](TitleState.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

