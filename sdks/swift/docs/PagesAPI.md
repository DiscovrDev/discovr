# PagesAPI

All URIs are relative to *https://api.discovr.media*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createPage**](PagesAPI.md#createpage) | **POST** /pages | Create a recommendation page
[**getPage**](PagesAPI.md#getpage) | **GET** /pages/{pageId} | Get a page


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

