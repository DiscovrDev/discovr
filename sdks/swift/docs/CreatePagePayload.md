# CreatePagePayload

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**pageFilters** | [**FilterSpec**](FilterSpec.md) | Filters that shape which titles appear in the page&#39;s rows. | [optional] 
**name** | **String** | Optional label for your own use. It doesn&#39;t affect the page you get back and isn&#39;t stored — keep your own mapping from page ID to display name if you need one.  A page&#39;s identity comes from its filters alone. Two calls with the same filters return the **same page** whatever you call it, so give pages that should be distinct distinct filters.  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


