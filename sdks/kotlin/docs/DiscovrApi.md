# DiscovrApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**addToWatchlist**](DiscovrApi.md#addToWatchlist) | **PUT** /profile/titles/{mediaId}/watchlist | Add a title to the watchlist |
| [**authorizeClientWeb**](DiscovrApi.md#authorizeClientWeb) | **GET** /auth/web/authorize | Redirect to web authentication |
| [**clearRating**](DiscovrApi.md#clearRating) | **DELETE** /profile/titles/{mediaId}/rating | Clear a title&#39;s rating |
| [**createPage**](DiscovrApi.md#createPage) | **POST** /pages | Create a recommendation page |
| [**createProfile**](DiscovrApi.md#createProfile) | **POST** /profiles | Create a profile |
| [**deletePlaybackItem**](DiscovrApi.md#deletePlaybackItem) | **DELETE** /profile/playback/{mediaId} | Remove a title from Continue Watching |
| [**deleteProfile**](DiscovrApi.md#deleteProfile) | **DELETE** /profiles/{profileId} | Delete a profile |
| [**exchangeWebAuthCode**](DiscovrApi.md#exchangeWebAuthCode) | **POST** /auth/web/token | Redeem a web sign-in code |
| [**getMedia**](DiscovrApi.md#getMedia) | **GET** /media/{mediaId} | Get media details |
| [**getMediaAssets**](DiscovrApi.md#getMediaAssets) | **GET** /media/{mediaId}/assets | Get media assets |
| [**getPage**](DiscovrApi.md#getPage) | **GET** /pages/{pageId} | Get a page |
| [**getPlaybackItems**](DiscovrApi.md#getPlaybackItems) | **GET** /profile/playback | Get playback items |
| [**getProfile**](DiscovrApi.md#getProfile) | **GET** /profiles/{profileId} | Get a profile |
| [**getProfileImages**](DiscovrApi.md#getProfileImages) | **GET** /profile-images | List avatar images |
| [**getProfiles**](DiscovrApi.md#getProfiles) | **GET** /profiles | List profiles |
| [**getRow**](DiscovrApi.md#getRow) | **GET** /pages/{pageId}/rows/{rowId} | Get a row |
| [**getRowItems**](DiscovrApi.md#getRowItems) | **GET** /pages/{pageId}/rows/{rowId}/items | List row items |
| [**getRows**](DiscovrApi.md#getRows) | **GET** /pages/{pageId}/rows | List rows |
| [**getSeasonDetails**](DiscovrApi.md#getSeasonDetails) | **GET** /media/{mediaId}/seasons/{seasonNumber} | Get TV season details |
| [**getSeasonState**](DiscovrApi.md#getSeasonState) | **GET** /profile/titles/{mediaId}/seasons/{seasonNumber} | Get which episodes of a TV season are watched |
| [**getSimilarRecommendations**](DiscovrApi.md#getSimilarRecommendations) | **GET** /media/{mediaId}/similar | Get similar titles |
| [**getTitleState**](DiscovrApi.md#getTitleState) | **GET** /profile/titles/{mediaId} | Get the active profile&#39;s state for a title |
| [**getTitles**](DiscovrApi.md#getTitles) | **GET** /profile/titles | List titles by rating, watchlist, or watch history |
| [**importHistory**](DiscovrApi.md#importHistory) | **POST** /profile/history | Import a watch history entry |
| [**markUnwatched**](DiscovrApi.md#markUnwatched) | **DELETE** /profile/titles/{mediaId}/watched | Mark a title, season, or episode as unwatched |
| [**markWatched**](DiscovrApi.md#markWatched) | **PUT** /profile/titles/{mediaId}/watched | Mark a title, season, or episode as watched |
| [**mintSessionToken**](DiscovrApi.md#mintSessionToken) | **POST** /auth/session-token | Mint a session token |
| [**pollDeviceCode**](DiscovrApi.md#pollDeviceCode) | **POST** /auth/device-codes/{deviceCode}/poll | Poll for auth token |
| [**removeFromWatchlist**](DiscovrApi.md#removeFromWatchlist) | **DELETE** /profile/titles/{mediaId}/watchlist | Remove a title from the watchlist |
| [**requestDeviceCode**](DiscovrApi.md#requestDeviceCode) | **POST** /auth/device-codes | Request device code |
| [**scrobble**](DiscovrApi.md#scrobble) | **POST** /profile/scrobble/{mediaId} | Record playback progress |
| [**searchGifs**](DiscovrApi.md#searchGifs) | **GET** /gif-search | Search GIFs |
| [**searchMedia**](DiscovrApi.md#searchMedia) | **GET** /search | Search media |
| [**setRating**](DiscovrApi.md#setRating) | **PUT** /profile/titles/{mediaId}/rating | Set a title&#39;s rating |
| [**signOutSession**](DiscovrApi.md#signOutSession) | **DELETE** /auth/session | Sign out the current device |
| [**startDemoSession**](DiscovrApi.md#startDemoSession) | **POST** /auth/demo-session | Start a demo session |
| [**updateProfile**](DiscovrApi.md#updateProfile) | **PATCH** /profiles/{profileId} | Update a profile |


<a id="addToWatchlist"></a>
# **addToWatchlist**
> TitleState addToWatchlist(mediaId)

Add a title to the watchlist

Adds a title to the active profile&#39;s watchlist. Safe to call if it is already on the watchlist.  Returns the title&#39;s updated &#x60;TitleState&#x60;, so you can update your UI immediately without calling &#x60;getTitleState&#x60; again.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 
try {
    val result : TitleState = discovr.addToWatchlist(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#addToWatchlist")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#addToWatchlist")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String**| The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | |

### Return type

[**TitleState**](TitleState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="authorizeClientWeb"></a>
# **authorizeClientWeb**
> authorizeClientWeb(clientID, state, codeChallenge, codeChallengeMethod, redirectURL, platform)

Redirect to web authentication

Starts a web sign-in: sends the user&#39;s browser to the Discovr page where they sign in and approve your app. After they do, Discovr hands your app a short-lived, single-use **authorization code** (never the long-lived credential), and your app trades it for a refresh token with &#x60;POST /auth/web/token&#x60;. This is the OAuth authorization code flow with PKCE, so the SDKs do all of it for you.  - **&#x60;clientID&#x60;** — your registered app ID, so Discovr knows which app is requesting access. - **&#x60;state&#x60;** — your app&#39;s CSRF token. Discovr echoes it back unchanged so you can verify the response came from Discovr and not a third party. - **&#x60;codeChallenge&#x60;** / **&#x60;codeChallengeMethod&#x60;** — &#x60;base64url(SHA-256(verifier))&#x60; of a random &#x60;codeVerifier&#x60; you keep, and &#x60;S256&#x60;. Required on every request. - **&#x60;redirectURL&#x60;** — where to send the user after sign-in; it must be registered for your client. For a popup, send &#x60;openerOrigin&#x60; instead (the SDK does).  **What your app receives.** On your &#x60;redirectURL&#x60; as query parameters, or as a &#x60;postMessage&#x60; to the popup&#39;s opener: &#x60;{ code, state }&#x60; on success, or &#x60;{ error, state }&#x60; when the person cancels (&#x60;authorization-cancelled&#x60;) or sign-in cannot complete. &#x60;error&#x60; is one of the codes in &#x60;ApiError&#x60;. Check &#x60;state&#x60; first, then redeem &#x60;code&#x60; with your &#x60;codeVerifier&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = DiscovrApi()

val clientID : kotlin.String = abc123xyz // kotlin.String | The client ID of the third-party application
val state : kotlin.String = 9f2c41d07be34a85b1c6e0d3f7a29c84 // kotlin.String | Opaque value to prevent CSRF; echoed back in the callback response. 16 to 256 URL-safe characters (`A-Z a-z 0-9 - _`); 32 random bytes, hex-encoded, is 64. 
val codeChallenge : kotlin.String = E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM // kotlin.String | `base64url(SHA-256(codeVerifier))`, 43 characters. Generate a fresh random `codeVerifier` per sign-in and keep it; you send it to `POST /auth/web/token` when you redeem the code. 
val codeChallengeMethod : kotlin.String = S256 // kotlin.String | Always `S256`. `plain` is not accepted.
val redirectURL : kotlin.String = https://yourapp.com/callback // kotlin.String | Optional custom redirect URL. If omitted, redirects to the hosted callback page at  https://auth.discovr.media/callback.html which handles token exchange via postMessage  for web popup flows or deep links for mobile apps. Must be URL encoded when provided. 
val platform : kotlin.String = web // kotlin.String | Optional platform hint (web popup, mobile deep link, etc.). Not currently used. 
try {
    discovr.authorizeClientWeb(clientID, state, codeChallenge, codeChallengeMethod, redirectURL, platform)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#authorizeClientWeb")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#authorizeClientWeb")
    e.printStackTrace()
}
```

### Parameters
| **clientID** | **kotlin.String**| The client ID of the third-party application | |
| **state** | **kotlin.String**| Opaque value to prevent CSRF; echoed back in the callback response. 16 to 256 URL-safe characters (&#x60;A-Z a-z 0-9 - _&#x60;); 32 random bytes, hex-encoded, is 64.  | |
| **codeChallenge** | **kotlin.String**| &#x60;base64url(SHA-256(codeVerifier))&#x60;, 43 characters. Generate a fresh random &#x60;codeVerifier&#x60; per sign-in and keep it; you send it to &#x60;POST /auth/web/token&#x60; when you redeem the code.  | |
| **codeChallengeMethod** | **kotlin.String**| Always &#x60;S256&#x60;. &#x60;plain&#x60; is not accepted. | [enum: S256] |
| **redirectURL** | **kotlin.String**| Optional custom redirect URL. If omitted, redirects to the hosted callback page at  https://auth.discovr.media/callback.html which handles token exchange via postMessage  for web popup flows or deep links for mobile apps. Must be URL encoded when provided.  | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **platform** | **kotlin.String**| Optional platform hint (web popup, mobile deep link, etc.). Not currently used.  | [optional] [enum: web, mobile, tv] |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="clearRating"></a>
# **clearRating**
> TitleState clearRating(mediaId)

Clear a title&#39;s rating

Clears the active profile&#39;s rating for a title. Safe to call if the title has no rating.  Returns the title&#39;s updated &#x60;TitleState&#x60;, so you can update your UI immediately without calling &#x60;getTitleState&#x60; again.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 
try {
    val result : TitleState = discovr.clearRating(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#clearRating")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#clearRating")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String**| The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | |

### Return type

[**TitleState**](TitleState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="createPage"></a>
# **createPage**
> CreatePageResponse createPage(createPagePayload)

Create a recommendation page

Resolves a set of filters to the page that represents them.  A page&#39;s ID is determined by its filters alone, so the same filters always return the same ID — for every profile, on every device, indefinitely. Call this once and keep the ID.  Creating pages up front for your top-level tabs is cheap.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val createPagePayload : CreatePagePayload =  // CreatePagePayload | 
try {
    val result : CreatePageResponse = discovr.createPage(createPagePayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#createPage")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#createPage")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **createPagePayload** | [**CreatePagePayload**](CreatePagePayload.md)|  | [optional] |

### Return type

[**CreatePageResponse**](CreatePageResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="createProfile"></a>
# **createProfile**
> CreateProfileResponse createProfile(createProfilePayload)

Create a profile

Creates a new profile for the signed-in user. Provide a display name and an avatar URL.  On success you&#39;ll get back a &#x60;profileId&#x60;. Use that ID with &#x60;POST /auth/session-token&#x60; to mint a session token and start browsing recommendations for this profile. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val createProfilePayload : CreateProfilePayload = {"name":"Sci-Fi Lover","avatarUrl":"https://example.com/avatar.jpg"} // CreateProfilePayload | 
try {
    val result : CreateProfileResponse = discovr.createProfile(createProfilePayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#createProfile")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#createProfile")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **createProfilePayload** | [**CreateProfilePayload**](CreateProfilePayload.md)|  | |

### Return type

[**CreateProfileResponse**](CreateProfileResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="deletePlaybackItem"></a>
# **deletePlaybackItem**
> SuccessMessage deletePlaybackItem(mediaId)

Remove a title from Continue Watching

Removes a title from the in-progress Continue Watching list without changing its watched history. Use &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;). 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | The media ID of the title to remove. Format: `MV_<number>` for movies, `TV_<number>` for TV shows.  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
try {
    val result : SuccessMessage = discovr.deletePlaybackItem(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#deletePlaybackItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#deletePlaybackItem")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String**| The media ID of the title to remove. Format: &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows.  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="deleteProfile"></a>
# **deleteProfile**
> DeleteProfileResponse deleteProfile(profileId)

Delete a profile

Permanently deletes the profile. This action can&#39;t be undone.  Deleting an account&#39;s only profile is allowed. The account then has no profiles and can&#39;t mint a session token until a new one is created — see [Handle zero profiles](/guides/profiles/listing-and-selecting-profiles). Returns 404 if the profile doesn&#39;t exist or doesn&#39;t belong to the signed-in user. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val profileId : kotlin.String = profile_abc123xyz // kotlin.String | The ID of the profile to delete.
try {
    val result : DeleteProfileResponse = discovr.deleteProfile(profileId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#deleteProfile")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#deleteProfile")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **profileId** | **kotlin.String**| The ID of the profile to delete. | |

### Return type

[**DeleteProfileResponse**](DeleteProfileResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="exchangeWebAuthCode"></a>
# **exchangeWebAuthCode**
> RefreshTokenResponse exchangeWebAuthCode(webTokenPayload)

Redeem a web sign-in code

The last step of a web sign-in. Trade the authorization code Discovr delivered to your app, together with the &#x60;codeVerifier&#x60; you generated when you started, for the refresh token. The SDKs call this for you.  The code is single-use and lives 60 seconds. A request with a wrong &#x60;codeVerifier&#x60; fails **and spends the code**, so whoever intercepted it gets one try, not unlimited guesses. The refresh token comes back in this response only — it is never in a URL or a &#x60;postMessage&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = DiscovrApi()

val webTokenPayload : WebTokenPayload =  // WebTokenPayload | 
try {
    val result : RefreshTokenResponse = discovr.exchangeWebAuthCode(webTokenPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#exchangeWebAuthCode")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#exchangeWebAuthCode")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **webTokenPayload** | [**WebTokenPayload**](WebTokenPayload.md)|  | |

### Return type

[**RefreshTokenResponse**](RefreshTokenResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

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
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = mediaId_example // kotlin.String | The unique identifier of the media item. Use `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
try {
    val result : MediaResponse = discovr.getMedia(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#getMedia")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#getMedia")
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
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = mediaId_example // kotlin.String | The unique identifier of the media item. Use `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
try {
    val result : MediaAssetsResponse = discovr.getMediaAssets(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#getMediaAssets")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#getMediaAssets")
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

<a id="getPage"></a>
# **getPage**
> Page getPage(pageId)

Get a page

Returns a page and its metadata.  Page IDs are stable and permanent. The same ID keeps working across sessions, profiles and devices, so it&#39;s safe in a URL, a bookmark or a deep link.  What changes is the content: recommendations refresh roughly every 30 minutes, and after they do this returns the same page with re-ranked rows. There&#39;s nothing to handle — no error, no ID to swap.  **Auth tier:** session. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val pageId : kotlin.String = pageId_example // kotlin.String | The page to retrieve. Accepts either a page id or the `ref` from the navigation or provider tile you're opening — both resolve to the same page. 
try {
    val result : Page = discovr.getPage(pageId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#getPage")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#getPage")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **pageId** | **kotlin.String**| The page to retrieve. Accepts either a page id or the &#x60;ref&#x60; from the navigation or provider tile you&#39;re opening — both resolve to the same page.  | |

### Return type

[**Page**](Page.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getPlaybackItems"></a>
# **getPlaybackItems**
> PlaybackListResponse getPlaybackItems(nextPageToken, limit)

Get playback items

Returns the profile&#39;s in-progress titles — everything with a saved playback position. Ordered by most recently updated. Use this to build a \&quot;Continue Watching\&quot; row.  Each item includes a &#x60;progress&#x60; field (0–100) showing how far through the title the user is. To update progress as a viewer watches, call &#x60;POST /profile/scrobble/{mediaId}&#x60;.  **Pagination:** Pass &#x60;nextPageToken&#x60; from the previous response to fetch the next page. If &#x60;hasMore&#x60; is &#x60;true&#x60;, more items are available. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val nextPageToken : kotlin.String = nextPageToken_example // kotlin.String | Opaque token from previous page for pagination
val limit : kotlin.Int = 56 // kotlin.Int | Maximum number of items to return (1-50, default: 10)
try {
    val result : PlaybackListResponse = discovr.getPlaybackItems(nextPageToken, limit)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#getPlaybackItems")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#getPlaybackItems")
    e.printStackTrace()
}
```

### Parameters
| **nextPageToken** | **kotlin.String**| Opaque token from previous page for pagination | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **limit** | **kotlin.Int**| Maximum number of items to return (1-50, default: 10) | [optional] [default to 10] |

### Return type

[**PlaybackListResponse**](PlaybackListResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getProfile"></a>
# **getProfile**
> Profile getProfile(profileId)

Get a profile

Returns a single profile by ID. Returns 404 if the profile doesn&#39;t exist or doesn&#39;t belong to the signed-in user. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val profileId : kotlin.String = profile_abc123xyz // kotlin.String | The ID of the profile to retrieve.
try {
    val result : Profile = discovr.getProfile(profileId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#getProfile")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#getProfile")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **profileId** | **kotlin.String**| The ID of the profile to retrieve. | |

### Return type

[**Profile**](Profile.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

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

val discovr = DiscovrApi()

val limit : kotlin.Int = 16 // kotlin.Int | Maximum number of images to return (1–50).
val pageToken : kotlin.String = pageToken_example // kotlin.String | Pagination cursor from the `nextToken` field of the previous response. Omit to start from the beginning.
try {
    val result : ProfileImagesResponse = discovr.getProfileImages(limit, pageToken)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#getProfileImages")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#getProfileImages")
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

<a id="getProfiles"></a>
# **getProfiles**
> GetProfilesResponse getProfiles()

List profiles

Returns the signed-in user&#39;s profiles, newest first. Each one carries its ID, display name, avatar URL, and creation timestamp.  A profile that can&#39;t be read is left out of the response rather than failing it, so a single bad profile never costs the user their whole picker. Treat the list as complete for display purposes, and don&#39;t assume a missing profile means it was deleted.  **Auth tier:** identity — send your refresh token in the &#x60;Authorization: Bearer&#x60; header. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

try {
    val result : GetProfilesResponse = discovr.getProfiles()
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#getProfiles")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#getProfiles")
    e.printStackTrace()
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**GetProfilesResponse**](GetProfilesResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getRow"></a>
# **getRow**
> Row getRow(pageId, rowId)

Get a row

Returns metadata for a specific row.  A row ID keeps resolving after recommendations refresh, so a rail the user has already opened stays usable. It&#39;s only readable by the profile it was built for.  **Auth tier:** session. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val pageId : kotlin.String = pageId_example // kotlin.String | The page id, or the ref a navigation or provider tile handed back (a ref works wherever an id does)
val rowId : kotlin.String = rowId_example // kotlin.String | The unique identifier of the row
try {
    val result : Row = discovr.getRow(pageId, rowId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#getRow")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#getRow")
    e.printStackTrace()
}
```

### Parameters
| **pageId** | **kotlin.String**| The page id, or the ref a navigation or provider tile handed back (a ref works wherever an id does) | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **rowId** | **kotlin.String**| The unique identifier of the row | |

### Return type

[**Row**](Row.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getRowItems"></a>
# **getRowItems**
> GetRowItemsResponse getRowItems(pageId, rowId, nextPageToken, limit)

List row items

Returns paginated items within a row. Items include the full display metadata needed to render a media card — title, poster, backdrop, type, and more.  Row IDs stay valid across a recommendations refresh, so a user can finish scrolling a rail they&#39;ve already opened.  **Auth tier:** session. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val pageId : kotlin.String = pageId_example // kotlin.String | The page id, or the ref a navigation or provider tile handed back (a ref works wherever an id does)
val rowId : kotlin.String = rowId_example // kotlin.String | The unique identifier of the row
val nextPageToken : kotlin.String = nextPageToken_example // kotlin.String | Opaque pagination token returned from the previous page
val limit : kotlin.Int = 56 // kotlin.Int | Maximum number of items to return
try {
    val result : GetRowItemsResponse = discovr.getRowItems(pageId, rowId, nextPageToken, limit)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#getRowItems")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#getRowItems")
    e.printStackTrace()
}
```

### Parameters
| **pageId** | **kotlin.String**| The page id, or the ref a navigation or provider tile handed back (a ref works wherever an id does) | |
| **rowId** | **kotlin.String**| The unique identifier of the row | |
| **nextPageToken** | **kotlin.String**| Opaque pagination token returned from the previous page | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **limit** | **kotlin.Int**| Maximum number of items to return | [optional] [default to 10] |

### Return type

[**GetRowItemsResponse**](GetRowItemsResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getRows"></a>
# **getRows**
> GetRowsResponse getRows(pageId, nextPageToken, limit)

List rows

Returns paginated rows for a page. Each row is a labeled group of media titles — the building blocks of your recommendation UI.  Row IDs are opaque references — pass them straight back to &#x60;GET /pages/{pageId}/rows/{rowId}/items&#x60;. They keep working even if recommendations refresh while the user is scrolling, so a rail they&#39;ve already opened stays readable to the end.  Pagination continues in the set of results it started with, and only for as long as the user&#39;s recommendations haven&#39;t turned over. After a turnover (or, rarely, once the set has been cleaned up) the token is refused with &#x60;409 cursor-expired&#x60;: call &#x60;getPage&#x60; and &#x60;getRows&#x60; with no token on the same page ID and replace what you&#39;re showing with the result. Rows you already hold are not affected: &#x60;GET /pages/{pageId}/rows/{rowId}/items&#x60; keeps working for them.  **Auth tier:** session. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val pageId : kotlin.String = pageId_example // kotlin.String | The page id, or the ref a navigation or provider tile handed back (a ref works wherever an id does)
val nextPageToken : kotlin.String = nextPageToken_example // kotlin.String | Opaque pagination token returned from the previous page
val limit : kotlin.Int = 56 // kotlin.Int | Maximum number of rows to return
try {
    val result : GetRowsResponse = discovr.getRows(pageId, nextPageToken, limit)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#getRows")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#getRows")
    e.printStackTrace()
}
```

### Parameters
| **pageId** | **kotlin.String**| The page id, or the ref a navigation or provider tile handed back (a ref works wherever an id does) | |
| **nextPageToken** | **kotlin.String**| Opaque pagination token returned from the previous page | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **limit** | **kotlin.Int**| Maximum number of rows to return | [optional] [default to 5] |

### Return type

[**GetRowsResponse**](GetRowsResponse.md)

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
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = mediaId_example // kotlin.String | The unique identifier of the TV show (e.g., `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
val seasonNumber : kotlin.Int = 1 // kotlin.Int | The season number.
val language : kotlin.String = en // kotlin.String | ISO 639-1 language code for localised results (e.g., `en`).
try {
    val result : SeasonDetailsResponse = discovr.getSeasonDetails(mediaId, seasonNumber, language)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#getSeasonDetails")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#getSeasonDetails")
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

<a id="getSeasonState"></a>
# **getSeasonState**
> SeasonState getSeasonState(mediaId, seasonNumber)

Get which episodes of a TV season are watched

Returns which episodes of a single TV season the active profile has finished, plus whether the season as a whole is complete.  A season counts as complete when every aired episode in it is watched. Specials (season &#x60;0&#x60;) never count toward show completion. Pair this with &#x60;getSeasonDetails&#x60; for episode titles and artwork, and with &#x60;getTitleState&#x60; for title-level state and live playback position.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = TV_1396 // kotlin.String | The TV show's media ID (`TV_<id>`), or an item `ref`. 
val seasonNumber : kotlin.Int = 1 // kotlin.Int | The season number (0 for specials, 1+ for regular seasons).
try {
    val result : SeasonState = discovr.getSeasonState(mediaId, seasonNumber)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#getSeasonState")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#getSeasonState")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The TV show&#39;s media ID (&#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **seasonNumber** | **kotlin.Int**| The season number (0 for specials, 1+ for regular seasons). | |

### Return type

[**SeasonState**](SeasonState.md)

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
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = mediaId_example // kotlin.String | The unique identifier of the media item. Use `MV_<id>` for movies or `TV_<id>` for TV shows (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
val language : kotlin.String = en-US // kotlin.String | Language code for results (e.g., `en-US`).
val page : kotlin.Int = 1 // kotlin.Int | Page number for pagination (default: 1).
try {
    val result : SimilarResponse = discovr.getSimilarRecommendations(mediaId, language, page)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#getSimilarRecommendations")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#getSimilarRecommendations")
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

<a id="getTitleState"></a>
# **getTitleState**
> TitleState getTitleState(mediaId, providers)

Get the active profile&#39;s state for a title

Returns everything your UI needs to show the active profile&#39;s relationship with a title:  - **Rating**: &#x60;liked&#x60;, &#x60;disliked&#x60;, &#x60;super_liked&#x60;, or &#x60;null&#x60;. - **Watchlist**: whether the title is saved to the watchlist. - **Watch progress &amp; completion**: whether the profile has started (&#x60;watched&#x60;) or finished (&#x60;completed&#x60;) the title, total &#x60;plays&#x60;, watched &#x60;episodes&#x60; and &#x60;completedSeasons&#x60; for TV shows, and the live &#x60;playback&#x60; resume position when mid-watch. - **Providers** *(optional)*: pass &#x60;providers&#x3D;true&#x60; to include streaming availability filtered to the account&#39;s chosen services.  **Title opens &amp; recommendations.** Calling &#x60;GET /profile/titles/{mediaId}&#x60; records that the viewer opened the title and directly affects the profile&#39;s recommendations. Only call it when the title screen actually opens — prefetching or calling it on hover/focus registers every loaded tile similarly to the viewer liking the title and will skew their recommendations. Every state write (&#x60;setRating&#x60;, &#x60;clearRating&#x60;, &#x60;addToWatchlist&#x60;, &#x60;removeFromWatchlist&#x60;, &#x60;markWatched&#x60;, &#x60;markUnwatched&#x60;) returns the updated &#x60;TitleState&#x60;, so you don&#39;t need to refetch this endpoint after a change.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | The title's media ID (`MV_<id>` for movies, `TV_<id>` for TV shows).  Also accepts an item's `ref` in place of the ID. Prefer the `ref` when you have one — it resolves to the same title and sharpens recommendations. 
val providers : kotlin.Boolean = true // kotlin.Boolean | Set to `true` to include streaming provider availability filtered to the account's selected services.
try {
    val result : TitleState = discovr.getTitleState(mediaId, providers)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#getTitleState")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#getTitleState")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; for movies, &#x60;TV_&lt;id&gt;&#x60; for TV shows).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the ID. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens recommendations.  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **providers** | **kotlin.Boolean**| Set to &#x60;true&#x60; to include streaming provider availability filtered to the account&#39;s selected services. | [optional] [default to false] |

### Return type

[**TitleState**](TitleState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getTitles"></a>
# **getTitles**
> TitleListResponse getTitles(rating, watchlist, watched, nextPageToken, limit)

List titles by rating, watchlist, or watch history

Returns a paginated list of titles for the active profile, ordered most recent first.  Pass **exactly one** filter query parameter:  - &#x60;rating&#x3D;liked&#x60;, &#x60;rating&#x3D;disliked&#x60;, or &#x60;rating&#x3D;super_liked&#x60; — titles with that rating, newest rated first. - &#x60;watchlist&#x3D;true&#x60; — the profile&#39;s watchlist, newest added first. - &#x60;watched&#x3D;true&#x60; — the profile&#39;s watch history (one entry per title, with &#x60;completed&#x60;, &#x60;plays&#x60;, and the last episode for TV shows), most recently watched first.  Each item includes a &#x60;ref&#x60; alongside its &#x60;id&#x60;. Pass the &#x60;ref&#x60; when the viewer opens or acts on the title.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val rating : Rating =  // Rating | Filter by rating (`liked`, `disliked`, or `super_liked`).
val watchlist : kotlin.Boolean = true // kotlin.Boolean | Set to `true` to list the profile's watchlist.
val watched : kotlin.Boolean = true // kotlin.Boolean | Set to `true` to list the profile's watch history (one row per title).
val nextPageToken : kotlin.String = nextPageToken_example // kotlin.String | Opaque cursor token from the previous page.
val limit : kotlin.Int = 56 // kotlin.Int | Maximum number of titles to return (1–50, default 10).
try {
    val result : TitleListResponse = discovr.getTitles(rating, watchlist, watched, nextPageToken, limit)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#getTitles")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#getTitles")
    e.printStackTrace()
}
```

### Parameters
| **rating** | [**Rating**](.md)| Filter by rating (&#x60;liked&#x60;, &#x60;disliked&#x60;, or &#x60;super_liked&#x60;). | [optional] [enum: liked, disliked, super_liked] |
| **watchlist** | **kotlin.Boolean**| Set to &#x60;true&#x60; to list the profile&#39;s watchlist. | [optional] |
| **watched** | **kotlin.Boolean**| Set to &#x60;true&#x60; to list the profile&#39;s watch history (one row per title). | [optional] |
| **nextPageToken** | **kotlin.String**| Opaque cursor token from the previous page. | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **limit** | **kotlin.Int**| Maximum number of titles to return (1–50, default 10). | [optional] [default to 10] |

### Return type

[**TitleListResponse**](TitleListResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="importHistory"></a>
# **importHistory**
> TitleState importHistory(importHistoryPayload)

Import a watch history entry

Imports a previously watched movie, show, season, or episode from an external source.  - &#x60;mediaId&#x60;: the title to import (&#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows). - &#x60;imported&#x60;: required string naming the external source (for example &#x60;\&quot;trakt\&quot;&#x60;). - &#x60;updatedAt&#x60;: optional ISO 8601 timestamp of when it was watched. Defaults to now. - &#x60;season&#x60; / &#x60;episode&#x60;: optional TV scope. Omit both to import all aired episodes of the show; pass &#x60;season&#x60; to import that season; pass both to import a single episode.  For live viewing use &#x60;scrobble()&#x60;, and for interactive \&quot;Mark as watched\&quot; buttons use &#x60;markWatched()&#x60;. To read watch history, use &#x60;GET /profile/titles?watched&#x3D;true&#x60;.  Returns the title&#39;s updated &#x60;TitleState&#x60;.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val importHistoryPayload : ImportHistoryPayload = {"mediaId":"TV_1396","imported":"trakt","updatedAt":"2023-01-15T20:00:00.000Z","season":1,"episode":5} // ImportHistoryPayload | 
try {
    val result : TitleState = discovr.importHistory(importHistoryPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#importHistory")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#importHistory")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **importHistoryPayload** | [**ImportHistoryPayload**](ImportHistoryPayload.md)|  | |

### Return type

[**TitleState**](TitleState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="markUnwatched"></a>
# **markUnwatched**
> TitleState markUnwatched(mediaId, season, episode)

Mark a title, season, or episode as unwatched

Takes a movie, a TV show, a season, or an episode back to unwatched in one atomic call.  It removes the watched state for that scope and clears any in-progress Continue Watching position inside it. Calling it for a title that isn&#39;t watched changes nothing and still succeeds, so it&#39;s safe to retry.  For TV shows, &#x60;season&#x60; and &#x60;episode&#x60; choose how much to undo:  - Omit both to undo **the whole show**, every season. - Pass &#x60;season&#x60; to undo **that season**. - Pass &#x60;season&#x60; and &#x60;episode&#x60; to undo **that episode**.  Returns the title&#39;s updated &#x60;TitleState&#x60;, so you don&#39;t need to refetch &#x60;getTitleState&#x60;.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = TV_1396 // kotlin.String | The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 
val season : kotlin.Int = 1 // kotlin.Int | TV only. Season number. Omit to undo every season of the show.
val episode : kotlin.Int = 5 // kotlin.Int | TV only, and only together with `season`. Episode number. Omit to undo the whole season.
try {
    val result : TitleState = discovr.markUnwatched(mediaId, season, episode)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#markUnwatched")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#markUnwatched")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | |
| **season** | **kotlin.Int**| TV only. Season number. Omit to undo every season of the show. | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **episode** | **kotlin.Int**| TV only, and only together with &#x60;season&#x60;. Episode number. Omit to undo the whole season. | [optional] |

### Return type

[**TitleState**](TitleState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="markWatched"></a>
# **markWatched**
> TitleState markWatched(mediaId, season, episode)

Mark a title, season, or episode as watched

Marks a movie, an entire TV show, a season, or a single episode as watched in one atomic call.  For TV shows, &#x60;season&#x60; and &#x60;episode&#x60; pick the scope:  - Omit both to mark **every aired episode** across all regular seasons (season 1 and up) as watched. Specials (season &#x60;0&#x60;) are excluded. - Pass &#x60;season&#x60; to mark every aired episode of **that season**. - Pass &#x60;season&#x60; and &#x60;episode&#x60; to mark **that episode**.  Any in-progress Continue Watching position within the marked scope is cleared automatically. Returns the title&#39;s updated &#x60;TitleState&#x60;, so you don&#39;t need to refetch &#x60;getTitleState&#x60;.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = TV_1396 // kotlin.String | The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 
val season : kotlin.Int = 1 // kotlin.Int | TV only. Season number. Omit to mark every aired season of the show.
val episode : kotlin.Int = 5 // kotlin.Int | TV only, and only together with `season`. Episode number. Omit to mark the whole season.
try {
    val result : TitleState = discovr.markWatched(mediaId, season, episode)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#markWatched")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#markWatched")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | |
| **season** | **kotlin.Int**| TV only. Season number. Omit to mark every aired season of the show. | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **episode** | **kotlin.Int**| TV only, and only together with &#x60;season&#x60;. Episode number. Omit to mark the whole season. | [optional] |

### Return type

[**TitleState**](TitleState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="mintSessionToken"></a>
# **mintSessionToken**
> SessionTokenResponse mintSessionToken(mintSessionTokenPayload)

Mint a session token

Scopes your browsing session to a specific profile. You&#39;ll call this: - after sign-in, to pick which profile is active - when the user switches to a different profile - when the previous session token has expired  Returns a short-lived session token (valid for 30 minutes) and its expiry time. Use this token in the &#x60;Authorization&#x60; header for all session-tier endpoints — pages, rows, and profile-scoped lists.  The response also carries a &#x60;snapshotId&#x60;, which identifies the recommendations the user is currently browsing. Send it back on your next call so renewing a credential doesn&#39;t reshuffle the screen underneath them. Omit it on a first sign-in or a profile switch, where there&#39;s nothing to carry. Page IDs are unaffected either way.  **Auth tier:** identity — send your refresh token in the &#x60;Authorization: Bearer&#x60; header. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mintSessionTokenPayload : MintSessionTokenPayload =  // MintSessionTokenPayload | 
try {
    val result : SessionTokenResponse = discovr.mintSessionToken(mintSessionTokenPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#mintSessionToken")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#mintSessionToken")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mintSessionTokenPayload** | [**MintSessionTokenPayload**](MintSessionTokenPayload.md)|  | |

### Return type

[**SessionTokenResponse**](SessionTokenResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="pollDeviceCode"></a>
# **pollDeviceCode**
> DeviceCodePollResponse pollDeviceCode(deviceCode, devicePollPayload)

Poll for auth token

The second step of the device code flow. Call this repeatedly after showing the user code or QR code.  While the user hasn&#39;t confirmed yet, you&#39;ll get &#x60;{ status: \&quot;pending\&quot;, interval }&#x60; — wait &#x60;interval&#x60; seconds and poll again. Once they approve, the response changes to &#x60;{ refreshToken, publicId, expiresAt }&#x60;. Store the &#x60;refreshToken&#x60; securely — it&#39;s your long-lived credential for all identity-tier calls.  **Polling interval:** the server sets it and repeats it in every pending answer; it grows the longer the code has been waiting, so always use the latest value. The SDKs do this for you. Stop polling when you receive a &#x60;refreshToken&#x60; or a &#x60;401&#x60; error.  A person can decline on their phone. Your next poll then returns &#x60;401&#x60; with &#x60;device-code-denied&#x60; straight away (and on every poll after, until the code expires), so you can say so on screen instead of waiting out the timeout. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = DiscovrApi()

val deviceCode : kotlin.String = dvc_abc123xyz789 // kotlin.String | The device code obtained from the request device code endpoint
val devicePollPayload : DevicePollPayload =  // DevicePollPayload | Send your `deviceId` so that signing in again on the same device replaces the credential it already held. The SDKs send it for you. The body is optional; with none, every sign-in is a credential of its own. 
try {
    val result : DeviceCodePollResponse = discovr.pollDeviceCode(deviceCode, devicePollPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#pollDeviceCode")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#pollDeviceCode")
    e.printStackTrace()
}
```

### Parameters
| **deviceCode** | **kotlin.String**| The device code obtained from the request device code endpoint | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **devicePollPayload** | [**DevicePollPayload**](DevicePollPayload.md)| Send your &#x60;deviceId&#x60; so that signing in again on the same device replaces the credential it already held. The SDKs send it for you. The body is optional; with none, every sign-in is a credential of its own.  | [optional] |

### Return type

[**DeviceCodePollResponse**](DeviceCodePollResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="removeFromWatchlist"></a>
# **removeFromWatchlist**
> TitleState removeFromWatchlist(mediaId)

Remove a title from the watchlist

Removes a title from the active profile&#39;s watchlist. Safe to call if it is not on the watchlist.  Returns the title&#39;s updated &#x60;TitleState&#x60;, so you can update your UI immediately without calling &#x60;getTitleState&#x60; again.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 
try {
    val result : TitleState = discovr.removeFromWatchlist(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#removeFromWatchlist")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#removeFromWatchlist")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String**| The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | |

### Return type

[**TitleState**](TitleState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="requestDeviceCode"></a>
# **requestDeviceCode**
> DeviceCodeResponse requestDeviceCode(deviceCodePayload, size, format)

Request device code

Starts the TV / device sign-in flow. Call this to get a user code and QR code to display on screen. The user opens Discovr on their phone, scans the QR code or types the user code, and confirms sign-in. Once they do, your next poll to &#x60;/auth/device-codes/{deviceCode}/poll&#x60; returns a refresh token.  **Response format:** - &#x60;format&#x3D;json&#x60; (default) — returns &#x60;{ deviceCode, userCode, authQRCode, verificationUrl, expiresIn, interval }&#x60;. The &#x60;authQRCode&#x60; is a base64 data URL — drop it straight into an &#x60;&lt;img&gt;&#x60; tag. Show &#x60;verificationUrl&#x60; next to the code so people who can&#39;t scan can type &#x60;userCode&#x60; there.  Keep &#x60;deviceCode&#x60; on the device. It is what you poll with, so it is never put in the QR code or shown to the person; the QR code and the screen carry only &#x60;userCode&#x60;. - &#x60;format&#x3D;image&#x60; — returns a raw PNG binary. Handy if you&#39;re embedding the image directly without a data URL wrapper.  **QR code size:** Use the &#x60;size&#x60; parameter to match your display. TV screens benefit from larger codes (600–800 px). Default is 300 px. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = DiscovrApi()

val deviceCodePayload : DeviceCodePayload = {"clientID":"abc123xyz"} // DeviceCodePayload | 
val size : kotlin.Int = 600 // kotlin.Int | QR code size in pixels. Larger sizes are recommended for TV displays.
val format : kotlin.String = json // kotlin.String | Response format. Use \"image\" for native clients to receive binary PNG directly.
try {
    val result : DeviceCodeResponse = discovr.requestDeviceCode(deviceCodePayload, size, format)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#requestDeviceCode")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#requestDeviceCode")
    e.printStackTrace()
}
```

### Parameters
| **deviceCodePayload** | [**DeviceCodePayload**](DeviceCodePayload.md)|  | |
| **size** | **kotlin.Int**| QR code size in pixels. Larger sizes are recommended for TV displays. | [optional] [default to 300] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **format** | **kotlin.String**| Response format. Use \&quot;image\&quot; for native clients to receive binary PNG directly. | [optional] [default to Format.json] [enum: json, image] |

### Return type

[**DeviceCodeResponse**](DeviceCodeResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, image/png

<a id="scrobble"></a>
# **scrobble**
> ScrobbleResponse scrobble(mediaId, scrobbleProgressBody)

Record playback progress

Scrobbling is Discovr&#39;s single-call way to track playback. One call updates live resume progress, watch history, completion, and the watchlist.  Send the viewer&#39;s real position when playback starts (not &#x60;0&#x60; when resuming), about every 30 seconds while watching, and right away on pause, resume, seek, and completion. Discovr handles the rest:  - The title stays in Continue Watching until the movie or episode crosses 80%. - Once progress reaches 20% or more, the title is automatically removed from the watchlist — for both movies and TV shows. - Once progress reaches 80% or more, the movie or episode is marked watched and leaves Continue Watching. Lower progress later (such as a rewind) moves the live position without undoing completion — use &#x60;markUnwatched&#x60; to undo a watch. - For TV shows, include &#x60;season&#x60; and &#x60;episode&#x60; in &#x60;tv&#x60;. When an episode crosses 80%, the response includes &#x60;completedSeasons&#x60; listing every season now fully watched.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = TV_1396 // kotlin.String | The media ID in `MV_<number>` or `TV_<number>` format (e.g., `MV_550`, `TV_1396`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
val scrobbleProgressBody : ScrobbleProgressBody = {"progress":15.5,"tv":{"season":1,"episode":2}} // ScrobbleProgressBody | 
try {
    val result : ScrobbleResponse = discovr.scrobble(mediaId, scrobbleProgressBody)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#scrobble")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#scrobble")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The media ID in &#x60;MV_&lt;number&gt;&#x60; or &#x60;TV_&lt;number&gt;&#x60; format (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **scrobbleProgressBody** | [**ScrobbleProgressBody**](ScrobbleProgressBody.md)|  | |

### Return type

[**ScrobbleResponse**](ScrobbleResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="searchGifs"></a>
# **searchGifs**
> GifSearchResponse searchGifs(q, limit, pos, contentfilter, country, locale)

Search GIFs

Searches for animated GIFs by keyword. Use the &#x60;contentfilter&#x60; parameter to control content safety (&#x60;off&#x60;, &#x60;low&#x60;, &#x60;medium&#x60;, &#x60;high&#x60;); if you omit it, the filtering configured for Discovr&#39;s Klipy account applies, which is not a fixed level, so pass it explicitly when you need a guaranteed one. Results are paginated — pass &#x60;next&#x60; from the previous response as &#x60;pos&#x60; to load more.  Each result&#39;s &#x60;url&#x60; is the full-size file — an **MP4 whenever one is available**, otherwise a GIF or WebP. Read &#x60;media_type&#x60; (on the item and on &#x60;preview&#x60;) to pick a video player or an image view instead of guessing from the URL; it uses the same &#x60;AvatarMediaType&#x60; values as profiles. &#x60;preview&#x60; is a lighter file for grids, &#x60;still&#x60; is a JPEG still frame for Reduce Motion or static grids, and &#x60;placeholder&#x60; is a tiny blurred &#x60;data:&#x60; URI to show while the file loads. Save &#x60;url&#x60; for the one the user picks.  Klipy attribution is required wherever you show these results.  No authentication required. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = DiscovrApi()

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
    println("4xx response calling DiscovrApi#searchGifs")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#searchGifs")
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

<a id="searchMedia"></a>
# **searchMedia**
> SearchResponse searchMedia(query, q, page)

Search media

Searches across movies, TV shows, and people. Returns a ranked list of matches. Use the &#x60;query&#x60; (or &#x60;q&#x60;) parameter for the search term.  Results are ordered by relevance — preserve that order rather than re-sorting client-side.  This endpoint does not accept filters. To browse by genre, runtime, release window, or watch provider, create a page with &#x60;pageFilters&#x60; instead. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val query : kotlin.String = avatar // kotlin.String | Search term. Use `query` or `q` — if both are provided, `query` takes precedence. 
val q : kotlin.String = avatar // kotlin.String | Search term (shorthand for `query`). At least one of `query` or `q` is required. 
val page : kotlin.Int = 1 // kotlin.Int | Page of results to return, starting at 1. Check `has_more` on the response to decide whether to request the next page. 
try {
    val result : SearchResponse = discovr.searchMedia(query, q, page)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#searchMedia")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#searchMedia")
    e.printStackTrace()
}
```

### Parameters
| **query** | **kotlin.String**| Search term. Use &#x60;query&#x60; or &#x60;q&#x60; — if both are provided, &#x60;query&#x60; takes precedence.  | [optional] |
| **q** | **kotlin.String**| Search term (shorthand for &#x60;query&#x60;). At least one of &#x60;query&#x60; or &#x60;q&#x60; is required.  | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **page** | **kotlin.Int**| Page of results to return, starting at 1. Check &#x60;has_more&#x60; on the response to decide whether to request the next page.  | [optional] [default to 1] |

### Return type

[**SearchResponse**](SearchResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="setRating"></a>
# **setRating**
> TitleState setRating(mediaId, setRatingPayload)

Set a title&#39;s rating

Sets the active profile&#39;s rating for a title to &#x60;liked&#x60;, &#x60;disliked&#x60;, or &#x60;super_liked&#x60;.  Ratings are mutually exclusive: setting a new rating automatically replaces any previous one. Setting the rating the title already has is a safe no-op.  Returns the title&#39;s updated &#x60;TitleState&#x60;, so you can update your UI immediately without calling &#x60;getTitleState&#x60; again.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | The title's media ID (`MV_<id>` or `TV_<id>`), or an item `ref`. 
val setRatingPayload : SetRatingPayload = {"value":"liked"} // SetRatingPayload | 
try {
    val result : TitleState = discovr.setRating(mediaId, setRatingPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#setRating")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#setRating")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;), or an item &#x60;ref&#x60;.  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **setRatingPayload** | [**SetRatingPayload**](SetRatingPayload.md)|  | |

### Return type

[**TitleState**](TitleState.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="signOutSession"></a>
# **signOutSession**
> SignOutResponse signOutSession()

Sign out the current device

Signs out the current device by revoking the refresh token you send in the &#x60;Authorization&#x60; header. Other devices the user is signed into aren&#39;t affected — you can only sign out the current device from a third-party app.  Identity-tier calls using this token fail immediately after revocation. Any existing session tokens (valid for 30 minutes) remain usable until they naturally expire.  Works the same way for a demo session&#39;s refresh token — a demo sandbox is an ordinary account, so this is a quick way to end one early and test how your app handles it.  Using an SDK? Call &#x60;signOut()&#x60; instead — it wraps this endpoint and also clears the credentials stored on the device.  **Auth tier:** identity — send your refresh token in the &#x60;Authorization: Bearer&#x60; header. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

try {
    val result : SignOutResponse = discovr.signOutSession()
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#signOutSession")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#signOutSession")
    e.printStackTrace()
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**SignOutResponse**](SignOutResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="startDemoSession"></a>
# **startDemoSession**
> DemoSessionResponse startDemoSession(demoSessionRequest)

Start a demo session

Gives you a working Discovr account in one call — no sign-up, no credentials, nothing to configure. Use it while you build: to explore the API, prototype against realistic data, or try requests right here in the docs. It&#39;s a development tool, not something to put in front of your users.  You get a private sandbox pre-loaded with profiles, watchlists, and viewing history, so recommendation rows are populated from the very first request. It behaves like any other account: writes really do save, and reading them back returns what you&#39;d expect.  The response is a refresh token. From here you&#39;re on the normal path — call [&#x60;POST /auth/session-token&#x60;](/api-reference/discovr/mint-session-token) with a profile ID to start browsing. Nothing else about your integration changes, which is the point: code you write against a demo session works unchanged against a real one.  Two things to keep in mind: - **Sandboxes are temporary.** Yours lasts 30 minutes (you can ask for a shorter one with &#x60;ttlMs&#x60;, never a longer one) and everything in it is deleted afterwards. Once it has ended, requests made with its token fail with &#x60;401&#x60; &#x60;token-expired&#x60;. Don&#39;t build anything that expects it to still be there tomorrow. - **Sandboxes are rate limited.** You can start five per hour from the same network address, and that allowance is shared with the demo button on Discovr&#39;s sign-in screens and with a TV&#39;s device-code demo. When it runs out you get a &#x60;429&#x60; with a &#x60;Retry-After&#x60; header, so hold on to the token you&#39;re given rather than requesting a new one per request.  You do still need a &#x60;clientId&#x60; — the same one your SDK constructor already takes regardless of demo mode, so this asks nothing new of a real integration. Trying this endpoint directly from this page? Use &#x60;discovr-docs-playground&#x60;, a client id that&#39;s always available for exactly that.  It also powers the \&quot;Continue as Demo\&quot; button that Discovr&#39;s sign-in screens show to a client created with &#x60;demoMode&#x60;, which is meant for development builds.  **Auth tier:** none — this is the one endpoint you can call without a credential. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = DiscovrApi()

val demoSessionRequest : DemoSessionRequest =  // DemoSessionRequest | 
try {
    val result : DemoSessionResponse = discovr.startDemoSession(demoSessionRequest)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#startDemoSession")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#startDemoSession")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **demoSessionRequest** | [**DemoSessionRequest**](DemoSessionRequest.md)|  | |

### Return type

[**DemoSessionResponse**](DemoSessionResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="updateProfile"></a>
# **updateProfile**
> Profile updateProfile(profileId, updateProfilePayload)

Update a profile

Updates a profile&#39;s name, avatar URL, or both. Provide only the fields you want to change — omitted fields stay as-is.  Returns the updated profile object. Returns 404 if the profile doesn&#39;t exist or doesn&#39;t belong to the signed-in user. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = DiscovrApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val profileId : kotlin.String = profile_abc123xyz // kotlin.String | The ID of the profile to update.
val updateProfilePayload : UpdateProfilePayload = {"name":"Action Movie Fan","avatarUrl":"https://example.com/new-avatar.jpg"} // UpdateProfilePayload | 
try {
    val result : Profile = discovr.updateProfile(profileId, updateProfilePayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DiscovrApi#updateProfile")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DiscovrApi#updateProfile")
    e.printStackTrace()
}
```

### Parameters
| **profileId** | **kotlin.String**| The ID of the profile to update. | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **updateProfilePayload** | [**UpdateProfilePayload**](UpdateProfilePayload.md)|  | |

### Return type

[**Profile**](Profile.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

