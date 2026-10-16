
# KnownForItem

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | **kotlin.String** | Unique identifier — &#x60;TV_&lt;id&gt;&#x60; for TV shows, &#x60;MV_&lt;id&gt;&#x60; for movies. Ready to pass to &#x60;/media/{mediaId}&#x60;. |  |
| **tmdbId** | **kotlin.Int** | The numeric ID for this title. |  |
| **mediaType** | [**inline**](#MediaType) | Whether this title is a movie or a TV show. |  |
| **ref** | **kotlin.String** | This title&#39;s &#x60;id&#x60; with the search it came from attached.  Prefer it wherever you&#39;d pass this title&#39;s &#x60;id&#x60; onward — opening its detail screen, adding it to a list. It works exactly like the &#x60;id&#x60; and sharpens the user&#39;s recommendations. Use it for the profile it was returned to; for anything you share, use the &#x60;id&#x60;.  A bare &#x60;id&#x60; always works; &#x60;ref&#x60; is never required.  |  [optional] |
| **title** | **kotlin.String** | Movie title. TV shows use &#x60;name&#x60; instead. |  [optional] |
| **name** | **kotlin.String** | TV show name. Movies use &#x60;title&#x60; instead. |  [optional] |
| **overview** | **kotlin.String** | Short synopsis of the title. |  [optional] |
| **posterPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  [optional] |
| **backdropPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  [optional] |
| **releaseDate** | [**kotlinx.datetime.LocalDate**](kotlinx.datetime.LocalDate.md) | Release date, for movies. |  [optional] |
| **firstAirDate** | [**kotlinx.datetime.LocalDate**](kotlinx.datetime.LocalDate.md) | First air date, for TV shows. |  [optional] |
| **voteAverage** | **kotlin.Double** | Average audience rating out of 10. |  [optional] |


<a id="MediaType"></a>
## Enum: media_type
| Name | Value |
| ---- | ----- |
| mediaType | movie, tv |



