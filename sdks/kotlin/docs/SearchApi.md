# SearchApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**searchMedia**](SearchApi.md#searchMedia) | **GET** /search | Search media |


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
// Or manually: val discovr = SearchApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val query : kotlin.String = avatar // kotlin.String | Search term. Use `query` or `q` — if both are provided, `query` takes precedence. 
val q : kotlin.String = avatar // kotlin.String | Search term (shorthand for `query`). At least one of `query` or `q` is required. 
val page : kotlin.Int = 1 // kotlin.Int | Page of results to return, starting at 1. Check `has_more` on the response to decide whether to request the next page. 
try {
    val result : SearchResponse = discovr.searchMedia(query, q, page)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling SearchApi#searchMedia")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling SearchApi#searchMedia")
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

