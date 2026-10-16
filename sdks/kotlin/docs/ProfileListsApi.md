# ProfileListsApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**addDislikedItem**](ProfileListsApi.md#addDislikedItem) | **POST** /profile/disliked | Add an item to disliked list |
| [**addHistoryItem**](ProfileListsApi.md#addHistoryItem) | **POST** /profile/history | Add an item to history list |
| [**addLikedItem**](ProfileListsApi.md#addLikedItem) | **POST** /profile/liked | Add an item to liked list |
| [**addPlaybackItem**](ProfileListsApi.md#addPlaybackItem) | **POST** /profile/playback | Add an item to playback list |
| [**addSuperLikedItem**](ProfileListsApi.md#addSuperLikedItem) | **POST** /profile/super_liked | Add an item to the super-liked list |
| [**addWatchlistItem**](ProfileListsApi.md#addWatchlistItem) | **POST** /profile/watchlist | Add an item to watchlist |
| [**deleteDislikedItem**](ProfileListsApi.md#deleteDislikedItem) | **DELETE** /profile/disliked/{mediaId} | Delete an item from disliked list |
| [**deleteHistoryItem**](ProfileListsApi.md#deleteHistoryItem) | **DELETE** /profile/history/{mediaId} | Delete an item from history list |
| [**deleteLikedItem**](ProfileListsApi.md#deleteLikedItem) | **DELETE** /profile/liked/{mediaId} | Delete an item from liked list |
| [**deletePlaybackItem**](ProfileListsApi.md#deletePlaybackItem) | **DELETE** /profile/playback/{mediaId} | Delete an item from playback list |
| [**deleteSuperLikedItem**](ProfileListsApi.md#deleteSuperLikedItem) | **DELETE** /profile/super_liked/{mediaId} | Delete an item from the super-liked list |
| [**deleteWatchlistItem**](ProfileListsApi.md#deleteWatchlistItem) | **DELETE** /profile/watchlist/{mediaId} | Delete an item from watchlist |
| [**getDislikedItems**](ProfileListsApi.md#getDislikedItems) | **GET** /profile/disliked | Get disliked items |
| [**getHistoryItems**](ProfileListsApi.md#getHistoryItems) | **GET** /profile/history | Get history items |
| [**getHistoryItemsByMediaId**](ProfileListsApi.md#getHistoryItemsByMediaId) | **GET** /profile/history/{mediaId} | Get history items for a specific media |
| [**getLikedItems**](ProfileListsApi.md#getLikedItems) | **GET** /profile/liked | Get liked items |
| [**getPlaybackItems**](ProfileListsApi.md#getPlaybackItems) | **GET** /profile/playback | Get playback items |
| [**getSuperLikedItems**](ProfileListsApi.md#getSuperLikedItems) | **GET** /profile/super_liked | Get super-liked items |
| [**getWatchlistItems**](ProfileListsApi.md#getWatchlistItems) | **GET** /profile/watchlist | Get watchlist items |
| [**patchHistoryItem**](ProfileListsApi.md#patchHistoryItem) | **PATCH** /profile/history/{mediaId} | Update or create a history item |
| [**updatePlaybackItem**](ProfileListsApi.md#updatePlaybackItem) | **PATCH** /profile/playback | Update playback progress |


<a id="addDislikedItem"></a>
# **addDislikedItem**
> SuccessMessage addDislikedItem(addSimpleListItemPayload)

Add an item to disliked list

Adds a title to the disliked list.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Liked, disliked, and super-liked are exclusive — disliking something automatically removes any existing like or super-like for the same title.  Returns &#x60;201&#x60; if the item was newly added, &#x60;200&#x60; if it was already disliked. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val addSimpleListItemPayload : AddSimpleListItemPayload = {mediaId=MV_550} // AddSimpleListItemPayload | 
try {
    val result : SuccessMessage = discovr.addDislikedItem(addSimpleListItemPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#addDislikedItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#addDislikedItem")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **addSimpleListItemPayload** | [**AddSimpleListItemPayload**](AddSimpleListItemPayload.md)|  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="addHistoryItem"></a>
# **addHistoryItem**
> SuccessMessage addHistoryItem(addHistoryPayload)

Add an item to history list

Records a watch history entry. Unlike other lists, history allows multiple entries for the same title — each completed viewing is tracked separately.  - &#x60;mediaId&#x60;: the title to record. Use &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows. - &#x60;progress&#x60;: how far through the title the user watched, as a percentage (0–100). Optional. - &#x60;updatedAt&#x60;: the ISO 8601 timestamp of when the viewing was recorded. Defaults to now if omitted.  **TV Shows:** Include &#x60;season&#x60; (required for TV shows) and optionally &#x60;episode&#x60; to track per-episode history. Omitting &#x60;episode&#x60; records a season-level entry — clients can use this to mark all episodes in a season as watched in a single call. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val addHistoryPayload : AddHistoryPayload = {"mediaId":"TV_1396","updatedAt":"2023-01-15T20:00:00.000Z","progress":100,"season":1,"episode":5} // AddHistoryPayload | 
try {
    val result : SuccessMessage = discovr.addHistoryItem(addHistoryPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#addHistoryItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#addHistoryItem")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **addHistoryPayload** | [**AddHistoryPayload**](AddHistoryPayload.md)|  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="addLikedItem"></a>
# **addLikedItem**
> SuccessMessage addLikedItem(addSimpleListItemPayload)

Add an item to liked list

Adds a title to the liked list.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Liked, disliked, and super-liked are exclusive — liking something automatically removes any existing dislike or super-like for the same title.  Returns &#x60;201&#x60; if the item was newly added, &#x60;200&#x60; if it was already liked. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val addSimpleListItemPayload : AddSimpleListItemPayload = {"mediaId":"MV_550"} // AddSimpleListItemPayload | 
try {
    val result : SuccessMessage = discovr.addLikedItem(addSimpleListItemPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#addLikedItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#addLikedItem")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **addSimpleListItemPayload** | [**AddSimpleListItemPayload**](AddSimpleListItemPayload.md)|  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="addPlaybackItem"></a>
# **addPlaybackItem**
> SuccessMessage addPlaybackItem(addPlaybackPayload)

Add an item to playback list

Records a new playback position for a title. If the title is already being tracked, returns 409 — use PATCH to update an existing entry.  - &#x60;mediaId&#x60;: the title to track. Use &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;). - &#x60;progress&#x60;: how far through the title the user is, as a percentage (0–100). Optional — omit if you don&#39;t have a position yet. - &#x60;updatedAt&#x60;: the ISO 8601 timestamp of when this progress was recorded. Defaults to now. Send the actual client time so resume positions stay accurate if the user is offline. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val addPlaybackPayload : AddPlaybackPayload = {"mediaId":"MV_550","progress":25,"updatedAt":"2023-01-15T10:30:00.000Z"} // AddPlaybackPayload | 
try {
    val result : SuccessMessage = discovr.addPlaybackItem(addPlaybackPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#addPlaybackItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#addPlaybackItem")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **addPlaybackPayload** | [**AddPlaybackPayload**](AddPlaybackPayload.md)|  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="addSuperLikedItem"></a>
# **addSuperLikedItem**
> SuccessMessage addSuperLikedItem(addSimpleListItemPayload)

Add an item to the super-liked list

Adds a title to the super-liked list.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Super-liking a title says the viewer loves it. Like the liked list, adding a super-like automatically removes any existing dislike or like for the same title.  Returns &#x60;201&#x60; if the item was newly added, &#x60;200&#x60; if it was already super-liked. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val addSimpleListItemPayload : AddSimpleListItemPayload = {mediaId=MV_550} // AddSimpleListItemPayload | 
try {
    val result : SuccessMessage = discovr.addSuperLikedItem(addSimpleListItemPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#addSuperLikedItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#addSuperLikedItem")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **addSimpleListItemPayload** | [**AddSimpleListItemPayload**](AddSimpleListItemPayload.md)|  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="addWatchlistItem"></a>
# **addWatchlistItem**
> SuccessMessage addWatchlistItem(addSimpleListItemPayload)

Add an item to watchlist

Adds a title to the watchlist.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Unlike liked/disliked/super-liked, the watchlist is non-exclusive — you can watchlist something regardless of how it&#39;s rated. Titles are automatically removed from the watchlist when the user starts watching via &#x60;scrobble&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val addSimpleListItemPayload : AddSimpleListItemPayload = {mediaId=MV_550} // AddSimpleListItemPayload | 
try {
    val result : SuccessMessage = discovr.addWatchlistItem(addSimpleListItemPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#addWatchlistItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#addWatchlistItem")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **addSimpleListItemPayload** | [**AddSimpleListItemPayload**](AddSimpleListItemPayload.md)|  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="deleteDislikedItem"></a>
# **deleteDislikedItem**
> SuccessMessage deleteDislikedItem(mediaId)

Delete an item from disliked list

Removes a title from the disliked list. Pass the full media ID (e.g., &#x60;MV_550&#x60; for a movie, &#x60;TV_1396&#x60; for a TV show). 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | Full media ID — `MV_<number>` for movies, `TV_<number>` for TV shows (e.g., `MV_550`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
try {
    val result : SuccessMessage = discovr.deleteDislikedItem(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#deleteDislikedItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#deleteDislikedItem")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String**| Full media ID — &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="deleteHistoryItem"></a>
# **deleteHistoryItem**
> SuccessMessage deleteHistoryItem(mediaId, season, episode)

Delete an item from history list

Deletes history entries for a title. Because history allows duplicates, this removes all matching entries for the specified media (and episode, if provided).  For TV shows, pass &#x60;season&#x60; as a query parameter (required) and optionally &#x60;episode&#x60;. Include &#x60;episode&#x60; to delete that episode&#39;s entries. Omit it to delete the entries that were recorded for the season as a whole, without an episode (for example, marking a season watched in one go); entries for individual episodes are kept.  To take a title back to unwatched, use [&#x60;DELETE /profile/watched/{mediaId}&#x60;](/api-reference/discovr/mark-unwatched) instead. This call removes history entries and nothing else: it doesn&#39;t touch the in-progress list, and a TV show&#39;s &#x60;completed&#x60; state is brought up to date from whatever history is left. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = TV_1396 // kotlin.String | The media ID of the title to delete. Format: `MV_<number>` for movies, `TV_<number>` for TV shows.  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
val season : kotlin.Int = 1 // kotlin.Int | Season number. Required for TV shows (`TV_` mediaId); ignored for movies.
val episode : kotlin.Int = 5 // kotlin.Int | Episode number. Optional — omit to delete the season-level entries (those recorded without an episode); include to delete a specific episode's entries only.
try {
    val result : SuccessMessage = discovr.deleteHistoryItem(mediaId, season, episode)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#deleteHistoryItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#deleteHistoryItem")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The media ID of the title to delete. Format: &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows.  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |
| **season** | **kotlin.Int**| Season number. Required for TV shows (&#x60;TV_&#x60; mediaId); ignored for movies. | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **episode** | **kotlin.Int**| Episode number. Optional — omit to delete the season-level entries (those recorded without an episode); include to delete a specific episode&#39;s entries only. | [optional] |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="deleteLikedItem"></a>
# **deleteLikedItem**
> SuccessMessage deleteLikedItem(mediaId)

Delete an item from liked list

Removes a title from the liked list. Pass the full media ID (e.g., &#x60;MV_550&#x60; for a movie, &#x60;TV_1396&#x60; for a TV show). 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | Full media ID — `MV_<number>` for movies, `TV_<number>` for TV shows (e.g., `MV_550`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
try {
    val result : SuccessMessage = discovr.deleteLikedItem(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#deleteLikedItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#deleteLikedItem")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String**| Full media ID — &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="deletePlaybackItem"></a>
# **deletePlaybackItem**
> SuccessMessage deletePlaybackItem(mediaId)

Delete an item from playback list

Removes a title from the in-progress list. Use &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;). 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | The media ID of the title to remove. Format: `MV_<number>` for movies, `TV_<number>` for TV shows.  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
try {
    val result : SuccessMessage = discovr.deletePlaybackItem(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#deletePlaybackItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#deletePlaybackItem")
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

<a id="deleteSuperLikedItem"></a>
# **deleteSuperLikedItem**
> SuccessMessage deleteSuperLikedItem(mediaId)

Delete an item from the super-liked list

Removes a title from the super-liked list. Pass the full media ID (e.g., &#x60;MV_550&#x60; for a movie, &#x60;TV_1396&#x60; for a TV show). 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | Full media ID — `MV_<number>` for movies, `TV_<number>` for TV shows (e.g., `MV_550`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
try {
    val result : SuccessMessage = discovr.deleteSuperLikedItem(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#deleteSuperLikedItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#deleteSuperLikedItem")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String**| Full media ID — &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="deleteWatchlistItem"></a>
# **deleteWatchlistItem**
> SuccessMessage deleteWatchlistItem(mediaId)

Delete an item from watchlist

Removes a title from the watchlist. Pass the full media ID (e.g., &#x60;MV_550&#x60; for a movie, &#x60;TV_1396&#x60; for a TV show). 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = MV_550 // kotlin.String | Full media ID — `MV_<number>` for movies, `TV_<number>` for TV shows (e.g., `MV_550`).  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
try {
    val result : SuccessMessage = discovr.deleteWatchlistItem(mediaId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#deleteWatchlistItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#deleteWatchlistItem")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String**| Full media ID — &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getDislikedItems"></a>
# **getDislikedItems**
> SimpleListResponse getDislikedItems(nextPageToken, limit)

Get disliked items

Returns the disliked list for a specific profile.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Items are ordered newest-first and support cursor-based pagination via &#x60;nextPageToken&#x60;.  **Pagination:** - Pass &#x60;nextPageToken&#x60; from a previous response to fetch the next page. - If &#x60;hasMore&#x60; is &#x60;true&#x60;, there are more items available.  **Exclusive lists:** Liked, disliked, and super-liked are mutually exclusive — a title can only be in one of those lists at a time. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val nextPageToken : kotlin.String = nextPageToken_example // kotlin.String | Opaque token from previous page for pagination
val limit : kotlin.Int = 56 // kotlin.Int | Maximum number of items to return (1-50, default: 10)
try {
    val result : SimpleListResponse = discovr.getDislikedItems(nextPageToken, limit)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#getDislikedItems")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#getDislikedItems")
    e.printStackTrace()
}
```

### Parameters
| **nextPageToken** | **kotlin.String**| Opaque token from previous page for pagination | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **limit** | **kotlin.Int**| Maximum number of items to return (1-50, default: 10) | [optional] [default to 10] |

### Return type

[**SimpleListResponse**](SimpleListResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getHistoryItems"></a>
# **getHistoryItems**
> HistoryListResponse getHistoryItems(nextPageToken, limit)

Get history items

Returns the profile&#39;s full watch history, newest entries first.  History allows multiple entries for the same title — every completed viewing is tracked separately, so you may see the same &#x60;mediaId&#x60; more than once.  **Pagination:** Pass &#x60;nextPageToken&#x60; from the previous response to fetch the next page. If &#x60;hasMore&#x60; is &#x60;true&#x60;, more items are available. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val nextPageToken : kotlin.String = nextPageToken_example // kotlin.String | Opaque token from previous page for pagination
val limit : kotlin.Int = 56 // kotlin.Int | Maximum number of items to return (1-50, default: 10)
try {
    val result : HistoryListResponse = discovr.getHistoryItems(nextPageToken, limit)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#getHistoryItems")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#getHistoryItems")
    e.printStackTrace()
}
```

### Parameters
| **nextPageToken** | **kotlin.String**| Opaque token from previous page for pagination | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **limit** | **kotlin.Int**| Maximum number of items to return (1-50, default: 10) | [optional] [default to 10] |

### Return type

[**HistoryListResponse**](HistoryListResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getHistoryItemsByMediaId"></a>
# **getHistoryItemsByMediaId**
> HistoryListResponse getHistoryItemsByMediaId(mediaId, season, episode, nextPageToken, limit)

Get history items for a specific media

Returns history entries for a specific title. Newest entries first.  For TV shows, pass &#x60;season&#x60; as a query parameter (required) and optionally &#x60;episode&#x60; to filter by episode. Omitting &#x60;episode&#x60; returns all entries for the whole season.  **Pagination:** Pass &#x60;nextPageToken&#x60; from the previous response to fetch the next page. If &#x60;hasMore&#x60; is &#x60;true&#x60;, more items are available. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = TV_1396 // kotlin.String | The media ID of the title. Format: `MV_<number>` for movies, `TV_<number>` for TV shows.  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
val season : kotlin.Int = 1 // kotlin.Int | Season number. Required for TV shows (`TV_` mediaId); ignored for movies.
val episode : kotlin.Int = 5 // kotlin.Int | Episode number. Optional — omit to return all entries for the season; include to filter to a specific episode.
val nextPageToken : kotlin.String = nextPageToken_example // kotlin.String | Opaque token from previous page for pagination
val limit : kotlin.Int = 56 // kotlin.Int | Maximum number of items to return (1-50, default: 10)
try {
    val result : HistoryListResponse = discovr.getHistoryItemsByMediaId(mediaId, season, episode, nextPageToken, limit)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#getHistoryItemsByMediaId")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#getHistoryItemsByMediaId")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The media ID of the title. Format: &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows.  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |
| **season** | **kotlin.Int**| Season number. Required for TV shows (&#x60;TV_&#x60; mediaId); ignored for movies. | [optional] |
| **episode** | **kotlin.Int**| Episode number. Optional — omit to return all entries for the season; include to filter to a specific episode. | [optional] |
| **nextPageToken** | **kotlin.String**| Opaque token from previous page for pagination | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **limit** | **kotlin.Int**| Maximum number of items to return (1-50, default: 10) | [optional] [default to 10] |

### Return type

[**HistoryListResponse**](HistoryListResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getLikedItems"></a>
# **getLikedItems**
> SimpleListResponse getLikedItems(nextPageToken, limit)

Get liked items

Returns the liked list for a specific profile.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Items are ordered newest-first and support cursor-based pagination via &#x60;nextPageToken&#x60;.  **Pagination:** - Pass &#x60;nextPageToken&#x60; from a previous response to fetch the next page. - If &#x60;hasMore&#x60; is &#x60;true&#x60;, there are more items available.  **Exclusive lists:** Liked, disliked, and super-liked are mutually exclusive — a title can only be in one of those lists at a time. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val nextPageToken : kotlin.String = nextPageToken_example // kotlin.String | Opaque token from previous page for pagination
val limit : kotlin.Int = 56 // kotlin.Int | Maximum number of items to return (1-50, default: 10)
try {
    val result : SimpleListResponse = discovr.getLikedItems(nextPageToken, limit)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#getLikedItems")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#getLikedItems")
    e.printStackTrace()
}
```

### Parameters
| **nextPageToken** | **kotlin.String**| Opaque token from previous page for pagination | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **limit** | **kotlin.Int**| Maximum number of items to return (1-50, default: 10) | [optional] [default to 10] |

### Return type

[**SimpleListResponse**](SimpleListResponse.md)

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

Returns the profile&#39;s in-progress titles — everything with a saved playback position. Ordered by most recently updated. Use this to build a \&quot;Continue Watching\&quot; row.  Each item includes a &#x60;progress&#x60; field (0–100) showing how far through the title the user is.  **Pagination:** Pass &#x60;nextPageToken&#x60; from the previous response to fetch the next page. If &#x60;hasMore&#x60; is &#x60;true&#x60;, more items are available. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val nextPageToken : kotlin.String = nextPageToken_example // kotlin.String | Opaque token from previous page for pagination
val limit : kotlin.Int = 56 // kotlin.Int | Maximum number of items to return (1-50, default: 10)
try {
    val result : PlaybackListResponse = discovr.getPlaybackItems(nextPageToken, limit)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#getPlaybackItems")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#getPlaybackItems")
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

<a id="getSuperLikedItems"></a>
# **getSuperLikedItems**
> SimpleListResponse getSuperLikedItems(nextPageToken, limit)

Get super-liked items

Returns the super-liked list for a specific profile.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Items are ordered newest-first and support cursor-based pagination via &#x60;nextPageToken&#x60;.  **Pagination:** - Pass &#x60;nextPageToken&#x60; from a previous response to fetch the next page. - If &#x60;hasMore&#x60; is &#x60;true&#x60;, there are more items available.  **Exclusive lists:** Liked, disliked, and super-liked are mutually exclusive — a title can only be in one of those lists at a time. Super-liked titles are the ones the viewer loves most. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val nextPageToken : kotlin.String = nextPageToken_example // kotlin.String | Opaque token from previous page for pagination
val limit : kotlin.Int = 56 // kotlin.Int | Maximum number of items to return (1-50, default: 10)
try {
    val result : SimpleListResponse = discovr.getSuperLikedItems(nextPageToken, limit)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#getSuperLikedItems")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#getSuperLikedItems")
    e.printStackTrace()
}
```

### Parameters
| **nextPageToken** | **kotlin.String**| Opaque token from previous page for pagination | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **limit** | **kotlin.Int**| Maximum number of items to return (1-50, default: 10) | [optional] [default to 10] |

### Return type

[**SimpleListResponse**](SimpleListResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getWatchlistItems"></a>
# **getWatchlistItems**
> SimpleListResponse getWatchlistItems(nextPageToken, limit)

Get watchlist items

Returns the profile&#39;s watchlist — titles saved to watch later.  **Auth tier:** session — send the session token from &#x60;POST /auth/session-token&#x60;.  Ordered by when they were added (newest first). Supports cursor-based pagination via &#x60;nextPageToken&#x60;.  **Pagination:** - Pass &#x60;nextPageToken&#x60; from a previous response to fetch the next page. - If &#x60;hasMore&#x60; is &#x60;true&#x60;, there are more items available. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val nextPageToken : kotlin.String = nextPageToken_example // kotlin.String | Opaque token from previous page for pagination
val limit : kotlin.Int = 56 // kotlin.Int | Maximum number of items to return (1-50, default: 10)
try {
    val result : SimpleListResponse = discovr.getWatchlistItems(nextPageToken, limit)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#getWatchlistItems")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#getWatchlistItems")
    e.printStackTrace()
}
```

### Parameters
| **nextPageToken** | **kotlin.String**| Opaque token from previous page for pagination | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **limit** | **kotlin.Int**| Maximum number of items to return (1-50, default: 10) | [optional] [default to 10] |

### Return type

[**SimpleListResponse**](SimpleListResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="patchHistoryItem"></a>
# **patchHistoryItem**
> SuccessMessage patchHistoryItem(mediaId, patchHistoryPayload, season, episode)

Update or create a history item

Updates the history entry for a title. If no entry exists, creates one (upsert). This ensures only one entry exists per &#x60;mediaId&#x60; + &#x60;season&#x60; + &#x60;episode&#x60; combination.  For TV shows, &#x60;season&#x60; is required as a query parameter. Include &#x60;episode&#x60; to target a specific episode; omit it to update the season-level entry.  - &#x60;progress&#x60;: how far through the title the user watched, as a percentage (0–100). 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mediaId : kotlin.String = TV_1396 // kotlin.String | The media ID of the title. Format: `MV_<number>` for movies, `TV_<number>` for TV shows.  Also accepts an item's `ref` in place of the id. Prefer the `ref` when you have one — it resolves to the same title and sharpens the user's recommendations. 
val patchHistoryPayload : PatchHistoryPayload = {"progress":0} // PatchHistoryPayload | 
val season : kotlin.Int = 1 // kotlin.Int | Season number. Required for TV shows (`TV_` mediaId); ignored for movies.
val episode : kotlin.Int = 5 // kotlin.Int | Episode number. Optional — omit to update the season-level entry; include to target a specific episode.
try {
    val result : SuccessMessage = discovr.patchHistoryItem(mediaId, patchHistoryPayload, season, episode)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#patchHistoryItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#patchHistoryItem")
    e.printStackTrace()
}
```

### Parameters
| **mediaId** | **kotlin.String**| The media ID of the title. Format: &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows.  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | |
| **patchHistoryPayload** | [**PatchHistoryPayload**](PatchHistoryPayload.md)|  | |
| **season** | **kotlin.Int**| Season number. Required for TV shows (&#x60;TV_&#x60; mediaId); ignored for movies. | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **episode** | **kotlin.Int**| Episode number. Optional — omit to update the season-level entry; include to target a specific episode. | [optional] |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="updatePlaybackItem"></a>
# **updatePlaybackItem**
> SuccessMessage updatePlaybackItem(editPlaybackPayload)

Update playback progress

Updates the playback position for an existing entry. Same fields as the add endpoint. If no entry exists for the &#x60;mediaId&#x60;, one is created. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfileListsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val editPlaybackPayload : EditPlaybackPayload = {"mediaId":"MV_550","progress":75,"updatedAt":"2023-01-20T14:00:00.000Z"} // EditPlaybackPayload | 
try {
    val result : SuccessMessage = discovr.updatePlaybackItem(editPlaybackPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfileListsApi#updatePlaybackItem")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfileListsApi#updatePlaybackItem")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **editPlaybackPayload** | [**EditPlaybackPayload**](EditPlaybackPayload.md)|  | |

### Return type

[**SuccessMessage**](SuccessMessage.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

