
# RowItem

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | **kotlin.String** | Unique identifier for the provider item |  |
| **title** | **kotlin.String** | Title of the provider (streaming service name) |  |
| **overview** | **kotlin.String** | Synopsis/summary text for this title. |  |
| **mediaType** | [**inline**](#MediaType) | Type of media |  |
| **pageId** | **kotlin.String** | ID of the page this provider item links to |  |
| **paths** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Square Logo URLs in various resolutions (keys are resolution IDs like \&quot;60\&quot;, \&quot;100\&quot;, \&quot;512\&quot;, \&quot;1024\&quot;) |  |
| **posterPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  [optional] |
| **backdropPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  [optional] |
| **year** | **kotlin.Int** | Release year (the first air year for TV). Absent when the title has no date. |  [optional] |
| **rating** | **kotlin.Double** | Average viewer rating out of 10, to one decimal. Absent until a title has votes. |  [optional] |
| **genres** | **kotlin.collections.List&lt;kotlin.String&gt;** | Genre names, most relevant first. Absent when none are known. |  [optional] |
| **ref** | **kotlin.String** | This tile&#39;s &#x60;page_id&#x60; with the place it was shown attached.  Prefer it over &#x60;page_id&#x60; when opening the page this tile links to. It resolves to the same page and sharpens the user&#39;s recommendations. Use it for the profile it was returned to.  A bare &#x60;page_id&#x60; always works; &#x60;ref&#x60; is never required.  |  [optional] |
| **verticalPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Vertical tile image URLs keyed by size: &#x60;original&#x60; (800×1200) and &#x60;thumbnail&#x60; (400×600), pre-rendered at build time.  |  [optional] |
| **horizontalPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Horizontal tile image URLs keyed by size: &#x60;original&#x60; (1080×608) and &#x60;thumbnail&#x60; (540×304), pre-rendered at build time.  |  [optional] |


<a id="MediaType"></a>
## Enum: media_type
| Name | Value |
| ---- | ----- |
| mediaType | movie, tv |



