
# MediaResponse

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | **kotlin.String** | The unique identifier of the media item. |  |
| **mediaType** | [**inline**](#MediaType) | Whether this is a movie or TV show. |  |
| **movie** | [**MediaResponseMovie**](MediaResponseMovie.md) |  |  [optional] |
| **tv** | [**MediaResponseTv**](MediaResponseTv.md) |  |  [optional] |
| **watchProviders** | [**kotlin.collections.List&lt;ProviderInfo&gt;**](ProviderInfo.md) | Full list of where this title is available, not filtered to any profile&#39;s preferences. Use &#x60;profile_meta&#x60; with &#x60;providers&#x3D;true&#x60; for a personalized, preference-filtered provider list. Provider data sourced from JustWatch.  |  [optional] |


<a id="MediaType"></a>
## Enum: media_type
| Name | Value |
| ---- | ----- |
| mediaType | movie, tv |



