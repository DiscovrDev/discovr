
# RateLimitedError

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **error** | [**inline**](#Error) | Machine-readable error code. Always &#x60;rate-limited&#x60; for a &#x60;429&#x60;. |  |
| **retryAfterSeconds** | **kotlin.Int** | Seconds until the current limit window rolls over. Mirrors the &#x60;Retry-After&#x60; header. |  |


<a id="Error"></a>
## Enum: error
| Name | Value |
| ---- | ----- |
| error | rate-limited |



