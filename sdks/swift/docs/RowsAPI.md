# RowsAPI

All URIs are relative to *https://api.discovr.media*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getRow**](RowsAPI.md#getrow) | **GET** /pages/{pageId}/rows/{rowId} | Get a row
[**getRowItems**](RowsAPI.md#getrowitems) | **GET** /pages/{pageId}/rows/{rowId}/items | List row items
[**getRows**](RowsAPI.md#getrows) | **GET** /pages/{pageId}/rows | List rows


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

