
# CastMember

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | **kotlin.Int** | Catalogue identifier for the person. Stable across titles. |  |
| **name** | **kotlin.String** | The person&#39;s name. |  |
| **character** | **kotlin.String** | The role they play. &#x60;null&#x60; when the catalogue doesn&#39;t list one. |  [optional] |
| **profilePath** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Portrait URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;), or &#x60;null&#x60; when there is no photo. |  [optional] |



