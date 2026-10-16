# ProfileListsAPI

All URIs are relative to *https://api.discovr.media*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addDislikedItem**](ProfileListsAPI.md#adddislikeditem) | **POST** /profile/disliked | Add an item to disliked list
[**addHistoryItem**](ProfileListsAPI.md#addhistoryitem) | **POST** /profile/history | Add an item to history list
[**addLikedItem**](ProfileListsAPI.md#addlikeditem) | **POST** /profile/liked | Add an item to liked list
[**addPlaybackItem**](ProfileListsAPI.md#addplaybackitem) | **POST** /profile/playback | Add an item to playback list
[**addSuperLikedItem**](ProfileListsAPI.md#addsuperlikeditem) | **POST** /profile/super_liked | Add an item to the super-liked list
[**addWatchlistItem**](ProfileListsAPI.md#addwatchlistitem) | **POST** /profile/watchlist | Add an item to watchlist
[**deleteDislikedItem**](ProfileListsAPI.md#deletedislikeditem) | **DELETE** /profile/disliked/{mediaId} | Delete an item from disliked list
[**deleteHistoryItem**](ProfileListsAPI.md#deletehistoryitem) | **DELETE** /profile/history/{mediaId} | Delete an item from history list
[**deleteLikedItem**](ProfileListsAPI.md#deletelikeditem) | **DELETE** /profile/liked/{mediaId} | Delete an item from liked list
[**deletePlaybackItem**](ProfileListsAPI.md#deleteplaybackitem) | **DELETE** /profile/playback/{mediaId} | Delete an item from playback list
[**deleteSuperLikedItem**](ProfileListsAPI.md#deletesuperlikeditem) | **DELETE** /profile/super_liked/{mediaId} | Delete an item from the super-liked list
[**deleteWatchlistItem**](ProfileListsAPI.md#deletewatchlistitem) | **DELETE** /profile/watchlist/{mediaId} | Delete an item from watchlist
[**getDislikedItems**](ProfileListsAPI.md#getdislikeditems) | **GET** /profile/disliked | Get disliked items
[**getHistoryItems**](ProfileListsAPI.md#gethistoryitems) | **GET** /profile/history | Get history items
[**getHistoryItemsByMediaId**](ProfileListsAPI.md#gethistoryitemsbymediaid) | **GET** /profile/history/{mediaId} | Get history items for a specific media
[**getLikedItems**](ProfileListsAPI.md#getlikeditems) | **GET** /profile/liked | Get liked items
[**getPlaybackItems**](ProfileListsAPI.md#getplaybackitems) | **GET** /profile/playback | Get playback items
[**getSuperLikedItems**](ProfileListsAPI.md#getsuperlikeditems) | **GET** /profile/super_liked | Get super-liked items
[**getWatchlistItems**](ProfileListsAPI.md#getwatchlistitems) | **GET** /profile/watchlist | Get watchlist items
[**patchHistoryItem**](ProfileListsAPI.md#patchhistoryitem) | **PATCH** /profile/history/{mediaId} | Update or create a history item
[**updatePlaybackItem**](ProfileListsAPI.md#updateplaybackitem) | **PATCH** /profile/playback | Update playback progress


# **addDislikedItem**
```swift
    open class func addDislikedItem(addSimpleListItemPayload: AddSimpleListItemPayload, completion: @escaping (_ data: SuccessMessage?, _ error: Error?) -> Void)
```

Add an item to disliked list

Adds a title to the disliked list.  **Auth tier:** session — send the session token from `POST /auth/session-token`.  Liked, disliked, and super-liked are exclusive — disliking something automatically removes any existing like or super-like for the same title.  Returns `201` if the item was newly added, `200` if it was already disliked. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let addSimpleListItemPayload: AddSimpleListItemPayload = AddSimpleListItemPayload(mediaId: "mediaId_example") // 

Task {
    do {
        let result = try await discovr.addDislikedItem(addSimpleListItemPayload: addSimpleListItemPayload)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **addSimpleListItemPayload** | [**AddSimpleListItemPayload**](AddSimpleListItemPayload.md) |  | 

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **addHistoryItem**
```swift
    open class func addHistoryItem(addHistoryPayload: AddHistoryPayload, completion: @escaping (_ data: SuccessMessage?, _ error: Error?) -> Void)
```

Add an item to history list

Records a watch history entry. Unlike other lists, history allows multiple entries for the same title — each completed viewing is tracked separately.  - `mediaId`: the title to record. Use `MV_<number>` for movies, `TV_<number>` for TV shows. - `progress`: how far through the title the user watched, as a percentage (0–100). Optional. - `updatedAt`: the ISO 8601 timestamp of when the viewing was recorded. Defaults to now if omitted.  **TV Shows:** Include `season` (required for TV shows) and optionally `episode` to track per-episode history. Omitting `episode` records a season-level entry — clients can use this to mark all episodes in a season as watched in a single call. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let addHistoryPayload: AddHistoryPayload = AddHistoryPayload(mediaId: "mediaId_example", updatedAt: Date(), progress: 123, season: 123, episode: 123, imported: "imported_example") // 

Task {
    do {
        let result = try await discovr.addHistoryItem(addHistoryPayload: addHistoryPayload)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **addHistoryPayload** | [**AddHistoryPayload**](AddHistoryPayload.md) |  | 

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **addLikedItem**
```swift
    open class func addLikedItem(addSimpleListItemPayload: AddSimpleListItemPayload, completion: @escaping (_ data: SuccessMessage?, _ error: Error?) -> Void)
```

Add an item to liked list

Adds a title to the liked list.  **Auth tier:** session — send the session token from `POST /auth/session-token`.  Liked, disliked, and super-liked are exclusive — liking something automatically removes any existing dislike or super-like for the same title.  Returns `201` if the item was newly added, `200` if it was already liked. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let addSimpleListItemPayload: AddSimpleListItemPayload = AddSimpleListItemPayload(mediaId: "mediaId_example") // 

Task {
    do {
        let result = try await discovr.addLikedItem(addSimpleListItemPayload: addSimpleListItemPayload)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **addSimpleListItemPayload** | [**AddSimpleListItemPayload**](AddSimpleListItemPayload.md) |  | 

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **addPlaybackItem**
```swift
    open class func addPlaybackItem(addPlaybackPayload: AddPlaybackPayload, completion: @escaping (_ data: SuccessMessage?, _ error: Error?) -> Void)
```

Add an item to playback list

Records a new playback position for a title. If the title is already being tracked, returns 409 — use PATCH to update an existing entry.  - `mediaId`: the title to track. Use `MV_<number>` for movies, `TV_<number>` for TV shows (e.g., `MV_550`, `TV_1396`). - `progress`: how far through the title the user is, as a percentage (0–100). Optional — omit if you don't have a position yet. - `updatedAt`: the ISO 8601 timestamp of when this progress was recorded. Defaults to now. Send the actual client time so resume positions stay accurate if the user is offline. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let addPlaybackPayload: AddPlaybackPayload = AddPlaybackPayload(mediaId: "mediaId_example", progress: 123, updatedAt: Date()) // 

Task {
    do {
        let result = try await discovr.addPlaybackItem(addPlaybackPayload: addPlaybackPayload)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **addPlaybackPayload** | [**AddPlaybackPayload**](AddPlaybackPayload.md) |  | 

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **addSuperLikedItem**
```swift
    open class func addSuperLikedItem(addSimpleListItemPayload: AddSimpleListItemPayload, completion: @escaping (_ data: SuccessMessage?, _ error: Error?) -> Void)
```

Add an item to the super-liked list

Adds a title to the super-liked list.  **Auth tier:** session — send the session token from `POST /auth/session-token`.  Super-liking a title says the viewer loves it. Like the liked list, adding a super-like automatically removes any existing dislike or like for the same title.  Returns `201` if the item was newly added, `200` if it was already super-liked. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let addSimpleListItemPayload: AddSimpleListItemPayload = AddSimpleListItemPayload(mediaId: "mediaId_example") // 

Task {
    do {
        let result = try await discovr.addSuperLikedItem(addSimpleListItemPayload: addSimpleListItemPayload)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **addSimpleListItemPayload** | [**AddSimpleListItemPayload**](AddSimpleListItemPayload.md) |  | 

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **addWatchlistItem**
```swift
    open class func addWatchlistItem(addSimpleListItemPayload: AddSimpleListItemPayload, completion: @escaping (_ data: SuccessMessage?, _ error: Error?) -> Void)
```

Add an item to watchlist

Adds a title to the watchlist.  **Auth tier:** session — send the session token from `POST /auth/session-token`.  Unlike liked/disliked/super-liked, the watchlist is non-exclusive — you can watchlist something regardless of how it's rated. Titles are automatically removed from the watchlist when the user starts watching via `scrobble`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let addSimpleListItemPayload: AddSimpleListItemPayload = AddSimpleListItemPayload(mediaId: "mediaId_example") // 

Task {
    do {
        let result = try await discovr.addWatchlistItem(addSimpleListItemPayload: addSimpleListItemPayload)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **addSimpleListItemPayload** | [**AddSimpleListItemPayload**](AddSimpleListItemPayload.md) |  | 

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteDislikedItem**
```swift
    open class func deleteDislikedItem(mediaId: String, completion: @escaping (_ data: SuccessMessage?, _ error: Error?) -> Void)
```

Delete an item from disliked list

Removes a title from the disliked list. Pass the full media ID (e.g., `MV_550` for a movie, `TV_1396` for a TV show). 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // Full media ID — `MV_<number>` for movies, `TV_<number>` for TV shows (e.g., `MV_550`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 

Task {
    do {
        let result = try await discovr.deleteDislikedItem(mediaId: mediaId)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | Full media ID — &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteHistoryItem**
```swift
    open class func deleteHistoryItem(mediaId: String, season: Int? = nil, episode: Int? = nil, completion: @escaping (_ data: SuccessMessage?, _ error: Error?) -> Void)
```

Delete an item from history list

Deletes history entries for a title. Because history allows duplicates, this removes all matching entries for the specified media (and episode, if provided).  For TV shows, pass `season` as a query parameter (required) and optionally `episode`. Include `episode` to delete that episode's entries. Omit it to delete the entries that were recorded for the season as a whole, without an episode (for example, marking a season watched in one go); entries for individual episodes are kept.  To take a title back to unwatched, use [`DELETE /profile/watched/{mediaId}`](/api-reference/discovr/mark-unwatched) instead. This call removes history entries and nothing else: it doesn't touch the in-progress list, and a TV show's `completed` state is brought up to date from whatever history is left. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The media ID of the title to delete. Format: `MV_<number>` for movies, `TV_<number>` for TV shows.  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
let season: Int = 987 // Season number. Required for TV shows (`TV_` mediaId); ignored for movies. (optional)
let episode: Int = 987 // Episode number. Optional — omit to delete the season-level entries (those recorded without an episode); include to delete a specific episode's entries only. (optional)

Task {
    do {
        let result = try await discovr.deleteHistoryItem(mediaId: mediaId, season: season, episode: episode)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | The media ID of the title to delete. Format: &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows.  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 
 **season** | **Int** | Season number. Required for TV shows (&#x60;TV_&#x60; mediaId); ignored for movies. | [optional] 
 **episode** | **Int** | Episode number. Optional — omit to delete the season-level entries (those recorded without an episode); include to delete a specific episode&#39;s entries only. | [optional] 

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteLikedItem**
```swift
    open class func deleteLikedItem(mediaId: String, completion: @escaping (_ data: SuccessMessage?, _ error: Error?) -> Void)
```

Delete an item from liked list

Removes a title from the liked list. Pass the full media ID (e.g., `MV_550` for a movie, `TV_1396` for a TV show). 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // Full media ID — `MV_<number>` for movies, `TV_<number>` for TV shows (e.g., `MV_550`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 

Task {
    do {
        let result = try await discovr.deleteLikedItem(mediaId: mediaId)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | Full media ID — &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 

### Return type

[**SuccessMessage**](SuccessMessage.md)

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

Delete an item from playback list

Removes a title from the in-progress list. Use `MV_<number>` for movies, `TV_<number>` for TV shows (e.g., `MV_550`, `TV_1396`). 

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

# **deleteSuperLikedItem**
```swift
    open class func deleteSuperLikedItem(mediaId: String, completion: @escaping (_ data: SuccessMessage?, _ error: Error?) -> Void)
```

Delete an item from the super-liked list

Removes a title from the super-liked list. Pass the full media ID (e.g., `MV_550` for a movie, `TV_1396` for a TV show). 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // Full media ID — `MV_<number>` for movies, `TV_<number>` for TV shows (e.g., `MV_550`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 

Task {
    do {
        let result = try await discovr.deleteSuperLikedItem(mediaId: mediaId)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | Full media ID — &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteWatchlistItem**
```swift
    open class func deleteWatchlistItem(mediaId: String, completion: @escaping (_ data: SuccessMessage?, _ error: Error?) -> Void)
```

Delete an item from watchlist

Removes a title from the watchlist. Pass the full media ID (e.g., `MV_550` for a movie, `TV_1396` for a TV show). 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // Full media ID — `MV_<number>` for movies, `TV_<number>` for TV shows (e.g., `MV_550`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 

Task {
    do {
        let result = try await discovr.deleteWatchlistItem(mediaId: mediaId)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | Full media ID — &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDislikedItems**
```swift
    open class func getDislikedItems(nextPageToken: String? = nil, limit: Int? = nil, completion: @escaping (_ data: SimpleListResponse?, _ error: Error?) -> Void)
```

Get disliked items

Returns the disliked list for a specific profile.  **Auth tier:** session — send the session token from `POST /auth/session-token`.  Items are ordered newest-first and support cursor-based pagination via `nextPageToken`.  **Pagination:** - Pass `nextPageToken` from a previous response to fetch the next page. - If `hasMore` is `true`, there are more items available.  **Exclusive lists:** Liked, disliked, and super-liked are mutually exclusive — a title can only be in one of those lists at a time. 

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
        let result = try await discovr.getDislikedItems(nextPageToken: nextPageToken, limit: limit)
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

[**SimpleListResponse**](SimpleListResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getHistoryItems**
```swift
    open class func getHistoryItems(nextPageToken: String? = nil, limit: Int? = nil, completion: @escaping (_ data: HistoryListResponse?, _ error: Error?) -> Void)
```

Get history items

Returns the profile's full watch history, newest entries first.  History allows multiple entries for the same title — every completed viewing is tracked separately, so you may see the same `mediaId` more than once.  **Pagination:** Pass `nextPageToken` from the previous response to fetch the next page. If `hasMore` is `true`, more items are available. 

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
        let result = try await discovr.getHistoryItems(nextPageToken: nextPageToken, limit: limit)
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

[**HistoryListResponse**](HistoryListResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getHistoryItemsByMediaId**
```swift
    open class func getHistoryItemsByMediaId(mediaId: String, season: Int? = nil, episode: Int? = nil, nextPageToken: String? = nil, limit: Int? = nil, completion: @escaping (_ data: HistoryListResponse?, _ error: Error?) -> Void)
```

Get history items for a specific media

Returns history entries for a specific title. Newest entries first.  For TV shows, pass `season` as a query parameter (required) and optionally `episode` to filter by episode. Omitting `episode` returns all entries for the whole season.  **Pagination:** Pass `nextPageToken` from the previous response to fetch the next page. If `hasMore` is `true`, more items are available. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The media ID of the title. Format: `MV_<number>` for movies, `TV_<number>` for TV shows.  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
let season: Int = 987 // Season number. Required for TV shows (`TV_` mediaId); ignored for movies. (optional)
let episode: Int = 987 // Episode number. Optional — omit to return all entries for the season; include to filter to a specific episode. (optional)
let nextPageToken: String = "nextPageToken_example" // Opaque token from previous page for pagination (optional)
let limit: Int = 987 // Maximum number of items to return (1-50, default: 10) (optional) (default: 10)

Task {
    do {
        let result = try await discovr.getHistoryItemsByMediaId(mediaId: mediaId, season: season, episode: episode, nextPageToken: nextPageToken, limit: limit)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | The media ID of the title. Format: &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows.  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 
 **season** | **Int** | Season number. Required for TV shows (&#x60;TV_&#x60; mediaId); ignored for movies. | [optional] 
 **episode** | **Int** | Episode number. Optional — omit to return all entries for the season; include to filter to a specific episode. | [optional] 
 **nextPageToken** | **String** | Opaque token from previous page for pagination | [optional] 
 **limit** | **Int** | Maximum number of items to return (1-50, default: 10) | [optional] [default to 10]

### Return type

[**HistoryListResponse**](HistoryListResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getLikedItems**
```swift
    open class func getLikedItems(nextPageToken: String? = nil, limit: Int? = nil, completion: @escaping (_ data: SimpleListResponse?, _ error: Error?) -> Void)
```

Get liked items

Returns the liked list for a specific profile.  **Auth tier:** session — send the session token from `POST /auth/session-token`.  Items are ordered newest-first and support cursor-based pagination via `nextPageToken`.  **Pagination:** - Pass `nextPageToken` from a previous response to fetch the next page. - If `hasMore` is `true`, there are more items available.  **Exclusive lists:** Liked, disliked, and super-liked are mutually exclusive — a title can only be in one of those lists at a time. 

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
        let result = try await discovr.getLikedItems(nextPageToken: nextPageToken, limit: limit)
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

[**SimpleListResponse**](SimpleListResponse.md)

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

Returns the profile's in-progress titles — everything with a saved playback position. Ordered by most recently updated. Use this to build a \"Continue Watching\" row.  Each item includes a `progress` field (0–100) showing how far through the title the user is.  **Pagination:** Pass `nextPageToken` from the previous response to fetch the next page. If `hasMore` is `true`, more items are available. 

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

# **getSuperLikedItems**
```swift
    open class func getSuperLikedItems(nextPageToken: String? = nil, limit: Int? = nil, completion: @escaping (_ data: SimpleListResponse?, _ error: Error?) -> Void)
```

Get super-liked items

Returns the super-liked list for a specific profile.  **Auth tier:** session — send the session token from `POST /auth/session-token`.  Items are ordered newest-first and support cursor-based pagination via `nextPageToken`.  **Pagination:** - Pass `nextPageToken` from a previous response to fetch the next page. - If `hasMore` is `true`, there are more items available.  **Exclusive lists:** Liked, disliked, and super-liked are mutually exclusive — a title can only be in one of those lists at a time. Super-liked titles are the ones the viewer loves most. 

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
        let result = try await discovr.getSuperLikedItems(nextPageToken: nextPageToken, limit: limit)
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

[**SimpleListResponse**](SimpleListResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getWatchlistItems**
```swift
    open class func getWatchlistItems(nextPageToken: String? = nil, limit: Int? = nil, completion: @escaping (_ data: SimpleListResponse?, _ error: Error?) -> Void)
```

Get watchlist items

Returns the profile's watchlist — titles saved to watch later.  **Auth tier:** session — send the session token from `POST /auth/session-token`.  Ordered by when they were added (newest first). Supports cursor-based pagination via `nextPageToken`.  **Pagination:** - Pass `nextPageToken` from a previous response to fetch the next page. - If `hasMore` is `true`, there are more items available. 

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
        let result = try await discovr.getWatchlistItems(nextPageToken: nextPageToken, limit: limit)
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

[**SimpleListResponse**](SimpleListResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **patchHistoryItem**
```swift
    open class func patchHistoryItem(mediaId: String, patchHistoryPayload: PatchHistoryPayload, season: Int? = nil, episode: Int? = nil, completion: @escaping (_ data: SuccessMessage?, _ error: Error?) -> Void)
```

Update or create a history item

Updates the history entry for a title. If no entry exists, creates one (upsert). This ensures only one entry exists per `mediaId` + `season` + `episode` combination.  For TV shows, `season` is required as a query parameter. Include `episode` to target a specific episode; omit it to update the season-level entry.  - `progress`: how far through the title the user watched, as a percentage (0–100). 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mediaId: String = "mediaId_example" // The media ID of the title. Format: `MV_<number>` for movies, `TV_<number>` for TV shows.  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
let patchHistoryPayload: PatchHistoryPayload = PatchHistoryPayload(progress: 123) // 
let season: Int = 987 // Season number. Required for TV shows (`TV_` mediaId); ignored for movies. (optional)
let episode: Int = 987 // Episode number. Optional — omit to update the season-level entry; include to target a specific episode. (optional)

Task {
    do {
        let result = try await discovr.patchHistoryItem(mediaId: mediaId, patchHistoryPayload: patchHistoryPayload, season: season, episode: episode)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mediaId** | **String** | The media ID of the title. Format: &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows.  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 
 **patchHistoryPayload** | [**PatchHistoryPayload**](PatchHistoryPayload.md) |  | 
 **season** | **Int** | Season number. Required for TV shows (&#x60;TV_&#x60; mediaId); ignored for movies. | [optional] 
 **episode** | **Int** | Episode number. Optional — omit to update the season-level entry; include to target a specific episode. | [optional] 

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updatePlaybackItem**
```swift
    open class func updatePlaybackItem(editPlaybackPayload: EditPlaybackPayload, completion: @escaping (_ data: SuccessMessage?, _ error: Error?) -> Void)
```

Update playback progress

Updates the playback position for an existing entry. Same fields as the add endpoint. If no entry exists for the `mediaId`, one is created. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let editPlaybackPayload: EditPlaybackPayload = EditPlaybackPayload(mediaId: "mediaId_example", progress: 123, updatedAt: Date()) // 

Task {
    do {
        let result = try await discovr.updatePlaybackItem(editPlaybackPayload: editPlaybackPayload)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **editPlaybackPayload** | [**EditPlaybackPayload**](EditPlaybackPayload.md) |  | 

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

