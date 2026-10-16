
# SeasonDetailsResponse

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **showId** | **kotlin.String** | The TV show identifier (e.g., &#x60;TV_1396&#x60;). |  |
| **showTmdbId** | **kotlin.Int** | Numeric identifier for the TV show. |  |
| **id** | **kotlin.Int** | Season identifier. |  |
| **seasonNumber** | **kotlin.Int** | The number of the season |  |
| **episodes** | [**kotlin.collections.List&lt;Episode&gt;**](Episode.md) | List of episodes in the season |  |
| **tmdbInternalId** | **kotlin.String** | Image asset identifier for the season. |  [optional] |
| **seasonTmdbId** | **kotlin.Int** | Alias for &#x60;id&#x60;. |  [optional] |
| **name** | **kotlin.String** | Name of the season |  [optional] |
| **overview** | **kotlin.String** | Overview of the season |  [optional] |
| **posterPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Season poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  [optional] |
| **airDate** | [**kotlinx.datetime.LocalDate**](kotlinx.datetime.LocalDate.md) | Air date of the season |  [optional] |



