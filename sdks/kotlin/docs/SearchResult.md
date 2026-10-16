
# SearchResult

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | **kotlin.String** | Unique identifier. &#x60;TV_&lt;id&gt;&#x60; for TV shows, &#x60;MV_&lt;id&gt;&#x60; for movies, or the raw numeric ID for people.  |  |
| **tmdbId** | **kotlin.Int** | The numeric ID for this title or person. |  |
| **mediaType** | [**inline**](#MediaType) | Whether this result is a movie, TV show, or person. |  |
| **ref** | **kotlin.String** | This result&#39;s &#x60;id&#x60; with the search it came from attached.  Prefer it wherever you&#39;d pass this result&#39;s &#x60;id&#x60; onward — opening its detail screen, adding it to a list. It works exactly like the &#x60;id&#x60; and sharpens the user&#39;s recommendations. Use it for the profile it was returned to; for anything you share, use the &#x60;id&#x60;.  Absent on people, who have no detail screen to open. A bare &#x60;id&#x60; always works; &#x60;ref&#x60; is never required.  |  [optional] |
| **title** | **kotlin.String** | Movie title. TV shows use &#x60;name&#x60;, people use &#x60;name&#x60; too. |  [optional] |
| **name** | **kotlin.String** | Show or person name. Movies use &#x60;title&#x60; instead. |  [optional] |
| **originalTitle** | **kotlin.String** | Movie title in its original language. |  [optional] |
| **originalName** | **kotlin.String** | Show name in its original language. |  [optional] |
| **overview** | **kotlin.String** | Short synopsis. Not present for &#x60;person&#x60; results. |  [optional] |
| **posterPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). Absent for &#x60;person&#x60; results. |  [optional] |
| **backdropPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). Absent for &#x60;person&#x60; results. |  [optional] |
| **releaseDate** | [**kotlinx.datetime.LocalDate**](kotlinx.datetime.LocalDate.md) | Release date for &#x60;movie&#x60; results, as &#x60;YYYY-MM-DD&#x60;. |  [optional] |
| **firstAirDate** | [**kotlinx.datetime.LocalDate**](kotlinx.datetime.LocalDate.md) | First air date for &#x60;tv&#x60; results, as &#x60;YYYY-MM-DD&#x60;. |  [optional] |
| **popularity** | **kotlin.Double** | Relative popularity score. Comparable between results, but has no fixed upper bound, so treat it as a sort key rather than something to display. |  [optional] |
| **voteAverage** | **kotlin.Double** | Average audience rating out of 10. Not present for &#x60;person&#x60; results. |  [optional] |
| **voteCount** | **kotlin.Int** | How many ratings &#x60;vote_average&#x60; is based on. Not present for &#x60;person&#x60; results. |  [optional] |
| **profilePath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Headshot image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). Only present for &#x60;person&#x60; results. |  [optional] |
| **knownForDepartment** | **kotlin.String** | The department this person is best known for, e.g. &#x60;Acting&#x60; or &#x60;Directing&#x60;. |  [optional] |
| **knownFor** | [**kotlin.collections.List&lt;KnownForItem&gt;**](KnownForItem.md) | A few titles this person is best known for. Only present for &#x60;person&#x60; results.  Because a person has no detail view of its own, these are the natural next step after a person result — each carries an &#x60;id&#x60; you can pass straight to &#x60;/media/{mediaId}&#x60;.  |  [optional] |


<a id="MediaType"></a>
## Enum: media_type
| Name | Value |
| ---- | ----- |
| mediaType | movie, tv, person |



