# PollDeviceCode200Response

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**refreshToken** | **String** | Your long-lived credential (valid for 90 days). Use it as the bearer for identity-tier endpoints and to mint session tokens. Keep it secure — treat it like a password and never put it in URLs.  | 
**publicId** | **String** | An identifier for this device&#39;s sign-in. There&#39;s no way to target it directly — call &#x60;DELETE /auth/session&#x60; from this device to sign it out. | 
**expiresAt** | **Int64** | When the refresh token expires, as a Unix timestamp (seconds). | 
**status** | **String** | Always &#x60;pending&#x60;. Its presence is the signal to wait and poll again. | 
**interval** | **Int** | Seconds to wait before the next poll. It can grow the longer the code has been waiting, so always use the latest value. | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


