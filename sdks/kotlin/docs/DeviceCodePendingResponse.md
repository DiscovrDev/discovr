
# DeviceCodePendingResponse

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **status** | [**inline**](#Status) | Always &#x60;pending&#x60;. Its presence is the signal to wait and poll again. |  |
| **interval** | **kotlin.Int** | Seconds to wait before the next poll. It can grow the longer the code has been waiting, so always use the latest value. |  |


<a id="Status"></a>
## Enum: status
| Name | Value |
| ---- | ----- |
| status | pending |



