
# ApiError

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **error** | [**ApiErrorCode**](ApiErrorCode.md) |  |  |
| **message** | **kotlin.String** | Optional human-readable detail for debugging. Omitted on &#x60;500&#x60; responses. |  [optional] |
| **retryAfterSeconds** | **kotlin.Int** | Present on &#x60;429 rate-limited&#x60; responses. Seconds until the current limit window rolls over. |  [optional] |
| **tokenKind** | [**inline**](#TokenKind) | Present on &#x60;401 token-expired&#x60; responses. Identifies which credential expired. |  [optional] |
| **expected** | [**inline**](#Expected) | Present on &#x60;403 wrong-token-kind&#x60; responses. Identifies which credential tier the endpoint expected. |  [optional] |


<a id="TokenKind"></a>
## Enum: tokenKind
| Name | Value |
| ---- | ----- |
| tokenKind | session, refresh |


<a id="Expected"></a>
## Enum: expected
| Name | Value |
| ---- | ----- |
| expected | session, refresh |



