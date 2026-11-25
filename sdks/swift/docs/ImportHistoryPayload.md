# ImportHistoryPayload

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**mediaId** | **String** | Full media ID (&#x60;MV_&lt;number&gt;&#x60; or &#x60;TV_&lt;number&gt;&#x60;), or an item &#x60;ref&#x60;. | 
**imported** | **String** | Name of the external source being imported from (for example &#x60;\&quot;trakt\&quot;&#x60;). | 
**updatedAt** | **Date** | ISO 8601 timestamp of when the title was watched. Defaults to now if omitted. | [optional] 
**season** | **Int** | TV only. Season number to import. Omit to import every aired episode of the show. | [optional] 
**episode** | **Int** | TV only, and only together with &#x60;season&#x60;. Episode number to import. Omit to import every aired episode of the season. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


