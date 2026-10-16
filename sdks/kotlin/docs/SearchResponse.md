
# SearchResponse

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **page** | **kotlin.Int** | The page these results came from, starting at 1. |  |
| **results** | [**kotlin.collections.List&lt;SearchResult&gt;**](SearchResult.md) | Matched results for the current page, ordered by relevance. |  |
| **hasMore** | **kotlin.Boolean** | Whether another page is available. Request it by passing &#x60;page&#x60; + 1. |  |



