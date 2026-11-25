# DiscovrAPI

All URIs are relative to *https://api.discovr.media*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addToWatchlist**](DiscovrAPI.md#addtowatchlist) | **PUT** /profile/titles/{mediaId}/watchlist | Add a title to the watchlist
[**authorizeClientWeb**](DiscovrAPI.md#authorizeclientweb) | **GET** /auth/web/authorize | Redirect to web authentication
[**clearRating**](DiscovrAPI.md#clearrating) | **DELETE** /profile/titles/{mediaId}/rating | Clear a title&#39;s rating
[**createPage**](DiscovrAPI.md#createpage) | **POST** /pages | Create a recommendation page
[**createProfile**](DiscovrAPI.md#createprofile) | **POST** /profiles | Create a profile
[**deletePlaybackItem**](DiscovrAPI.md#deleteplaybackitem) | **DELETE** /profile/playback/{mediaId} | Remove a title from Continue Watching
[**deleteProfile**](DiscovrAPI.md#deleteprofile) | **DELETE** /profiles/{profileId} | Delete a profile
[**exchangeWebAuthCode**](DiscovrAPI.md#exchangewebauthcode) | **POST** /auth/web/token | Redeem a web sign-in code
[**getMedia**](DiscovrAPI.md#getmedia) | **GET** /media/{mediaId} | Get media details
[**getMediaAssets**](DiscovrAPI.md#getmediaassets) | **GET** /media/{mediaId}/assets | Get media assets
[**getPage**](DiscovrAPI.md#getpage) | **GET** /pages/{pageId} | Get a page
[**getPlaybackItems**](DiscovrAPI.md#getplaybackitems) | **GET** /profile/playback | Get playback items
[**getProfile**](DiscovrAPI.md#getprofile) | **GET** /profiles/{profileId} | Get a profile
[**getProfileImages**](DiscovrAPI.md#getprofileimages) | **GET** /profile-images | List avatar images
[**getProfiles**](DiscovrAPI.md#getprofiles) | **GET** /profiles | List profiles
[**getRow**](DiscovrAPI.md#getrow) | **GET** /pages/{pageId}/rows/{rowId} | Get a row
[**getRowItems**](DiscovrAPI.md#getrowitems) | **GET** /pages/{pageId}/rows/{rowId}/items | List row items
[**getRows**](DiscovrAPI.md#getrows) | **GET** /pages/{pageId}/rows | List rows
[**getSeasonDetails**](DiscovrAPI.md#getseasondetails) | **GET** /media/{mediaId}/seasons/{seasonNumber} | Get TV season details
[**getSeasonState**](DiscovrAPI.md#getseasonstate) | **GET** /profile/titles/{mediaId}/seasons/{seasonNumber} | Get which episodes of a TV season are watched
[**getSimilarRecommendations**](DiscovrAPI.md#getsimilarrecommendations) | **GET** /media/{mediaId}/similar | Get similar titles
[**getTitleState**](DiscovrAPI.md#gettitlestate) | **GET** /profile/titles/{mediaId} | Get the active profile&#39;s state for a title
[**getTitles**](DiscovrAPI.md#gettitles) | **GET** /profile/titles | List titles by rating, watchlist, or watch history
[**importHistory**](DiscovrAPI.md#importhistory) | **POST** /profile/history | Import a watch history entry
[**markUnwatched**](DiscovrAPI.md#markunwatched) | **DELETE** /profile/titles/{mediaId}/watched | Mark a title, season, or episode as unwatched
[**markWatched**](DiscovrAPI.md#markwatched) | **PUT** /profile/titles/{mediaId}/watched | Mark a title, season, or episode as watched
[**mintSessionToken**](DiscovrAPI.md#mintsessiontoken) | **POST** /auth/session-token | Mint a session token
[**pollDeviceCode**](DiscovrAPI.md#polldevicecode) | **POST** /auth/device-codes/{deviceCode}/poll | Poll for auth token
[**removeFromWatchlist**](DiscovrAPI.md#removefromwatchlist) | **DELETE** /profile/titles/{mediaId}/watchlist | Remove a title from the watchlist
[**requestDeviceCode**](DiscovrAPI.md#requestdevicecode) | **POST** /auth/device-codes | Request device code
[**scrobble**](DiscovrAPI.md#scrobble) | **POST** /profile/scrobble/{mediaId} | Record playback progress
[**searchGifs**](DiscovrAPI.md#searchgifs) | **GET** /gif-search | Search GIFs
[**searchMedia**](DiscovrAPI.md#searchmedia) | **GET** /search | Search media
[**setRating**](DiscovrAPI.md#setrating) | **PUT** /profile/titles/{mediaId}/rating | Set a title&#39;s rating
[**signOutSession**](DiscovrAPI.md#signoutsession) | **DELETE** /auth/session | Sign out the current device
[**startDemoSession**](DiscovrAPI.md#startdemosession) | **POST** /auth/demo-session | Start a demo session
[**updateProfile**](DiscovrAPI.md#updateprofile) | **PATCH** /profiles/{profileId} | Update a profile


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

let createPagePayload: CreatePagePayload = CreatePagePayload(pageFilters: FilterSpec(genres: [123], keywords: [123], mediaType: "mediaType_example", region: ["region_example"], withRuntimeGte: 123, withRuntimeLte: 123, withReleaseDateGte: Date(), withReleaseDateLte: Date(), withWatchProviders: ["withWatchProviders_example"])) //  (optional)

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

# **exchangeWebAuthCode**
```swift
    open class func exchangeWebAuthCode(webTokenPayload: WebTokenPayload, completion: @escaping (_ data: RefreshTokenResponse?, _ error: Error?) -> Void)
```

Redeem a web sign-in code

The last step of a web sign-in. Trade the authorization code Discovr delivered to your app, together with the `codeVerifier` you generated when you started, for the refresh token. The SDKs call this for you.  The code is single-use and lives 60 seconds. A request with a wrong `codeVerifier` fails **and spends the code**, so whoever intercepted it gets one try, not unlimited guesses. The refresh token comes back in this response only — it is never in a URL or a `postMessage`. 

### Example
```swift
import Discovr


let webTokenPayload: WebTokenPayload = WebTokenPayload(clientID: "clientID_example", code: "code_example", codeVerifier: "codeVerifier_example", deviceId: "deviceId_example") // 

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

Returns the best-available poster, backdrop, logo, and trailer for a title — one resolved URL per asset type. Uses English/language-neutral preference for images, and picks the best official trailer when one is available.  Row items already carry `logo_path` and `trailer` when they are served, so you only need this for a title you reached some other way, such as search.  **Auth tier:** session — send your session token in `Authorization: Bearer`. The response is generic catalog metadata, but the call needs a profile: the title you open is attributed to it. 

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

let pageId: String = "pageId_example" // The page id, or the ref a navigation or provider tile handed back (a ref works wherever an id does)
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
 **pageId** | **String** | The page id, or the ref a navigation or provider tile handed back (a ref works wherever an id does) | 
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

let pageId: String = "pageId_example" // The page id, or the ref a navigation or provider tile handed back (a ref works wherever an id does)
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
 **pageId** | **String** | The page id, or the ref a navigation or provider tile handed back (a ref works wherever an id does) | 
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

Returns paginated rows for a page. Each row is a labeled group of media titles — the building blocks of your recommendation UI.  Row IDs are opaque references — pass them straight back to `GET /pages/{pageId}/rows/{rowId}/items`. They keep working even if recommendations refresh while the user is scrolling, so a rail they've already opened stays readable to the end.  Pagination continues in the set of results it started with, and only for as long as the user's recommendations haven't turned over. After a turnover (or, rarely, once the set has been cleaned up) the token is refused with `409 cursor-expired`: call `getPage` and `getRows` with no token on the same page ID and replace what you're showing with the result. Rows you already hold are not affected: `GET /pages/{pageId}/rows/{rowId}/items` keeps working for them.  **Auth tier:** session. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let pageId: String = "pageId_example" // The page id, or the ref a navigation or provider tile handed back (a ref works wherever an id does)
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
 **pageId** | **String** | The page id, or the ref a navigation or provider tile handed back (a ref works wherever an id does) | 
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

# **pollDeviceCode**
```swift
    open class func pollDeviceCode(deviceCode: String, devicePollPayload: DevicePollPayload? = nil, completion: @escaping (_ data: DeviceCodePollResponse?, _ error: Error?) -> Void)
```

Poll for auth token

The second step of the device code flow. Call this repeatedly after showing the user code or QR code.  While the user hasn't confirmed yet, you'll get `{ status: \"pending\", interval }` — wait `interval` seconds and poll again. Once they approve, the response changes to `{ refreshToken, publicId, expiresAt }`. Store the `refreshToken` securely — it's your long-lived credential for all identity-tier calls.  **Polling interval:** the server sets it and repeats it in every pending answer; it grows the longer the code has been waiting, so always use the latest value. The SDKs do this for you. Stop polling when you receive a `refreshToken` or a `401` error.  A person can decline on their phone. Your next poll then returns `401` with `device-code-denied` straight away (and on every poll after, until the code expires), so you can say so on screen instead of waiting out the timeout. 

### Example
```swift
import Discovr


let deviceCode: String = "deviceCode_example" // The device code obtained from the request device code endpoint
let devicePollPayload: DevicePollPayload = DevicePollPayload(deviceId: "deviceId_example") // Send your `deviceId` so that signing in again on the same device replaces the credential it already held. The SDKs send it for you. The body is optional; with none, every sign-in is a credential of its own.  (optional)

DiscovrAPI.pollDeviceCode(deviceCode: deviceCode, devicePollPayload: devicePollPayload) { response, error in
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
 **devicePollPayload** | [**DevicePollPayload**](DevicePollPayload.md) | Send your &#x60;deviceId&#x60; so that signing in again on the same device replaces the credential it already held. The SDKs send it for you. The body is optional; with none, every sign-in is a credential of its own.  | [optional] 

### Return type

[**DeviceCodePollResponse**](DeviceCodePollResponse.md)

### Authorization

No authorization required

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

# **searchGifs**
```swift
    open class func searchGifs(q: String, limit: Int? = nil, pos: String? = nil, contentfilter: Contentfilter_searchGifs? = nil, country: String? = nil, locale: String? = nil, completion: @escaping (_ data: GifSearchResponse?, _ error: Error?) -> Void)
```

Search GIFs

Searches for animated GIFs by keyword. Use the `contentfilter` parameter to control content safety (`off`, `low`, `medium`, `high`); if you omit it, the filtering configured for Discovr's Klipy account applies, which is not a fixed level, so pass it explicitly when you need a guaranteed one. Results are paginated — pass `next` from the previous response as `pos` to load more.  Each result's `url` is the full-size file — an **MP4 whenever one is available**, otherwise a GIF or WebP. Read `media_type` (on the item and on `preview`) to pick a video player or an image view instead of guessing from the URL; it uses the same `AvatarMediaType` values as profiles. `preview` is a lighter file for grids, `still` is a JPEG still frame for Reduce Motion or static grids, and `placeholder` is a tiny blurred `data:` URI to show while the file loads. Save `url` for the one the user picks.  Klipy attribution is required wherever you show these results.  No authentication required. 

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

# **signOutSession**
```swift
    open class func signOutSession(completion: @escaping (_ data: SignOutResponse?, _ error: Error?) -> Void)
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

[**SignOutResponse**](SignOutResponse.md)

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

Gives you a working Discovr account in one call — no sign-up, no credentials, nothing to configure. Use it while you build: to explore the API, prototype against realistic data, or try requests right here in the docs. It's a development tool, not something to put in front of your users.  You get a private sandbox pre-loaded with profiles, watchlists, and viewing history, so recommendation rows are populated from the very first request. It behaves like any other account: writes really do save, and reading them back returns what you'd expect.  The response is a refresh token. From here you're on the normal path — call [`POST /auth/session-token`](/api-reference/discovr/mint-session-token) with a profile ID to start browsing. Nothing else about your integration changes, which is the point: code you write against a demo session works unchanged against a real one.  Two things to keep in mind: - **Sandboxes are temporary.** Yours lasts 30 minutes (you can ask for a shorter one with `ttlMs`, never a longer one) and everything in it is deleted afterwards. Once it has ended, requests made with its token fail with `401` `token-expired`. Don't build anything that expects it to still be there tomorrow. - **Sandboxes are rate limited.** You can start five per hour from the same network address, and that allowance is shared with the demo button on Discovr's sign-in screens and with a TV's device-code demo. When it runs out you get a `429` with a `Retry-After` header, so hold on to the token you're given rather than requesting a new one per request.  You do still need a `clientId` — the same one your SDK constructor already takes regardless of demo mode, so this asks nothing new of a real integration. Trying this endpoint directly from this page? Use `discovr-docs-playground`, a client id that's always available for exactly that.  It also powers the \"Continue as Demo\" button that Discovr's sign-in screens show to a client created with `demoMode`, which is meant for development builds.  **Auth tier:** none — this is the one endpoint you can call without a credential. 

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

