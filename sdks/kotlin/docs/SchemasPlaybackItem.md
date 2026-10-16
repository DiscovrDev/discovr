
# SchemasPlaybackItem

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String** | The title being tracked, as &#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;. |  |
| **mediaType** | [**inline**](#MediaType) | Whether this is a movie or TV show. |  |
| **createdAt** | [**kotlin.time.Instant**](kotlin.time.Instant.md) | When the profile first started this title. |  |
| **progress** | **kotlin.Double** | How far through the title the profile is, as a percentage. Use it to position a progress bar. |  [optional] |
| **updatedAt** | [**kotlin.time.Instant**](kotlin.time.Instant.md) | When progress was last recorded. Sort by this to order a Continue Watching row. |  [optional] |
| **season** | **kotlin.Int** | Season number (only for TV shows) |  [optional] |
| **episode** | **kotlin.Int** | Episode number (only for TV shows) |  [optional] |


<a id="MediaType"></a>
## Enum: mediaType
| Name | Value |
| ---- | ----- |
| mediaType | movie, tv |



