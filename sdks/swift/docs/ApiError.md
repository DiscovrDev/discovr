# ApiError

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**error** | [**ApiErrorCode**](ApiErrorCode.md) |  | 
**message** | **String** | Optional human-readable detail for debugging. Omitted on &#x60;500&#x60; responses. | [optional] 
**retryAfterSeconds** | **Int** | Present on &#x60;429 rate-limited&#x60; responses. Seconds until the current limit window rolls over. | [optional] 
**tokenKind** | **String** | Present on &#x60;401 token-expired&#x60; responses. Identifies which credential expired. | [optional] 
**expected** | **String** | Present on &#x60;403 wrong-token-kind&#x60; responses. Identifies which credential tier the endpoint expected. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


