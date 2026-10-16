
# WebTokenPayload

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **clientID** | **kotlin.String** | Your client ID — the one the sign-in was started with. |  |
| **code** | **kotlin.String** | The single-use authorization code Discovr delivered to your app (a &#x60;postMessage&#x60; to the sign-in window&#39;s opener, or the &#x60;code&#x60; query parameter on your redirect URL). It expires after 60 seconds and is useless without &#x60;codeVerifier&#x60;.  |  |
| **codeVerifier** | **kotlin.String** | The random secret you generated when you started the sign-in, whose SHA-256 you sent as &#x60;codeChallenge&#x60;. It never leaves your app until this call. A wrong verifier burns the code.  |  |



