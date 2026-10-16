# SearchApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**searchMedia**](SearchApi.md#searchmedia) | **GET** /search | Search media |



## searchMedia

> SearchResponse searchMedia(query, q, page)

Search media

Searches across movies, TV shows, and people. Returns a ranked list of matches. Use the &#x60;query&#x60; (or &#x60;q&#x60;) parameter for the search term.  Results are ordered by relevance — preserve that order rather than re-sorting client-side.  This endpoint does not accept filters. To browse by genre, runtime, release window, or watch provider, create a page with &#x60;pageFilters&#x60; instead. 

### Example

```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  // After sign-in and profile selection …
  const result = await client.searchMedia(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **query** | `string` | Search term. Use &#x60;query&#x60; or &#x60;q&#x60; — if both are provided, &#x60;query&#x60; takes precedence.  | [Optional] [Defaults to `undefined`] |
| **q** | `string` | Search term (shorthand for &#x60;query&#x60;). At least one of &#x60;query&#x60; or &#x60;q&#x60; is required.  | [Optional] [Defaults to `undefined`] |
| **page** | `number` | Page of results to return, starting at 1. Check &#x60;has_more&#x60; on the response to decide whether to request the next page.  | [Optional] [Defaults to `1`] |

### Return type

[**SearchResponse**](SearchResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Search results returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

