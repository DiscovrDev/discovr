# GifItem

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | Unique identifier for the GIF. | 
**url** | **String** | Direct URL to the full-size file. An MP4 whenever one is available, otherwise a GIF. Choose how to render it from the file extension. | 
**preview** | [**GifPreview**](GifPreview.md) | A smaller, lighter version, for grids and pickers. Usually a GIF; falls back to the full-size file when no smaller one exists. | 
**description** | **String** | Title or short description of the GIF. | 
**tags** | **[String]** | Keywords associated with the GIF. | 
**width** | **Int** | Width of &#x60;url&#x60; in pixels. | 
**height** | **Int** | Height of &#x60;url&#x60; in pixels. | 
**createdAt** | **Date** | When this result was fetched (ISO 8601). | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


