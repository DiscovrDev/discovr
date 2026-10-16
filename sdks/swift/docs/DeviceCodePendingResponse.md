# DeviceCodePendingResponse

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **String** | Always &#x60;pending&#x60;. Its presence is the signal to wait and poll again. | 
**interval** | **Int** | Seconds to wait before the next poll. It can grow the longer the code has been waiting, so always use the latest value. | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


