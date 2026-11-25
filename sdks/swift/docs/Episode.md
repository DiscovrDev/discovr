# Episode

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**episodeTmdbId** | **Int** | Numeric identifier for the episode. | 
**episodeNumber** | **Int** | Episode number within the season. | 
**name** | **String** | Episode title. | 
**overview** | **String** | Episode synopsis. | [optional] 
**stillPath** | **[String: String]** | Episode still image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | [optional] 
**airDate** | **Date** | Original air date of the episode, as &#x60;YYYY-MM-DD&#x60;, or &#x60;null&#x60; when unknown. | [optional] 
**runtime** | **Int** | Episode runtime in minutes. | [optional] 
**seasonNumber** | **Int** | Season this episode belongs to. | 
**showId** | **String** | The parent TV show identifier (e.g., &#x60;TV_1396&#x60;). | 
**productionCode** | **String** | Production code for the episode. | [optional] 
**voteAverage** | **Double** | Community rating for the episode. | [optional] 
**voteCount** | **Int** | Number of ratings for the episode. | [optional] 
**crew** | [EpisodeCrewMember] | Crew members for this episode. | [optional] 
**guestStars** | [EpisodeGuestStar] | Guest cast for this episode. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


