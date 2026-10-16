# SchemasPlaybackItem

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**mediaId** | **String** | The title being tracked, as &#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;. | 
**mediaType** | **String** | Whether this is a movie or TV show. | 
**createdAt** | **Date** | When the profile first started this title. | 
**progress** | **Double** | How far through the title the profile is, as a percentage. Use it to position a progress bar. | [optional] 
**updatedAt** | **Date** | When progress was last recorded. Sort by this to order a Continue Watching row. | [optional] 
**season** | **Int** | Season number (only for TV shows) | [optional] 
**episode** | **Int** | Episode number (only for TV shows) | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


