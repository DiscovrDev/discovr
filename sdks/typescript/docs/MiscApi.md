# MiscApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getProfileImages**](MiscApi.md#getprofileimages) | **GET** /profile-images | List avatar images |
| [**searchGifs**](MiscApi.md#searchgifs) | **GET** /gif-search | Search GIFs |



## getProfileImages

> ProfileImagesResponse getProfileImages(limit, pageToken)

List avatar images

Returns publicly available avatar images for use in profile setup. Paginated — pass &#x60;nextToken&#x60; from the previous response as &#x60;pageToken&#x60; to load more. These are curated still images.  No authentication required. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  const result = await client.getProfileImages(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` | Maximum number of images to return (1–50). | [Optional] [Defaults to `16`] |
| **pageToken** | `string` | Pagination cursor from the &#x60;nextToken&#x60; field of the previous response. Omit to start from the beginning. | [Optional] [Defaults to `undefined`] |

### Return type

[**ProfileImagesResponse**](ProfileImagesResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Avatar images returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## searchGifs

> GifSearchResponse searchGifs(q, limit, pos, contentfilter, country, locale)

Search GIFs

Searches for animated GIFs by keyword. Use the &#x60;contentfilter&#x60; parameter to control content safety (&#x60;off&#x60;, &#x60;low&#x60;, &#x60;medium&#x60;, &#x60;high&#x60;); if you omit it, the filtering configured for Discovr\&#39;s Klipy account applies, which is not a fixed level, so pass it explicitly when you need a guaranteed one. Results are paginated — pass &#x60;next&#x60; from the previous response as &#x60;pos&#x60; to load more.  Each result\&#39;s &#x60;url&#x60; is the full-size file and is an **MP4 whenever one is available**, otherwise a GIF, so render it with a video player or an image view according to its file extension (see &#x60;avatarMediaType&#x60; on profiles). &#x60;preview.url&#x60; is a lighter version for grids; use it for thumbnails and save &#x60;url&#x60; only for the one the user picks.  Klipy attribution is required wherever you show these results.  No authentication required. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  const result = await client.searchGifs(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **q** | `string` | Search term. | [Defaults to `undefined`] |
| **limit** | `number` | Maximum number of results to return (1–50). | [Optional] [Defaults to `20`] |
| **pos** | `string` | Pagination cursor from the &#x60;next&#x60; field of the previous response. Omit to start from the beginning. | [Optional] [Defaults to `undefined`] |
| **contentfilter** | `high`, `medium`, `low`, `off` | Content safety level. &#x60;high&#x60; is the most restrictive; &#x60;off&#x60; applies no filtering. Omit it and Discovr\&#39;s default filtering applies, not a fixed level. | [Optional] [Defaults to `undefined`] [Enum: high, medium, low, off] |
| **country** | `string` | ISO 3166-1 alpha-2 country code for regional content preferences (e.g., &#x60;US&#x60;). Takes precedence over &#x60;locale&#x60;. | [Optional] [Defaults to `undefined`] |
| **locale** | `string` | Only its region part is used (&#x60;en_US&#x60; is treated as &#x60;US&#x60;), and only when &#x60;country&#x60; is not sent. | [Optional] [Defaults to `undefined`] |

### Return type

[**GifSearchResponse**](GifSearchResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | GIF results returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

