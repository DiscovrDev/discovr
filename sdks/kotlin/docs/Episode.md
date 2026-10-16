
# Episode

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **episodeTmdbId** | **kotlin.Int** | Numeric identifier for the episode. |  |
| **episodeNumber** | **kotlin.Int** | Episode number within the season. |  |
| **name** | **kotlin.String** | Episode title. |  |
| **seasonNumber** | **kotlin.Int** | Season this episode belongs to. |  |
| **showId** | **kotlin.Int** | Numeric identifier for the parent TV show. |  |
| **overview** | **kotlin.String** | Episode synopsis. |  [optional] |
| **stillPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Episode still image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  [optional] |
| **airDate** | [**kotlinx.datetime.LocalDate**](kotlinx.datetime.LocalDate.md) | Original air date of the episode. |  [optional] |
| **runtime** | **kotlin.Int** | Episode runtime in minutes. |  [optional] |
| **productionCode** | **kotlin.String** | Production code for the episode. |  [optional] |
| **voteAverage** | **kotlin.Double** | Community rating for the episode. |  [optional] |
| **voteCount** | **kotlin.Int** | Number of ratings for the episode. |  [optional] |
| **crew** | [**kotlin.collections.List&lt;kotlinx.serialization.json.JsonElement&gt;**](kotlinx.serialization.json.JsonElement.md) | Crew members for this episode. |  [optional] |
| **guestStars** | [**kotlin.collections.List&lt;kotlinx.serialization.json.JsonElement&gt;**](kotlinx.serialization.json.JsonElement.md) | Guest cast for this episode. |  [optional] |



