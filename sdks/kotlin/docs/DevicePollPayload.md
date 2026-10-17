
# DevicePollPayload

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **deviceId** | **kotlin.String** | A random, stable identifier for the device signing in: 128 bits, lowercase hex. The SDKs generate it once, keep it across sign-outs and send it for you.  Signing in again from the same device with the same &#x60;deviceId&#x60; replaces the credential that device already held, which stops working, rather than adding a second one beside it. Leave it out and every sign-in is a credential of its own. A value that is not 32 lowercase hex characters is rejected with &#x60;invalid-input&#x60;.  Never copy it to another device: two devices sharing one &#x60;deviceId&#x60; sign each other out.  |  [optional] |



