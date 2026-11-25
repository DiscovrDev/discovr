
# Episode

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **episodeTmdbId** | **kotlin.Int** | Numeric identifier for the episode. |  |
| **episodeNumber** | **kotlin.Int** | Episode number within the season. |  |
| **name** | **kotlin.String** | Episode title. |  |
| **seasonNumber** | **kotlin.Int** | Season this episode belongs to. |  |
| **showId** | **kotlin.String** | The parent TV show identifier (e.g., &#x60;TV_1396&#x60;). |  |
| **overview** | **kotlin.String** | Episode synopsis. |  [optional] |
| **stillPath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Episode still image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). |  [optional] |
| **airDate** | [**kotlinx.datetime.LocalDate**](kotlinx.datetime.LocalDate.md) | Original air date of the episode, as &#x60;YYYY-MM-DD&#x60;, or &#x60;null&#x60; when unknown. |  [optional] |
| **runtime** | **kotlin.Int** | Episode runtime in minutes. |  [optional] |
| **productionCode** | **kotlin.String** | Production code for the episode. |  [optional] |
| **voteAverage** | **kotlin.Double** | Community rating for the episode. |  [optional] |
| **voteCount** | **kotlin.Int** | Number of ratings for the episode. |  [optional] |
| **crew** | [**kotlin.collections.List&lt;EpisodeCrewMember&gt;**](EpisodeCrewMember.md) | Crew members for this episode. |  [optional] |
| **guestStars** | [**kotlin.collections.List&lt;EpisodeGuestStar&gt;**](EpisodeGuestStar.md) | Guest cast for this episode. |  [optional] |



