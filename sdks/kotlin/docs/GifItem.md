
# GifItem

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | **kotlin.String** | Unique identifier for the GIF. |  |
| **url** | **kotlin.String** | Direct URL to the full-size file. An MP4 whenever one is available, otherwise a GIF. Choose how to render it from the file extension. |  |
| **preview** | [**GifPreview**](GifPreview.md) | A smaller, lighter version, for grids and pickers. Usually a GIF; falls back to the full-size file when no smaller one exists. |  |
| **description** | **kotlin.String** | Title or short description of the GIF. |  |
| **tags** | **kotlin.collections.List&lt;kotlin.String&gt;** | Keywords associated with the GIF. |  |
| **width** | **kotlin.Int** | Width of &#x60;url&#x60; in pixels. |  |
| **height** | **kotlin.Int** | Height of &#x60;url&#x60; in pixels. |  |
| **createdAt** | [**kotlin.time.Instant**](kotlin.time.Instant.md) | When this result was fetched (ISO 8601). |  |



