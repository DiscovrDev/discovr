# MiscAPI

All URIs are relative to *https://api.discovr.media*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getProfileImages**](MiscAPI.md#getprofileimages) | **GET** /profile-images | List avatar images
[**searchGifs**](MiscAPI.md#searchgifs) | **GET** /gif-search | Search GIFs


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

MiscAPI.getProfileImages(limit: limit, pageToken: pageToken) { response, error in
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

MiscAPI.searchGifs(q: q, limit: limit, pos: pos, contentfilter: contentfilter, country: country, locale: locale) { response, error in
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

