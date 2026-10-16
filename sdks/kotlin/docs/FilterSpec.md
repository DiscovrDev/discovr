
# FilterSpec

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **genres** | **kotlin.collections.List&lt;kotlin.Int&gt;** | Genre IDs to filter by |  [optional] |
| **keywords** | **kotlin.collections.List&lt;kotlin.Int&gt;** | Keyword IDs to filter by |  [optional] |
| **mediaType** | [**inline**](#MediaType) | Media type filter |  [optional] |
| **region** | **kotlin.collections.List&lt;kotlin.String&gt;** | Region codes (e.g., \&quot;US\&quot;, \&quot;GB\&quot;) |  [optional] |
| **withRuntimeGte** | **kotlin.Int** | Minimum runtime in minutes |  [optional] |
| **withRuntimeLte** | **kotlin.Int** | Maximum runtime in minutes |  [optional] |
| **withReleaseDateGte** | [**kotlinx.datetime.LocalDate**](kotlinx.datetime.LocalDate.md) | Earliest release date (YYYY-MM-DD) |  [optional] |
| **withReleaseDateLte** | [**kotlinx.datetime.LocalDate**](kotlinx.datetime.LocalDate.md) | Latest release date (YYYY-MM-DD) |  [optional] |
| **withWatchProviders** | **kotlin.collections.List&lt;kotlin.String&gt;** | Streaming provider IDs |  [optional] |


<a id="MediaType"></a>
## Enum: media_type
| Name | Value |
| ---- | ----- |
| mediaType | movie, tv, all |



