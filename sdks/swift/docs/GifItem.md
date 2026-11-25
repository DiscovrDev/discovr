# GifItem

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | Unique identifier for the GIF. | 
**url** | **String** | Direct URL to the full-size file. An MP4 whenever one is available, otherwise a GIF or a WebP. &#x60;media_type&#x60; says which, so you don&#39;t have to guess from the extension. | 
**preview** | [**GifPreview**](GifPreview.md) | A smaller, lighter version, for grids and pickers. Usually a GIF or a WebP; falls back to the full-size file when no smaller one exists, so it can be an MP4. Check its &#x60;media_type&#x60;. | 
**mediaType** | [**AvatarMediaType**](AvatarMediaType.md) | What &#x60;url&#x60; is, as a MIME type (&#x60;video/mp4&#x60;, &#x60;image/gif&#x60; or &#x60;image/webp&#x60;). Pick a video player or an image view from it. | 
**still** | [**GifPreview**](GifPreview.md) | A single still frame (&#x60;image/jpeg&#x60;), for Reduce Motion or for grids that shouldn&#39;t animate. Absent when none exists. | [optional] 
**placeholder** | **String** | A tiny blurred image as a &#x60;data:&#x60; URI, to show while the real file loads. Absent when none exists. | [optional] 
**description** | **String** | Title or short description of the GIF. | 
**tags** | **[String]** | Keywords associated with the GIF. | 
**width** | **Int** | Width of &#x60;url&#x60; in pixels. | 
**height** | **Int** | Height of &#x60;url&#x60; in pixels. | 
**createdAt** | **Date** | When this result was fetched (ISO 8601). | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


