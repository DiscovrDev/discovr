# WebTokenPayload

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**clientID** | **String** | Your client ID — the one the sign-in was started with. | 
**code** | **String** | The single-use authorization code Discovr delivered to your app (a &#x60;postMessage&#x60; to the sign-in window&#39;s opener, or the &#x60;code&#x60; query parameter on your redirect URL). It expires after 60 seconds and is useless without &#x60;codeVerifier&#x60;.  | 
**codeVerifier** | **String** | The random secret you generated when you started the sign-in, whose SHA-256 you sent as &#x60;codeChallenge&#x60;. It never leaves your app until this call. A wrong verifier burns the code.  | 
**deviceId** | **String** | A random, stable identifier for the device signing in: 128 bits, lowercase hex. The SDKs generate it once, keep it across sign-outs and send it for you.  Signing in again from the same device with the same &#x60;deviceId&#x60; replaces the credential that device already held, which stops working, rather than adding a second one beside it. Leave it out and every sign-in is a credential of its own. A value that is not 32 lowercase hex characters is rejected with &#x60;invalid-input&#x60;, before the code is spent.  Never copy it to another device: two devices sharing one &#x60;deviceId&#x60; sign each other out.  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


