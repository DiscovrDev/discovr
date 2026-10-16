
# HeroItem

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | **kotlin.String** | Unique identifier for the media item |  |
| **title** | **kotlin.String** | Title of the media item |  |
| **overview** | **kotlin.String** | Synopsis/summary text for this title. |  |
| **mediaType** | [**inline**](#MediaType) | Type of media |  |
| **type** | [**MediaItemType**](MediaItemType.md) | Discriminator field indicating this is a media item |  |
| **logoPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Title logo image URLs (English preferred) keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;), or null if no logo available. |  |
| **posterPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  [optional] |
| **backdropPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  [optional] |
| **year** | **kotlin.Int** | Release year (the first air year for TV). Absent when the title has no date. |  [optional] |
| **rating** | **kotlin.Double** | Average viewer rating out of 10, to one decimal. Absent until a title has votes. |  [optional] |
| **genres** | **kotlin.collections.List&lt;kotlin.String&gt;** | Genre names, most relevant first. Absent when none are known. |  [optional] |
| **ref** | **kotlin.String** | This item&#39;s &#x60;id&#x60; with the place it was shown attached.  Prefer it wherever you&#39;d pass this item&#39;s &#x60;id&#x60; onward — opening its detail screen, adding it to a list, scrobbling it. It works exactly like the &#x60;id&#x60; and sharpens the user&#39;s recommendations. Use it for the profile it was returned to; for anything you share, use the &#x60;id&#x60;.  A bare &#x60;id&#x60; always works; &#x60;ref&#x60; is never required.  |  [optional] |


<a id="MediaType"></a>
## Enum: media_type
| Name | Value |
| ---- | ----- |
| mediaType | movie, tv |



