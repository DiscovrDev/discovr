
# MediaResponseMovie

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | **kotlin.String** | The Discovr media ID for this movie — the &#x60;MV_&lt;id&gt;&#x60; value you pass to other endpoints. |  [optional] |
| **tmdbId** | **kotlin.Int** | Catalogue identifier for this movie, without the &#x60;MV_&#x60; prefix. |  [optional] |
| **title** | **kotlin.String** | Display title, localised where a translation is available. |  [optional] |
| **originalTitle** | **kotlin.String** | Title in the movie&#39;s original language. Differs from &#x60;title&#x60; for translated releases. |  [optional] |
| **overview** | **kotlin.String** | Short synopsis, suitable for a detail sheet. |  [optional] |
| **posterPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  [optional] |
| **backdropPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  [optional] |
| **releaseDate** | [**kotlinx.datetime.LocalDate**](kotlinx.datetime.LocalDate.md) | Theatrical or first release date, as &#x60;YYYY-MM-DD&#x60;. |  [optional] |
| **runtime** | **kotlin.Int** | Length in whole minutes. |  [optional] |
| **voteAverage** | **kotlin.Double** | Average audience rating out of 10. |  [optional] |
| **voteCount** | **kotlin.Int** | How many ratings &#x60;vote_average&#x60; is based on — useful for deciding whether to show the score at all. |  [optional] |
| **popularity** | **kotlin.Double** | Relative popularity score. Comparable between titles, but has no fixed upper bound, so treat it as a sort key rather than something to display. |  [optional] |
| **genres** | [**kotlin.collections.List&lt;MediaResponseMovieGenre&gt;**](MediaResponseMovieGenre.md) | Genres this movie belongs to. |  [optional] |
| **tagline** | **kotlin.String** | Short marketing line, where one exists. |  [optional] |
| **status** | **kotlin.String** | Release status, such as &#x60;Released&#x60;, &#x60;In Production&#x60;, or &#x60;Post Production&#x60;. |  [optional] |
| **budget** | **kotlin.Int** | Production budget in US dollars. &#x60;0&#x60; when unknown. |  [optional] |
| **revenue** | **kotlin.Int** | Worldwide box office in US dollars. &#x60;0&#x60; when unknown. |  [optional] |
| **homepage** | **kotlin.String** | Official site for the movie, where one exists. |  [optional] |
| **imdbId** | **kotlin.String** | IMDb identifier, for linking out to IMDb. |  [optional] |



