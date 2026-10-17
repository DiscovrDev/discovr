# RowsApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getRow**](RowsApi.md#getrow) | **GET** /pages/{pageId}/rows/{rowId} | Get a row |
| [**getRowItems**](RowsApi.md#getrowitems) | **GET** /pages/{pageId}/rows/{rowId}/items | List row items |
| [**getRows**](RowsApi.md#getrows) | **GET** /pages/{pageId}/rows | List rows |



## getRow

> Row getRow(pageId, rowId)

Get a row

Returns metadata for a specific row.  A row ID keeps resolving after recommendations refresh, so a rail the user has already opened stays usable. It\&#39;s only readable by the profile it was built for.  **Auth tier:** session. 

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
  const result = await client.getRow(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **pageId** | `string` | The unique identifier of the page | [Defaults to `undefined`] |
| **rowId** | `string` | The unique identifier of the row | [Defaults to `undefined`] |

### Return type

[**Row**](Row.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Row retrieved successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **409** | Your pagination cursor or row reference points at a set of results that has since been replaced. The page itself is fine and its ID is still valid. For rows this is what a recommendation turnover looks like: call &#x60;getPage&#x60; and &#x60;getRows&#x60; with no token and replace what you\&#39;re showing, rather than merging the result into the old list. For a row\&#39;s items it means the set was cleaned up; start that row\&#39;s pagination again from the beginning.  |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getRowItems

> GetRowItemsResponse getRowItems(pageId, rowId, nextPageToken, limit)

List row items

Returns paginated items within a row. Items include the full display metadata needed to render a media card — title, poster, backdrop, type, and more.  Row IDs stay valid across a recommendations refresh, so a user can finish scrolling a rail they\&#39;ve already opened.  **Auth tier:** session. 

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
  const result = await client.getRowItems(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **pageId** | `string` | The unique identifier of the page | [Defaults to `undefined`] |
| **rowId** | `string` | The unique identifier of the row | [Defaults to `undefined`] |
| **nextPageToken** | `string` | Opaque pagination token returned from the previous page | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | Maximum number of items to return | [Optional] [Defaults to `10`] |

### Return type

[**GetRowItemsResponse**](GetRowItemsResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of row items retrieved successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **409** | Your pagination cursor or row reference points at a set of results that has since been replaced. The page itself is fine and its ID is still valid. For rows this is what a recommendation turnover looks like: call &#x60;getPage&#x60; and &#x60;getRows&#x60; with no token and replace what you\&#39;re showing, rather than merging the result into the old list. For a row\&#39;s items it means the set was cleaned up; start that row\&#39;s pagination again from the beginning.  |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getRows

> GetRowsResponse getRows(pageId, nextPageToken, limit)

List rows

Returns paginated rows for a page. Each row is a labeled group of media titles — the building blocks of your recommendation UI.  Row IDs are opaque references — pass them straight back to &#x60;GET /pages/{pageId}/rows/{rowId}/items&#x60;. They keep working even if recommendations refresh while the user is scrolling, so a rail they\&#39;ve already opened stays readable to the end.  Pagination continues in the set of results it started with, and only for as long as the user\&#39;s recommendations haven\&#39;t turned over. After a turnover (or, rarely, once the set has been cleaned up) the token is refused with &#x60;409 CURSOR_EXPIRED&#x60;: call &#x60;getPage&#x60; and &#x60;getRows&#x60; with no token on the same page ID and replace what you\&#39;re showing with the result. Rows you already hold are not affected: &#x60;GET /pages/{pageId}/rows/{rowId}/items&#x60; keeps working for them.  **Auth tier:** session. 

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
  const result = await client.getRows(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **pageId** | `string` | The unique identifier of the page | [Defaults to `undefined`] |
| **nextPageToken** | `string` | Opaque pagination token returned from the previous page | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | Maximum number of rows to return | [Optional] [Defaults to `5`] |

### Return type

[**GetRowsResponse**](GetRowsResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of rows retrieved successfully |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check the &#x60;error&#x60; field for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **409** | Your pagination cursor or row reference points at a set of results that has since been replaced. The page itself is fine and its ID is still valid. For rows this is what a recommendation turnover looks like: call &#x60;getPage&#x60; and &#x60;getRows&#x60; with no token and replace what you\&#39;re showing, rather than merging the result into the old list. For a row\&#39;s items it means the set was cleaned up; start that row\&#39;s pagination again from the beginning.  |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

