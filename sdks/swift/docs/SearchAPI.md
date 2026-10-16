# SearchAPI

All URIs are relative to *https://api.discovr.media*

Method | HTTP request | Description
------------- | ------------- | -------------
[**searchMedia**](SearchAPI.md#searchmedia) | **GET** /search | Search media


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

