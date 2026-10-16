# Row

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | Opaque reference to this row. Pass it back unchanged to fetch the row&#39;s items. It stays valid across a recommendations refresh, so a rail the user has already opened keeps working.  | 
**title** | **String** | Display title for the row | 
**pageId** | **String** | The stable ID of the page this row belongs to — the same value you passed in. | 
**type** | [**RowType**](RowType.md) | Type of row - media rows contain media items, navigation rows contain navigation items, provider rows contain provider items, top_n rows contain media items (same as media rows but distinguished by type) | 
**index** | **Int** | Display order of this row within the page (lower values appear first) | 
**createdAt** | **Date** | Creation timestamp | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


