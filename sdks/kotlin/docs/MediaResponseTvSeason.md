
# MediaResponseTvSeason

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **tmdbId** | **kotlin.Int** | Catalogue identifier for this season. |  [optional] |
| **name** | **kotlin.String** | Display name of the season, such as &#x60;Season 1&#x60; or &#x60;Specials&#x60;. |  [optional] |
| **episodeCount** | **kotlin.Int** | Episodes in this season. |  [optional] |
| **seasonNumber** | **kotlin.Int** | Position of the season, starting at &#x60;1&#x60;. Specials use &#x60;0&#x60;. Pass this to &#x60;getSeasonDetails&#x60;. |  [optional] |
| **airDate** | [**kotlinx.datetime.LocalDate**](kotlinx.datetime.LocalDate.md) | Date the season&#39;s first episode aired, as &#x60;YYYY-MM-DD&#x60;. |  [optional] |
| **posterPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Season poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  [optional] |



