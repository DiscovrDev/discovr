# RowsApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**getRow**](RowsApi.md#getRow) | **GET** /pages/{pageId}/rows/{rowId} | Get a row |
| [**getRowItems**](RowsApi.md#getRowItems) | **GET** /pages/{pageId}/rows/{rowId}/items | List row items |
| [**getRows**](RowsApi.md#getRows) | **GET** /pages/{pageId}/rows | List rows |


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
// Or manually: val discovr = RowsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val pageId : kotlin.String = pageId_example // kotlin.String | The unique identifier of the page
val rowId : kotlin.String = rowId_example // kotlin.String | The unique identifier of the row
try {
    val result : Row = discovr.getRow(pageId, rowId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling RowsApi#getRow")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling RowsApi#getRow")
    e.printStackTrace()
}
```

### Parameters
| **pageId** | **kotlin.String**| The unique identifier of the page | |
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
// Or manually: val discovr = RowsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val pageId : kotlin.String = pageId_example // kotlin.String | The unique identifier of the page
val rowId : kotlin.String = rowId_example // kotlin.String | The unique identifier of the row
val nextPageToken : kotlin.String = nextPageToken_example // kotlin.String | Opaque pagination token returned from the previous page
val limit : kotlin.Int = 56 // kotlin.Int | Maximum number of items to return
try {
    val result : GetRowItemsResponse = discovr.getRowItems(pageId, rowId, nextPageToken, limit)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling RowsApi#getRowItems")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling RowsApi#getRowItems")
    e.printStackTrace()
}
```

### Parameters
| **pageId** | **kotlin.String**| The unique identifier of the page | |
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

Returns paginated rows for a page. Each row is a labeled group of media titles — the building blocks of your recommendation UI.  Row IDs are opaque references — pass them straight back to &#x60;GET /pages/{pageId}/rows/{rowId}/items&#x60;. They keep working even if recommendations refresh while the user is scrolling, so a rail they&#39;ve already opened stays readable to the end.  Pagination continues in the set of results it started with, and only for as long as the user&#39;s recommendations haven&#39;t turned over. After a turnover (or, rarely, once the set has been cleaned up) the token is refused with &#x60;409 CURSOR_EXPIRED&#x60;: call &#x60;getPage&#x60; and &#x60;getRows&#x60; with no token on the same page ID and replace what you&#39;re showing with the result. Rows you already hold are not affected: &#x60;GET /pages/{pageId}/rows/{rowId}/items&#x60; keeps working for them.  **Auth tier:** session. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = RowsApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val pageId : kotlin.String = pageId_example // kotlin.String | The unique identifier of the page
val nextPageToken : kotlin.String = nextPageToken_example // kotlin.String | Opaque pagination token returned from the previous page
val limit : kotlin.Int = 56 // kotlin.Int | Maximum number of rows to return
try {
    val result : GetRowsResponse = discovr.getRows(pageId, nextPageToken, limit)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling RowsApi#getRows")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling RowsApi#getRows")
    e.printStackTrace()
}
```

### Parameters
| **pageId** | **kotlin.String**| The unique identifier of the page | |
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

