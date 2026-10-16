# DeviceCodeResponse

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**deviceCode** | **String** | The code that identifies this authorization request. Pass it to the poll endpoint. It is the secret you poll with, so keep it on the device: it is never shown to the person, never put in the QR code, and never needed by the phone.  | 
**userCode** | **String** | A short numeric code for the user to type if they can&#39;t scan the QR code. Show it on screen. The QR code carries this code and nothing else.  | 
**authQRCode** | **String** | A ready-to-display QR code image as a base64 data URL. Set it as the &#x60;src&#x60; of an &#x60;&lt;img&gt;&#x60; tag — no extra processing needed.  | 
**verificationUrl** | **String** | The page where someone types &#x60;userCode&#x60; when they can&#39;t scan the QR code. Show it on screen next to the code.  | 
**expiresIn** | **Int** | How long the device code is valid, in milliseconds. | 
**interval** | **Int** | How many seconds to wait between polls. The SDKs follow it for you. Every pending poll repeats it and may raise it, so a device that has been waiting a while polls less often.  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


