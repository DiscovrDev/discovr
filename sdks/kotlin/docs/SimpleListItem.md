
# SimpleListItem

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | **kotlin.String** | The DiscovrID (TV_&lt;number&gt; or MV_&lt;number&gt;) |  |
| **mediaType** | [**inline**](#MediaType) | The type of media |  |
| **title** | **kotlin.String** | The title of the media |  |
| **posterPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  |
| **backdropPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  |
| **createdAt** | [**kotlin.time.Instant**](kotlin.time.Instant.md) | ISO 8601 timestamp indicating when the item was added to the list |  |
| **ref** | **kotlin.String** | This item&#39;s &#x60;id&#x60; with the list it came from attached.  Prefer it wherever you&#39;d pass this item&#39;s &#x60;id&#x60; onward — opening its detail screen, removing it from a list. It works exactly like the &#x60;id&#x60; and sharpens the user&#39;s recommendations. Use it for the profile it was returned to; for anything you share, use the &#x60;id&#x60;.  A bare &#x60;id&#x60; always works; &#x60;ref&#x60; is never required.  |  [optional] |


<a id="MediaType"></a>
## Enum: mediaType
| Name | Value |
| ---- | ----- |
| mediaType | movie, tv |



