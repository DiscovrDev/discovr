# RateLimitedError

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**error** | **String** | Machine-readable error code. Always &#x60;RATE_LIMITED&#x60; for a &#x60;429&#x60;. | 
**retryAfterSeconds** | **Int** | Seconds until the current limit window rolls over. Mirrors the &#x60;Retry-After&#x60; header. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


