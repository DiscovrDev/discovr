# DiscovrAPI

All URIs are relative to *https://api.discovr.media*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addDislikedItem**](DiscovrAPI.md#adddislikeditem) | **POST** /profile/disliked | Add an item to disliked list
[**addHistoryItem**](DiscovrAPI.md#addhistoryitem) | **POST** /profile/history | Add an item to history list
[**addLikedItem**](DiscovrAPI.md#addlikeditem) | **POST** /profile/liked | Add an item to liked list
[**addPlaybackItem**](DiscovrAPI.md#addplaybackitem) | **POST** /profile/playback | Add an item to playback list
[**addSuperLikedItem**](DiscovrAPI.md#addsuperlikeditem) | **POST** /profile/super_liked | Add an item to the super-liked list
[**addWatchlistItem**](DiscovrAPI.md#addwatchlistitem) | **POST** /profile/watchlist | Add an item to watchlist
[**authorizeClientWeb**](DiscovrAPI.md#authorizeclientweb) | **GET** /auth/web/authorize | Redirect to web authentication
[**createPage**](DiscovrAPI.md#createpage) | **POST** /pages | Create a recommendation page
[**createProfile**](DiscovrAPI.md#createprofile) | **POST** /profiles | Create a profile
[**deleteDislikedItem**](DiscovrAPI.md#deletedislikeditem) | **DELETE** /profile/disliked/{mediaId} | Delete an item from disliked list
[**deleteHistoryItem**](DiscovrAPI.md#deletehistoryitem) | **DELETE** /profile/history/{mediaId} | Delete an item from history list
[**deleteLikedItem**](DiscovrAPI.md#deletelikeditem) | **DELETE** /profile/liked/{mediaId} | Delete an item from liked list
[**deletePlaybackItem**](DiscovrAPI.md#deleteplaybackitem) | **DELETE** /profile/playback/{mediaId} | Delete an item from playback list
[**deleteProfile**](DiscovrAPI.md#deleteprofile) | **DELETE** /profiles/{profileId} | Delete a profile
[**deleteSuperLikedItem**](DiscovrAPI.md#deletesuperlikeditem) | **DELETE** /profile/super_liked/{mediaId} | Delete an item from the super-liked list
[**deleteWatchlistItem**](DiscovrAPI.md#deletewatchlistitem) | **DELETE** /profile/watchlist/{mediaId} | Delete an item from watchlist
[**exchangeWebAuthCode**](DiscovrAPI.md#exchangewebauthcode) | **POST** /auth/web/token | Redeem a web sign-in code
[**getDislikedItems**](DiscovrAPI.md#getdislikeditems) | **GET** /profile/disliked | Get disliked items
[**getHistoryItems**](DiscovrAPI.md#gethistoryitems) | **GET** /profile/history | Get history items
[**getHistoryItemsByMediaId**](DiscovrAPI.md#gethistoryitemsbymediaid) | **GET** /profile/history/{mediaId} | Get history items for a specific media
[**getLikedItems**](DiscovrAPI.md#getlikeditems) | **GET** /profile/liked | Get liked items
[**getMedia**](DiscovrAPI.md#getmedia) | **GET** /media/{mediaId} | Get media details
[**getMediaAssets**](DiscovrAPI.md#getmediaassets) | **GET** /media/{mediaId}/assets | Get media assets
[**getMediaProfileMeta**](DiscovrAPI.md#getmediaprofilemeta) | **GET** /media/{mediaId}/profile_meta | Get profile interaction data for a title
[**getPage**](DiscovrAPI.md#getpage) | **GET** /pages/{pageId} | Get a page
[**getPlaybackItems**](DiscovrAPI.md#getplaybackitems) | **GET** /profile/playback | Get playback items
[**getProfile**](DiscovrAPI.md#getprofile) | **GET** /profiles/{profileId} | Get a profile
[**getProfileImages**](DiscovrAPI.md#getprofileimages) | **GET** /profile-images | List avatar images
[**getProfiles**](DiscovrAPI.md#getprofiles) | **GET** /profiles | List profiles
[**getRow**](DiscovrAPI.md#getrow) | **GET** /pages/{pageId}/rows/{rowId} | Get a row
[**getRowItems**](DiscovrAPI.md#getrowitems) | **GET** /pages/{pageId}/rows/{rowId}/items | List row items
[**getRows**](DiscovrAPI.md#getrows) | **GET** /pages/{pageId}/rows | List rows
[**getSeasonDetails**](DiscovrAPI.md#getseasondetails) | **GET** /media/{mediaId}/seasons/{seasonNumber} | Get TV season details
[**getSeasonProfileMeta**](DiscovrAPI.md#getseasonprofilemeta) | **GET** /media/{mediaId}/seasons/{seasonNumber}/meta | Get which episodes of a TV season are finished
[**getSimilarRecommendations**](DiscovrAPI.md#getsimilarrecommendations) | **GET** /media/{mediaId}/similar | Get similar titles
[**getSuperLikedItems**](DiscovrAPI.md#getsuperlikeditems) | **GET** /profile/super_liked | Get super-liked items
[**getWatchlistItems**](DiscovrAPI.md#getwatchlistitems) | **GET** /profile/watchlist | Get watchlist items
[**markUnwatched**](DiscovrAPI.md#markunwatched) | **DELETE** /profile/watched/{mediaId} | Mark a title as unwatched
[**mintSessionToken**](DiscovrAPI.md#mintsessiontoken) | **POST** /auth/session-token | Mint a session token
[**patchHistoryItem**](DiscovrAPI.md#patchhistoryitem) | **PATCH** /profile/history/{mediaId} | Update or create a history item
[**pollDeviceCode**](DiscovrAPI.md#polldevicecode) | **POST** /auth/device-codes/{deviceCode}/poll | Poll for auth token
[**requestDeviceCode**](DiscovrAPI.md#requestdevicecode) | **POST** /auth/device-codes | Request device code
[**scrobble**](DiscovrAPI.md#scrobble) | **POST** /profile/scrobble/{mediaId} | Record playback progress
[**scrobbleSkip**](DiscovrAPI.md#scrobbleskip) | **POST** /profile/scrobble/{mediaId}/skip | Record a skip event
[**searchGifs**](DiscovrAPI.md#searchgifs) | **GET** /gif-search | Search GIFs
[**searchMedia**](DiscovrAPI.md#searchmedia) | **GET** /search | Search media
[**signOutSession**](DiscovrAPI.md#signoutsession) | **DELETE** /auth/session | Sign out the current device
[**startDemoSession**](DiscovrAPI.md#startdemosession) | **POST** /auth/demo-session | Start a demo session
[**updatePlaybackItem**](DiscovrAPI.md#updateplaybackitem) | **PATCH** /profile/playback | Update playback progress
[**updateProfile**](DiscovrAPI.md#updateprofile) | **PATCH** /profiles/{profileId} | Update a profile


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

# **authorizeClientWeb**
```swift
    open class func authorizeClientWeb(clientID: String, state: String, codeChallenge: String, codeChallengeMethod: CodeChallengeMethod_authorizeClientWeb, redirectURL: String? = nil, platform: Platform_authorizeClientWeb? = nil, completion: @escaping (_ data: Void?, _ error: Error?) -> Void)
```

Redirect to web authentication

Starts a web sign-in: sends the user's browser to the Discovr page where they sign in and approve your app. After they do, Discovr hands your app a short-lived, single-use **authorization code** (never the long-lived credential), and your app trades it for a refresh token with `POST /auth/web/token`. This is the OAuth authorization code flow with PKCE, so the SDKs do all of it for you.  - **`clientID`** — your registered app ID, so Discovr knows which app is requesting access. - **`state`** — your app's CSRF token. Discovr echoes it back unchanged so you can verify the response came from Discovr and not a third party. - **`codeChallenge`** / **`codeChallengeMethod`** — `base64url(SHA-256(verifier))` of a random `codeVerifier` you keep, and `S256`. Required on every request. - **`redirectURL`** — where to send the user after sign-in; it must be registered for your client. For a popup, send `openerOrigin` instead (the SDK does).  **What your app receives.** On your `redirectURL` as query parameters, or as a `postMessage` to the popup's opener: `{ code, state }` on success, or `{ error, state }` when the person cancels (`authorization-cancelled`) or sign-in cannot complete. `error` is one of the codes in `ApiError`. Check `state` first, then redeem `code` with your `codeVerifier`. 

### Example
```swift
import Discovr


let clientID: String = "clientID_example" // The client ID of the third-party application
let state: String = "state_example" // Opaque value to prevent CSRF; echoed back in the callback response. 16 to 256 URL-safe characters (`A-Z a-z 0-9 - _`); 32 random bytes, hex-encoded, is 64. 
let codeChallenge: String = "codeChallenge_example" // `base64url(SHA-256(codeVerifier))`, 43 characters. Generate a fresh random `codeVerifier` per sign-in and keep it; you send it to `POST /auth/web/token` when you redeem the code. 
let codeChallengeMethod: String = "codeChallengeMethod_example" // Always `S256`. `plain` is not accepted.
let redirectURL: String = "redirectURL_example" // Optional custom redirect URL. If omitted, redirects to the hosted callback page at  https://auth.discovr.media/callback.html which handles token exchange via postMessage  for web popup flows or deep links for mobile apps. Must be URL encoded when provided.  (optional)
let platform: String = "platform_example" // Optional platform hint (web popup, mobile deep link, etc.). Not currently used.  (optional)

DiscovrAPI.authorizeClientWeb(clientID: clientID, state: state, codeChallenge: codeChallenge, codeChallengeMethod: codeChallengeMethod, redirectURL: redirectURL, platform: platform) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientID** | **String** | The client ID of the third-party application | 
 **state** | **String** | Opaque value to prevent CSRF; echoed back in the callback response. 16 to 256 URL-safe characters (&#x60;A-Z a-z 0-9 - _&#x60;); 32 random bytes, hex-encoded, is 64.  | 
 **codeChallenge** | **String** | &#x60;base64url(SHA-256(codeVerifier))&#x60;, 43 characters. Generate a fresh random &#x60;codeVerifier&#x60; per sign-in and keep it; you send it to &#x60;POST /auth/web/token&#x60; when you redeem the code.  | 
 **codeChallengeMethod** | **String** | Always &#x60;S256&#x60;. &#x60;plain&#x60; is not accepted. | 
 **redirectURL** | **String** | Optional custom redirect URL. If omitted, redirects to the hosted callback page at  https://auth.discovr.media/callback.html which handles token exchange via postMessage  for web popup flows or deep links for mobile apps. Must be URL encoded when provided.  | [optional] 
 **platform** | **String** | Optional platform hint (web popup, mobile deep link, etc.). Not currently used.  | [optional] 

### Return type

Void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createPage**
```swift
    open class func createPage(createPagePayload: CreatePagePayload? = nil, completion: @escaping (_ data: CreatePageResponse?, _ error: Error?) -> Void)
```

Create a recommendation page

Resolves a set of filters to the page that represents them.  A page's ID is determined by its filters alone, so the same filters always return the same ID — for every profile, on every device, indefinitely. Call this once and keep the ID.  Creating pages up front for your top-level tabs is cheap.  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let createPagePayload: CreatePagePayload = CreatePagePayload(pageFilters: FilterSpec(genres: [123], keywords: [123], mediaType: "mediaType_example", region: ["region_example"], withRuntimeGte: 123, withRuntimeLte: 123, withReleaseDateGte: Date(), withReleaseDateLte: Date(), withWatchProviders: ["withWatchProviders_example"]), name: "name_example") //  (optional)

Task {
    do {
        let result = try await discovr.createPage(createPagePayload: createPagePayload)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createPagePayload** | [**CreatePagePayload**](CreatePagePayload.md) |  | [optional] 

### Return type

[**CreatePageResponse**](CreatePageResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createProfile**
```swift
    open class func createProfile(createProfilePayload: CreateProfilePayload, completion: @escaping (_ data: CreateProfileResponse?, _ error: Error?) -> Void)
```

Create a profile

Creates a new profile for the signed-in user. Provide a display name and an avatar URL.  On success you'll get back a `profileId`. Use that ID with `POST /auth/session-token` to mint a session token and start browsing recommendations for this profile. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let createProfilePayload: CreateProfilePayload = CreateProfilePayload(name: "name_example", avatarUrl: "avatarUrl_example", avatarMediaType: AvatarMediaType()) // 

Task {
    do {
        let result = try await discovr.createProfile(createProfilePayload: createProfilePayload)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createProfilePayload** | [**CreateProfilePayload**](CreateProfilePayload.md) |  | 

### Return type

[**CreateProfileResponse**](CreateProfileResponse.md)

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

# **deleteProfile**
```swift
    open class func deleteProfile(profileId: String, completion: @escaping (_ data: DeleteProfileResponse?, _ error: Error?) -> Void)
```

Delete a profile

Permanently deletes the profile. This action can't be undone.  Deleting an account's only profile is allowed. The account then has no profiles and can't mint a session token until a new one is created — see [Handle zero profiles](/guides/profiles/listing-and-selecting-profiles). Returns 404 if the profile doesn't exist or doesn't belong to the signed-in user. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let profileId: String = "profileId_example" // The ID of the profile to delete.

Task {
    do {
        let result = try await discovr.deleteProfile(profileId: profileId)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **profileId** | **String** | The ID of the profile to delete. | 

### Return type

[**DeleteProfileResponse**](DeleteProfileResponse.md)

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

# **exchangeWebAuthCode**
```swift
    open class func exchangeWebAuthCode(webTokenPayload: WebTokenPayload, completion: @escaping (_ data: RefreshTokenResponse?, _ error: Error?) -> Void)
```

Redeem a web sign-in code

The last step of a web sign-in. Trade the authorization code Discovr delivered to your app, together with the `codeVerifier` you generated when you started, for the refresh token. The SDKs call this for you.  The code is single-use and lives 60 seconds. A request with a wrong `codeVerifier` fails **and spends the code**, so whoever intercepted it gets one try, not unlimited guesses. The refresh token comes back in this response only — it is never in a URL or a `postMessage`. 

### Example
```swift
import Discovr


let webTokenPayload: WebTokenPayload = WebTokenPayload(clientID: "clientID_example", code: "code_example", codeVerifier: "codeVerifier_example") // 

DiscovrAPI.exchangeWebAuthCode(webTokenPayload: webTokenPayload) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **webTokenPayload** | [**WebTokenPayload**](WebTokenPayload.md) |  | 

### Return type

[**RefreshTokenResponse**](RefreshTokenResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
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

# **getMedia**
```swift
    open class func getMedia(mediaId: String, completion: @escaping (_ data: MediaResponse?, _ error: Error?) -> Void)
```

Get media details

Returns full details for a movie or TV show — title, overview, genres, release date, runtime, cast, crew, watch providers, and more. Pass `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  This is a public endpoint — no authentication required. Returns only generic catalog metadata; personalized fields live under `profile_meta`. 

### Example
```swift
import Discovr


let mediaId: String = "mediaId_example" // The unique identifier of the media item. Use `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 

DiscovrAPI.getMedia(mediaId: mediaId) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
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

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMediaAssets**
```swift
    open class func getMediaAssets(mediaId: String, completion: @escaping (_ data: MediaAssetsResponse?, _ error: Error?) -> Void)
```

Get media assets

Returns the best-available poster, backdrop, logo, and trailer for a title — one resolved URL per asset type. Uses English/language-neutral preference for images, and picks the best official trailer when one is available.  This is a public endpoint — no authentication required. Returns only generic catalog metadata. 

### Example
```swift
import Discovr


let mediaId: String = "mediaId_example" // The unique identifier of the media item. Use `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 

DiscovrAPI.getMediaAssets(mediaId: mediaId) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
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

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMediaProfileMeta**
```swift
    open class func getMediaProfileMeta(mediaId: String, providers: Bool? = nil, completion: @escaping (_ data: MediaProfileMeta?, _ error: Error?) -> Void)
```

Get profile interaction data for a title

Returns the current profile's interaction data for a title — everything you need to render the right UI state for that title.  Response includes: - **List status**: whether the title is liked, disliked, super-liked, watchlisted, or in watch history (`true`/`false` for each). - **Playback**: whether the title has a saved position, and the position details (progress 0–100, updated timestamp, season/episode for TV shows). - **Providers** *(optional)*: the streaming services where this title is available for the profile's selected region. Pass `providers=true` to include this. - **Completion**: whether the profile has finished this title (`completed`), and for TV shows, which season numbers are fully watched (`completedSeasons`).  **Auth tier:** session — send your session token in `Authorization: Bearer`. 

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

# **getPage**
```swift
    open class func getPage(pageId: String, completion: @escaping (_ data: Page?, _ error: Error?) -> Void)
```

Get a page

Returns a page and its metadata.  Page IDs are stable and permanent. The same ID keeps working across sessions, profiles and devices, so it's safe in a URL, a bookmark or a deep link.  What changes is the content: recommendations refresh roughly every 30 minutes, and after they do this returns the same page with re-ranked rows. There's nothing to handle — no error, no ID to swap.  **Auth tier:** session. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let pageId: String = "pageId_example" // The page to retrieve. Accepts either a page id or the `ref` from the navigation or provider tile you're opening — both resolve to the same page. 

Task {
    do {
        let result = try await discovr.getPage(pageId: pageId)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pageId** | **String** | The page to retrieve. Accepts either a page id or the &#x60;ref&#x60; from the navigation or provider tile you&#39;re opening — both resolve to the same page.  | 

### Return type

[**Page**](Page.md)

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

# **getProfile**
```swift
    open class func getProfile(profileId: String, completion: @escaping (_ data: Profile?, _ error: Error?) -> Void)
```

Get a profile

Returns a single profile by ID. Returns 404 if the profile doesn't exist or doesn't belong to the signed-in user. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let profileId: String = "profileId_example" // The ID of the profile to retrieve.

Task {
    do {
        let result = try await discovr.getProfile(profileId: profileId)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **profileId** | **String** | The ID of the profile to retrieve. | 

### Return type

[**Profile**](Profile.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProfileImages**
```swift
    open class func getProfileImages(limit: Int? = nil, pageToken: String? = nil, completion: @escaping (_ data: ProfileImagesResponse?, _ error: Error?) -> Void)
```

List avatar images

Returns publicly available avatar images for use in profile setup. Paginated — pass `nextToken` from the previous response as `pageToken` to load more. These are curated still images.  No authentication required. 

### Example
```swift
import Discovr


let limit: Int = 987 // Maximum number of images to return (1–50). (optional) (default: 16)
let pageToken: String = "pageToken_example" // Pagination cursor from the `nextToken` field of the previous response. Omit to start from the beginning. (optional)

DiscovrAPI.getProfileImages(limit: limit, pageToken: pageToken) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **Int** | Maximum number of images to return (1–50). | [optional] [default to 16]
 **pageToken** | **String** | Pagination cursor from the &#x60;nextToken&#x60; field of the previous response. Omit to start from the beginning. | [optional] 

### Return type

[**ProfileImagesResponse**](ProfileImagesResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProfiles**
```swift
    open class func getProfiles(completion: @escaping (_ data: GetProfilesResponse?, _ error: Error?) -> Void)
```

List profiles

Returns the signed-in user's profiles, newest first. Each one carries its ID, display name, avatar URL, and creation timestamp.  A profile that can't be read is left out of the response rather than failing it, so a single bad profile never costs the user their whole picker. Treat the list as complete for display purposes, and don't assume a missing profile means it was deleted.  **Auth tier:** identity — send your refresh token in the `Authorization: Bearer` header. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]


Task {
    do {
        let result = try await discovr.getProfiles()
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**GetProfilesResponse**](GetProfilesResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRow**
```swift
    open class func getRow(pageId: String, rowId: String, completion: @escaping (_ data: Row?, _ error: Error?) -> Void)
```

Get a row

Returns metadata for a specific row.  A row ID keeps resolving after recommendations refresh, so a rail the user has already opened stays usable. It's only readable by the profile it was built for.  **Auth tier:** session. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let pageId: String = "pageId_example" // The unique identifier of the page
let rowId: String = "rowId_example" // The unique identifier of the row

Task {
    do {
        let result = try await discovr.getRow(pageId: pageId, rowId: rowId)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pageId** | **String** | The unique identifier of the page | 
 **rowId** | **String** | The unique identifier of the row | 

### Return type

[**Row**](Row.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRowItems**
```swift
    open class func getRowItems(pageId: String, rowId: String, nextPageToken: String? = nil, limit: Int? = nil, completion: @escaping (_ data: GetRowItemsResponse?, _ error: Error?) -> Void)
```

List row items

Returns paginated items within a row. Items include the full display metadata needed to render a media card — title, poster, backdrop, type, and more.  Row IDs stay valid across a recommendations refresh, so a user can finish scrolling a rail they've already opened.  **Auth tier:** session. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let pageId: String = "pageId_example" // The unique identifier of the page
let rowId: String = "rowId_example" // The unique identifier of the row
let nextPageToken: String = "nextPageToken_example" // Opaque pagination token returned from the previous page (optional)
let limit: Int = 987 // Maximum number of items to return (optional) (default: 10)

Task {
    do {
        let result = try await discovr.getRowItems(pageId: pageId, rowId: rowId, nextPageToken: nextPageToken, limit: limit)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pageId** | **String** | The unique identifier of the page | 
 **rowId** | **String** | The unique identifier of the row | 
 **nextPageToken** | **String** | Opaque pagination token returned from the previous page | [optional] 
 **limit** | **Int** | Maximum number of items to return | [optional] [default to 10]

### Return type

[**GetRowItemsResponse**](GetRowItemsResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRows**
```swift
    open class func getRows(pageId: String, nextPageToken: String? = nil, limit: Int? = nil, completion: @escaping (_ data: GetRowsResponse?, _ error: Error?) -> Void)
```

List rows

Returns paginated rows for a page. Each row is a labeled group of media titles — the building blocks of your recommendation UI.  Row IDs are opaque references — pass them straight back to `GET /pages/{pageId}/rows/{rowId}/items`. They keep working even if recommendations refresh while the user is scrolling, so a rail they've already opened stays readable to the end.  Pagination continues in the set of results it started with. Very occasionally that set is no longer available and you'll get `409 CURSOR_EXPIRED`; restart pagination on the same page ID.  **Auth tier:** session. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let pageId: String = "pageId_example" // The unique identifier of the page
let nextPageToken: String = "nextPageToken_example" // Opaque pagination token returned from the previous page (optional)
let limit: Int = 987 // Maximum number of rows to return (optional) (default: 5)

Task {
    do {
        let result = try await discovr.getRows(pageId: pageId, nextPageToken: nextPageToken, limit: limit)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pageId** | **String** | The unique identifier of the page | 
 **nextPageToken** | **String** | Opaque pagination token returned from the previous page | [optional] 
 **limit** | **Int** | Maximum number of rows to return | [optional] [default to 5]

### Return type

[**GetRowsResponse**](GetRowsResponse.md)

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

Returns episode details for a specific TV season — episode titles, overviews, air dates, and episode numbers.  This is a public endpoint — no authentication required. Returns only generic catalog metadata. 

### Example
```swift
import Discovr


let mediaId: String = "mediaId_example" // The unique identifier of the TV show (e.g., `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
let seasonNumber: Int = 987 // The season number.
let language: String = "language_example" // ISO 639-1 language code for localised results (e.g., `en`). (optional)

DiscovrAPI.getSeasonDetails(mediaId: mediaId, seasonNumber: seasonNumber, language: language) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
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

No authorization required

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

Returns titles that are similar to the given movie or TV show. Useful for \"More like this\" sections.  This is a public endpoint — no authentication required. Returns only generic catalog metadata. 

### Example
```swift
import Discovr


let mediaId: String = "mediaId_example" // The unique identifier of the media item. Use `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
let language: String = "language_example" // Language code for results (e.g., `en-US`). (optional)
let page: Int = 987 // Page number for pagination (default: 1). (optional) (default: 1)

DiscovrAPI.getSimilarRecommendations(mediaId: mediaId, language: language, page: page) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
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

No authorization required

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

# **mintSessionToken**
```swift
    open class func mintSessionToken(mintSessionTokenPayload: MintSessionTokenPayload, completion: @escaping (_ data: SessionTokenResponse?, _ error: Error?) -> Void)
```

Mint a session token

Scopes your browsing session to a specific profile. You'll call this: - after sign-in, to pick which profile is active - when the user switches to a different profile - when the previous session token has expired  Returns a short-lived session token (valid for 30 minutes) and its expiry time. Use this token in the `Authorization` header for all session-tier endpoints — pages, rows, and profile-scoped lists.  The response also carries a `snapshotId`, which identifies the recommendations the user is currently browsing. Send it back on your next call so renewing a credential doesn't reshuffle the screen underneath them. Omit it on a first sign-in or a profile switch, where there's nothing to carry. Page IDs are unaffected either way.  **Auth tier:** identity — send your refresh token in the `Authorization: Bearer` header. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mintSessionTokenPayload: MintSessionTokenPayload = MintSessionTokenPayload(profileId: "profileId_example", ttlMs: 123, snapshotId: "snapshotId_example") // 

Task {
    do {
        let result = try await discovr.mintSessionToken(mintSessionTokenPayload: mintSessionTokenPayload)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mintSessionTokenPayload** | [**MintSessionTokenPayload**](MintSessionTokenPayload.md) |  | 

### Return type

[**SessionTokenResponse**](SessionTokenResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
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

# **pollDeviceCode**
```swift
    open class func pollDeviceCode(deviceCode: String, completion: @escaping (_ data: PollDeviceCode200Response?, _ error: Error?) -> Void)
```

Poll for auth token

The second step of the device code flow. Call this repeatedly after showing the user code or QR code.  While the user hasn't confirmed yet, you'll get `{ status: \"pending\", interval }` — wait `interval` seconds and poll again. Once they approve, the response changes to `{ refreshToken, publicId, expiresAt }`. Store the `refreshToken` securely — it's your long-lived credential for all identity-tier calls.  **Polling interval:** the server sets it and repeats it in every pending answer; it grows the longer the code has been waiting, so always use the latest value. The SDKs do this for you. Stop polling when you receive a `refreshToken` or a `401` error.  A person can decline on their phone. Your next poll then returns `401` with `device-code-denied` straight away (and on every poll after, until the code expires), so you can say so on screen instead of waiting out the timeout. 

### Example
```swift
import Discovr


let deviceCode: String = "deviceCode_example" // The device code obtained from the request device code endpoint

DiscovrAPI.pollDeviceCode(deviceCode: deviceCode) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceCode** | **String** | The device code obtained from the request device code endpoint | 

### Return type

[**PollDeviceCode200Response**](PollDeviceCode200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestDeviceCode**
```swift
    open class func requestDeviceCode(deviceCodePayload: DeviceCodePayload, size: Int? = nil, format: Format_requestDeviceCode? = nil, completion: @escaping (_ data: DeviceCodeResponse?, _ error: Error?) -> Void)
```

Request device code

Starts the TV / device sign-in flow. Call this to get a user code and QR code to display on screen. The user opens Discovr on their phone, scans the QR code or types the user code, and confirms sign-in. Once they do, your next poll to `/auth/device-codes/{deviceCode}/poll` returns a refresh token.  **Response format:** - `format=json` (default) — returns `{ deviceCode, userCode, authQRCode, verificationUrl, expiresIn, interval }`. The `authQRCode` is a base64 data URL — drop it straight into an `<img>` tag. Show `verificationUrl` next to the code so people who can't scan can type `userCode` there.  Keep `deviceCode` on the device. It is what you poll with, so it is never put in the QR code or shown to the person; the QR code and the screen carry only `userCode`. - `format=image` — returns a raw PNG binary. Handy if you're embedding the image directly without a data URL wrapper.  **QR code size:** Use the `size` parameter to match your display. TV screens benefit from larger codes (600–800 px). Default is 300 px. 

### Example
```swift
import Discovr


let deviceCodePayload: DeviceCodePayload = DeviceCodePayload(clientID: "clientID_example", demo: false) // 
let size: Int = 987 // QR code size in pixels. Larger sizes are recommended for TV displays. (optional) (default: 300)
let format: String = "format_example" // Response format. Use \"image\" for native clients to receive binary PNG directly. (optional) (default: .json)

DiscovrAPI.requestDeviceCode(deviceCodePayload: deviceCodePayload, size: size, format: format) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceCodePayload** | [**DeviceCodePayload**](DeviceCodePayload.md) |  | 
 **size** | **Int** | QR code size in pixels. Larger sizes are recommended for TV displays. | [optional] [default to 300]
 **format** | **String** | Response format. Use \&quot;image\&quot; for native clients to receive binary PNG directly. | [optional] [default to .json]

### Return type

[**DeviceCodeResponse**](DeviceCodeResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, image/png

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

# **searchGifs**
```swift
    open class func searchGifs(q: String, limit: Int? = nil, pos: String? = nil, contentfilter: Contentfilter_searchGifs? = nil, country: String? = nil, locale: String? = nil, completion: @escaping (_ data: GifSearchResponse?, _ error: Error?) -> Void)
```

Search GIFs

Searches for animated GIFs by keyword. Use the `contentfilter` parameter to control content safety (`off`, `low`, `medium`, `high`); if you omit it, the filtering configured for Discovr's Klipy account applies, which is not a fixed level, so pass it explicitly when you need a guaranteed one. Results are paginated — pass `next` from the previous response as `pos` to load more.  Each result's `url` is the full-size file and is an **MP4 whenever one is available**, otherwise a GIF, so render it with a video player or an image view according to its file extension (see `avatarMediaType` on profiles). `preview.url` is a lighter version for grids; use it for thumbnails and save `url` only for the one the user picks.  Klipy attribution is required wherever you show these results.  No authentication required. 

### Example
```swift
import Discovr


let q: String = "q_example" // Search term.
let limit: Int = 987 // Maximum number of results to return (1–50). (optional) (default: 20)
let pos: String = "pos_example" // Pagination cursor from the `next` field of the previous response. Omit to start from the beginning. (optional)
let contentfilter: String = "contentfilter_example" // Content safety level. `high` is the most restrictive; `off` applies no filtering. Omit it and Discovr's default filtering applies, not a fixed level. (optional)
let country: String = "country_example" // ISO 3166-1 alpha-2 country code for regional content preferences (e.g., `US`). Takes precedence over `locale`. (optional)
let locale: String = "locale_example" // Only its region part is used (`en_US` is treated as `US`), and only when `country` is not sent. (optional)

DiscovrAPI.searchGifs(q: q, limit: limit, pos: pos, contentfilter: contentfilter, country: country, locale: locale) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **q** | **String** | Search term. | 
 **limit** | **Int** | Maximum number of results to return (1–50). | [optional] [default to 20]
 **pos** | **String** | Pagination cursor from the &#x60;next&#x60; field of the previous response. Omit to start from the beginning. | [optional] 
 **contentfilter** | **String** | Content safety level. &#x60;high&#x60; is the most restrictive; &#x60;off&#x60; applies no filtering. Omit it and Discovr&#39;s default filtering applies, not a fixed level. | [optional] 
 **country** | **String** | ISO 3166-1 alpha-2 country code for regional content preferences (e.g., &#x60;US&#x60;). Takes precedence over &#x60;locale&#x60;. | [optional] 
 **locale** | **String** | Only its region part is used (&#x60;en_US&#x60; is treated as &#x60;US&#x60;), and only when &#x60;country&#x60; is not sent. | [optional] 

### Return type

[**GifSearchResponse**](GifSearchResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchMedia**
```swift
    open class func searchMedia(query: String? = nil, q: String? = nil, page: Int? = nil, completion: @escaping (_ data: SearchResponse?, _ error: Error?) -> Void)
```

Search media

Searches across movies, TV shows, and people. Returns a ranked list of matches. Use the `query` (or `q`) parameter for the search term.  Results are ordered by relevance — preserve that order rather than re-sorting client-side.  This endpoint does not accept filters. To browse by genre, runtime, release window, or watch provider, create a page with `pageFilters` instead. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let query: String = "query_example" // Search term. Use `query` or `q` — if both are provided, `query` takes precedence.  (optional)
let q: String = "q_example" // Search term (shorthand for `query`). At least one of `query` or `q` is required.  (optional)
let page: Int = 987 // Page of results to return, starting at 1. Check `has_more` on the response to decide whether to request the next page.  (optional) (default: 1)

Task {
    do {
        let result = try await discovr.searchMedia(query: query, q: q, page: page)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **query** | **String** | Search term. Use &#x60;query&#x60; or &#x60;q&#x60; — if both are provided, &#x60;query&#x60; takes precedence.  | [optional] 
 **q** | **String** | Search term (shorthand for &#x60;query&#x60;). At least one of &#x60;query&#x60; or &#x60;q&#x60; is required.  | [optional] 
 **page** | **Int** | Page of results to return, starting at 1. Check &#x60;has_more&#x60; on the response to decide whether to request the next page.  | [optional] [default to 1]

### Return type

[**SearchResponse**](SearchResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **signOutSession**
```swift
    open class func signOutSession(completion: @escaping (_ data: SignOutSession200Response?, _ error: Error?) -> Void)
```

Sign out the current device

Signs out the current device by revoking the refresh token you send in the `Authorization` header. Other devices the user is signed into aren't affected — you can only sign out the current device from a third-party app.  Identity-tier calls using this token fail immediately after revocation. Any existing session tokens (valid for 30 minutes) remain usable until they naturally expire.  Works the same way for a demo session's refresh token — a demo sandbox is an ordinary account, so this is a quick way to end one early and test how your app handles it.  Using an SDK? Call `signOut()` instead — it wraps this endpoint and also clears the credentials stored on the device.  **Auth tier:** identity — send your refresh token in the `Authorization: Bearer` header. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]


Task {
    do {
        let result = try await discovr.signOutSession()
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**SignOutSession200Response**](SignOutSession200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **startDemoSession**
```swift
    open class func startDemoSession(demoSessionRequest: DemoSessionRequest, completion: @escaping (_ data: DemoSessionResponse?, _ error: Error?) -> Void)
```

Start a demo session

Gives you a working Discovr account in one call — no sign-up, no credentials, nothing to configure. Use it while you build: to explore the API, prototype against realistic data, or try requests right here in the docs. It's a development tool, not something to put in front of your users.  You get a private sandbox pre-loaded with profiles, watchlists, and viewing history, so recommendation rows are populated from the very first request. It behaves like any other account: writes really do save, and reading them back returns what you'd expect.  The response is a refresh token. From here you're on the normal path — call [`POST /auth/session-token`](/api-reference/discovr/mint-session-token) with a profile ID to start browsing. Nothing else about your integration changes, which is the point: code you write against a demo session works unchanged against a real one.  Two things to keep in mind: - **Sandboxes are temporary.** Yours lasts 30 minutes (you can ask for a shorter one with `ttlMs`, never a longer one) and everything in it is deleted afterwards. Once it has ended, requests made with its token fail with `401` `TOKEN_EXPIRED`. Don't build anything that expects it to still be there tomorrow. - **Sandboxes are rate limited.** You can start five per hour from the same network address, and that allowance is shared with the demo button on Discovr's sign-in screens and with a TV's device-code demo. When it runs out you get a `429` with a `Retry-After` header, so hold on to the token you're given rather than requesting a new one per request.  You do still need a `clientId` — the same one your SDK constructor already takes regardless of demo mode, so this asks nothing new of a real integration. Trying this endpoint directly from this page? Use `discovr-docs-playground`, a client id that's always available for exactly that.  It also powers the \"Continue as Demo\" button that Discovr's sign-in screens show to a client created with `demoMode`, which is meant for development builds.  **Auth tier:** none — this is the one endpoint you can call without a credential. 

### Example
```swift
import Discovr


let demoSessionRequest: DemoSessionRequest = DemoSessionRequest(clientId: "clientId_example", ttlMs: 123) // 

DiscovrAPI.startDemoSession(demoSessionRequest: demoSessionRequest) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **demoSessionRequest** | [**DemoSessionRequest**](DemoSessionRequest.md) |  | 

### Return type

[**DemoSessionResponse**](DemoSessionResponse.md)

### Authorization

No authorization required

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

# **updateProfile**
```swift
    open class func updateProfile(profileId: String, updateProfilePayload: UpdateProfilePayload, completion: @escaping (_ data: Profile?, _ error: Error?) -> Void)
```

Update a profile

Updates a profile's name, avatar URL, or both. Provide only the fields you want to change — omitted fields stay as-is.  Returns the updated profile object. Returns 404 if the profile doesn't exist or doesn't belong to the signed-in user. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let profileId: String = "profileId_example" // The ID of the profile to update.
let updateProfilePayload: UpdateProfilePayload = UpdateProfilePayload(name: "name_example", avatarUrl: "avatarUrl_example", avatarMediaType: AvatarMediaType()) // 

Task {
    do {
        let result = try await discovr.updateProfile(profileId: profileId, updateProfilePayload: updateProfilePayload)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **profileId** | **String** | The ID of the profile to update. | 
 **updateProfilePayload** | [**UpdateProfilePayload**](UpdateProfilePayload.md) |  | 

### Return type

[**Profile**](Profile.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

