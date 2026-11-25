
# TitleListItem

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | **kotlin.String** | The DiscovrID (&#x60;TV_&lt;number&gt;&#x60; or &#x60;MV_&lt;number&gt;&#x60;). |  |
| **mediaType** | [**inline**](#MediaType) | The type of media. |  |
| **title** | **kotlin.String** | The title of the media. |  |
| **posterPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  |
| **backdropPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  |
| **watchlist** | **kotlin.Boolean** | Whether this title is on the profile&#39;s watchlist. |  |
| **updatedAt** | [**kotlin.time.Instant**](kotlin.time.Instant.md) | ISO 8601 timestamp for the active sort dimension (rated time, watchlisted time, or last watched time). |  |
| **ref** | **kotlin.String** | This item&#39;s &#x60;id&#x60; with the list it came from attached.  Prefer it wherever you&#39;d pass this item&#39;s &#x60;id&#x60; onward — opening its detail screen, rating it, or removing it from a list. A bare &#x60;id&#x60; always works; &#x60;ref&#x60; is never required.  |  [optional] |
| **rating** | [**Rating**](Rating.md) |  |  [optional] |
| **completed** | **kotlin.Boolean** | Present on &#x60;watched&#x3D;true&#x60; results — whether the title is fully finished. |  [optional] |
| **plays** | **kotlin.Int** | Present on &#x60;watched&#x3D;true&#x60; results — total completed plays. |  [optional] |
| **season** | **kotlin.Int** | Present on &#x60;watched&#x3D;true&#x60; TV results — most recently watched season number. |  [optional] |
| **episode** | **kotlin.Int** | Present on &#x60;watched&#x3D;true&#x60; TV results — most recently watched episode number. |  [optional] |
| **imported** | **kotlin.String** | Present on &#x60;watched&#x3D;true&#x60; results when imported from an external source (e.g., &#x60;\&quot;trakt\&quot;&#x60;). |  [optional] |


<a id="MediaType"></a>
## Enum: mediaType
| Name | Value |
| ---- | ----- |
| mediaType | movie, tv |



