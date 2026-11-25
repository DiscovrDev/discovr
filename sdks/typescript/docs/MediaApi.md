# MediaApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getMedia**](MediaApi.md#getmedia) | **GET** /media/{mediaId} | Get media details |
| [**getMediaAssets**](MediaApi.md#getmediaassets) | **GET** /media/{mediaId}/assets | Get media assets |
| [**getSeasonDetails**](MediaApi.md#getseasondetails) | **GET** /media/{mediaId}/seasons/{seasonNumber} | Get TV season details |
| [**getSimilarRecommendations**](MediaApi.md#getsimilarrecommendations) | **GET** /media/{mediaId}/similar | Get similar titles |



## getMedia

> MediaResponse getMedia(mediaId)

Get media details

Returns full details for a movie or TV show — title, overview, genres, release date, runtime, cast, crew, watch providers, and more. Pass &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. The response is generic catalog metadata; the profile\&#39;s own state for the title (lists, playback, completion) is &#x60;getMediaProfileMeta&#x60;, which is also the call that records the title as opened. 

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
  const result = await client.getMedia(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The unique identifier of the media item. Use &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |

### Return type

[**MediaResponse**](MediaResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Full media details returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **403** | The token is valid but this account can\&#39;t use the API right now: it\&#39;s still on the waitlist (&#x60;access-not-granted&#x60;), has to accept the current Terms (&#x60;legal-acceptance-required&#x60;), or the profile in the token no longer exists (&#x60;profile-not-found&#x60;). Re-authenticating won\&#39;t change the answer; show the user what the &#x60;error&#x60; code says. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getMediaAssets

> MediaAssetsResponse getMediaAssets(mediaId)

Get media assets

Returns the best-available poster, backdrop, logo, and trailer for a title — one resolved URL per asset type. Uses English/language-neutral preference for images, and picks the best official trailer when one is available.  Row items already carry &#x60;logo_path&#x60; and &#x60;trailer&#x60; when they are served, so you only need this for a title you reached some other way, such as search.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. The response is generic catalog metadata, but the call needs a profile: the title you open is attributed to it. 

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
  const result = await client.getMediaAssets(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The unique identifier of the media item. Use &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |

### Return type

[**MediaAssetsResponse**](MediaAssetsResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Media assets returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **403** | The token is valid but this account can\&#39;t use the API right now: it\&#39;s still on the waitlist (&#x60;access-not-granted&#x60;), has to accept the current Terms (&#x60;legal-acceptance-required&#x60;), or the profile in the token no longer exists (&#x60;profile-not-found&#x60;). Re-authenticating won\&#39;t change the answer; show the user what the &#x60;error&#x60; code says. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSeasonDetails

> SeasonDetailsResponse getSeasonDetails(mediaId, seasonNumber, language)

Get TV season details

Returns episode details for a specific TV season — episode titles, overviews, air dates, and episode numbers.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. The response is generic catalog metadata (what the profile has watched is &#x60;getSeasonProfileMeta&#x60;), but the call needs a profile. 

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
  const result = await client.getSeasonDetails(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The unique identifier of the TV show (e.g., &#x60;TV_1396&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |
| **seasonNumber** | `number` | The season number. | [Defaults to `undefined`] |
| **language** | `string` | ISO 639-1 language code for localised results (e.g., &#x60;en&#x60;). | [Optional] [Defaults to `undefined`] |

### Return type

[**SeasonDetailsResponse**](SeasonDetailsResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Season details returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **403** | The token is valid but this account can\&#39;t use the API right now: it\&#39;s still on the waitlist (&#x60;access-not-granted&#x60;), has to accept the current Terms (&#x60;legal-acceptance-required&#x60;), or the profile in the token no longer exists (&#x60;profile-not-found&#x60;). Re-authenticating won\&#39;t change the answer; show the user what the &#x60;error&#x60; code says. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSimilarRecommendations

> SimilarResponse getSimilarRecommendations(mediaId, language, page)

Get similar titles

Returns titles that are similar to the given movie or TV show. Useful for \&quot;More like this\&quot; sections.  **Auth tier:** session — send your session token in &#x60;Authorization: Bearer&#x60;. The refs on the results are sealed for the profile that asked. 

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
  const result = await client.getSimilarRecommendations(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **mediaId** | `string` | The unique identifier of the media item. Use &#x60;MV_&lt;id&gt;&#x60; for movies or &#x60;TV_&lt;id&gt;&#x60; for TV shows (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;).  Also accepts an item\&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user\&#39;s recommendations.  | [Defaults to `undefined`] |
| **language** | `string` | Language code for results (e.g., &#x60;en-US&#x60;). | [Optional] [Defaults to `undefined`] |
| **page** | `number` | Page number for pagination (default: 1). | [Optional] [Defaults to `1`] |

### Return type

[**SimilarResponse**](SimilarResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Similar titles returned successfully. |  -  |
| **400** | The request is missing a required field or contains an invalid value. Check &#x60;error&#x60; and optional &#x60;message&#x60; for details. |  -  |
| **401** | Authentication failed — the token is missing, expired, or invalid. |  -  |
| **403** | The token is valid but this account can\&#39;t use the API right now: it\&#39;s still on the waitlist (&#x60;access-not-granted&#x60;), has to accept the current Terms (&#x60;legal-acceptance-required&#x60;), or the profile in the token no longer exists (&#x60;profile-not-found&#x60;). Re-authenticating won\&#39;t change the answer; show the user what the &#x60;error&#x60; code says. |  -  |
| **404** | The requested resource wasn\&#39;t found. |  -  |
| **429** | Too many requests. Back off and retry after a short delay — limits are scoped per client and per endpoint, so this doesn\&#39;t affect other clients. |  * Retry-After - Seconds to wait before retrying. Counted to the end of the current limit window, so it is never longer than it needs to be. <br>  |
| **500** | Something went wrong on Discovr\&#39;s end. Try again, and contact support if the issue persists. |  -  |
| **503** | The API is temporarily unavailable — an operator-triggered safety measure, not a routine outage. Retry after a delay; check Discovr\&#39;s status page if this persists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

