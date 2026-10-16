# MediaResponse

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | The unique identifier of the media item. | 
**mediaType** | **String** | Whether this is a movie or TV show. | 
**movie** | [**MediaResponseMovie**](MediaResponseMovie.md) |  | [optional] 
**tv** | [**MediaResponseTv**](MediaResponseTv.md) |  | [optional] 
**watchProviders** | [ProviderInfo] | Full list of where this title is available, not filtered to any profile&#39;s preferences. Use &#x60;profile_meta&#x60; with &#x60;providers&#x3D;true&#x60; for a personalized, preference-filtered provider list. Provider data sourced from JustWatch.  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


