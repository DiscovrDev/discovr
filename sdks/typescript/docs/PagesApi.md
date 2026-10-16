# PagesApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createPage**](PagesApi.md#createpage) | **POST** /pages | Create a recommendation page |
| [**getPage**](PagesApi.md#getpage) | **GET** /pages/{pageId} | Get a page |



## createPage

> CreatePageResponse createPage(createPagePayload)

Create a recommendation page

Resolves a set of filters to the page that represents them.  A page\&#39;s ID is determined by its filters alone, so the same filters always return the same ID — for every profile, on every device, indefinitely. Call this once and keep the ID.  Creating pages up front for your top-level tabs is cheap.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. 

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
  const result = await client.createPage(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **createPagePayload** | [CreatePagePayload](CreatePagePayload.md) |  | [Optional] |

### Return type

[**CreatePageResponse**](CreatePageResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Page created successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPage

> Page getPage(pageId)

Get a page

Returns a page and its metadata.  Page IDs are stable and permanent. The same ID keeps working across sessions, profiles and devices, so it\&#39;s safe in a URL, a bookmark or a deep link.  What changes is the content: recommendations refresh roughly every 30 minutes, and after they do this returns the same page with re-ranked rows. There\&#39;s nothing to handle — no error, no ID to swap.  **Auth tier:** session. 

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
  const result = await client.getPage(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **pageId** | `string` | The page to retrieve. Accepts either a page id or the &#x60;ref&#x60; from the navigation or provider tile you\&#39;re opening — both resolve to the same page.  | [Defaults to `undefined`] |

### Return type

[**Page**](Page.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Page retrieved successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

