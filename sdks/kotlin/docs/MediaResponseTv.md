
# MediaResponseTv

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | **kotlin.String** | The Discovr media ID for this show — the &#x60;TV_&lt;id&gt;&#x60; value you pass to other endpoints. |  [optional] |
| **tmdbId** | **kotlin.Int** | Catalogue identifier for this show, without the &#x60;TV_&#x60; prefix. |  [optional] |
| **name** | **kotlin.String** | Display name, localised where a translation is available. |  [optional] |
| **originalName** | **kotlin.String** | Name in the show&#39;s original language. Differs from &#x60;name&#x60; for translated releases. |  [optional] |
| **overview** | **kotlin.String** | Short synopsis, suitable for a detail sheet. |  [optional] |
| **posterPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  [optional] |
| **backdropPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  [optional] |
| **firstAirDate** | [**kotlinx.datetime.LocalDate**](kotlinx.datetime.LocalDate.md) | Date the first episode aired, as &#x60;YYYY-MM-DD&#x60;. |  [optional] |
| **lastAirDate** | [**kotlinx.datetime.LocalDate**](kotlinx.datetime.LocalDate.md) | Date the most recent episode aired, as &#x60;YYYY-MM-DD&#x60;. |  [optional] |
| **numberOfEpisodes** | **kotlin.Int** | Total episodes released across every season. |  [optional] |
| **numberOfSeasons** | **kotlin.Int** | Total seasons released. |  [optional] |
| **voteAverage** | **kotlin.Double** | Average audience rating out of 10. |  [optional] |
| **voteCount** | **kotlin.Int** | How many ratings &#x60;vote_average&#x60; is based on — useful for deciding whether to show the score at all. |  [optional] |
| **popularity** | **kotlin.Double** | Relative popularity score. Comparable between titles, but has no fixed upper bound, so treat it as a sort key rather than something to display. |  [optional] |
| **genres** | [**kotlin.collections.List&lt;MediaResponseTvGenre&gt;**](MediaResponseTvGenre.md) | Genres this show belongs to. |  [optional] |
| **tagline** | **kotlin.String** | Short marketing line, where one exists. |  [optional] |
| **status** | **kotlin.String** | Production status, such as &#x60;Returning Series&#x60;, &#x60;Ended&#x60;, or &#x60;Canceled&#x60;. |  [optional] |
| **homepage** | **kotlin.String** | Official site for the show, where one exists. |  [optional] |
| **inProduction** | **kotlin.Boolean** | Whether more episodes are still being made. |  [optional] |
| **seasons** | [**kotlin.collections.List&lt;MediaResponseTvSeason&gt;**](MediaResponseTvSeason.md) | Every season of the show, including specials as season &#x60;0&#x60; where one exists. |  [optional] |



