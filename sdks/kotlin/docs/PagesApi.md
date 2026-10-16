# PagesApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**createPage**](PagesApi.md#createPage) | **POST** /pages | Create a recommendation page |
| [**getPage**](PagesApi.md#getPage) | **GET** /pages/{pageId} | Get a page |


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
// Or manually: val discovr = PagesApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val createPagePayload : CreatePagePayload =  // CreatePagePayload | 
try {
    val result : CreatePageResponse = discovr.createPage(createPagePayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling PagesApi#createPage")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling PagesApi#createPage")
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
// Or manually: val discovr = PagesApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val pageId : kotlin.String = pageId_example // kotlin.String | The page to retrieve. Accepts either a page id or the `ref` from the navigation or provider tile you're opening — both resolve to the same page. 
try {
    val result : Page = discovr.getPage(pageId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling PagesApi#getPage")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling PagesApi#getPage")
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

