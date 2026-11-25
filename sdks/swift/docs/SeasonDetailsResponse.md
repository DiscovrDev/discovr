# SeasonDetailsResponse

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**showId** | **String** | The TV show identifier (e.g., &#x60;TV_1396&#x60;). | 
**showTmdbId** | **Int** | Numeric identifier for the TV show. | 
**id** | **Int** | Season identifier. | 
**seasonTmdbId** | **Int** | Alias for &#x60;id&#x60;. | [optional] 
**name** | **String** | Name of the season | [optional] 
**overview** | **String** | Overview of the season | [optional] 
**posterPath** | **[String: String]** | Season poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | [optional] 
**seasonNumber** | **Int** | The number of the season | 
**airDate** | **Date** | Air date of the season, as &#x60;YYYY-MM-DD&#x60;, or &#x60;null&#x60; when unknown. | [optional] 
**episodes** | [Episode] | List of episodes in the season | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


