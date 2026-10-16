
# ScrobbleProgressPayload

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String** | The media ID in &#x60;MV_&lt;number&gt;&#x60; or &#x60;TV_&lt;number&gt;&#x60; format (e.g., &#x60;MV_550&#x60;, &#x60;TV_1396&#x60;). |  |
| **progress** | **kotlin.Double** | Current playback position as a percentage (0–100). |  |
| **tv** | [**ScrobbleTv**](ScrobbleTv.md) | Which episode is playing. Required for TV shows, omitted for movies. |  [optional] |



