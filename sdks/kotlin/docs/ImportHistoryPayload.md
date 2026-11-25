
# ImportHistoryPayload

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String** | Full media ID (&#x60;MV_&lt;number&gt;&#x60; or &#x60;TV_&lt;number&gt;&#x60;), or an item &#x60;ref&#x60;. |  |
| **imported** | **kotlin.String** | Name of the external source being imported from (for example &#x60;\&quot;trakt\&quot;&#x60;). |  |
| **updatedAt** | [**kotlin.time.Instant**](kotlin.time.Instant.md) | ISO 8601 timestamp of when the title was watched. Defaults to now if omitted. |  [optional] |
| **season** | **kotlin.Int** | TV only. Season number to import. Omit to import every aired episode of the show. |  [optional] |
| **episode** | **kotlin.Int** | TV only, and only together with &#x60;season&#x60;. Episode number to import. Omit to import every aired episode of the season. |  [optional] |



