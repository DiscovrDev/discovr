
# GifItem

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | **kotlin.String** | Unique identifier for the GIF. |  |
| **url** | **kotlin.String** | Direct URL to the full-size file. An MP4 whenever one is available, otherwise a GIF or a WebP. &#x60;media_type&#x60; says which, so you don&#39;t have to guess from the extension. |  |
| **preview** | [**GifPreview**](GifPreview.md) | A smaller, lighter version, for grids and pickers. Usually a GIF or a WebP; falls back to the full-size file when no smaller one exists, so it can be an MP4. Check its &#x60;media_type&#x60;. |  |
| **mediaType** | [**AvatarMediaType**](AvatarMediaType.md) | What &#x60;url&#x60; is, as a MIME type (&#x60;video/mp4&#x60;, &#x60;image/gif&#x60; or &#x60;image/webp&#x60;). Pick a video player or an image view from it. |  |
| **description** | **kotlin.String** | Title or short description of the GIF. |  |
| **tags** | **kotlin.collections.List&lt;kotlin.String&gt;** | Keywords associated with the GIF. |  |
| **width** | **kotlin.Int** | Width of &#x60;url&#x60; in pixels. |  |
| **height** | **kotlin.Int** | Height of &#x60;url&#x60; in pixels. |  |
| **createdAt** | [**kotlin.time.Instant**](kotlin.time.Instant.md) | When this result was fetched (ISO 8601). |  |
| **still** | [**GifPreview**](GifPreview.md) | A single still frame (&#x60;image/jpeg&#x60;), for Reduce Motion or for grids that shouldn&#39;t animate. Absent when none exists. |  [optional] |
| **placeholder** | **kotlin.String** | A tiny blurred image as a &#x60;data:&#x60; URI, to show while the real file loads. Absent when none exists. |  [optional] |



