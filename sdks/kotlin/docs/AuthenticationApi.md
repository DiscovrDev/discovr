# AuthenticationApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**authorizeClientWeb**](AuthenticationApi.md#authorizeClientWeb) | **GET** /auth/web/authorize | Redirect to web authentication |
| [**exchangeWebAuthCode**](AuthenticationApi.md#exchangeWebAuthCode) | **POST** /auth/web/token | Redeem a web sign-in code |
| [**mintSessionToken**](AuthenticationApi.md#mintSessionToken) | **POST** /auth/session-token | Mint a session token |
| [**pollDeviceCode**](AuthenticationApi.md#pollDeviceCode) | **POST** /auth/device-codes/{deviceCode}/poll | Poll for auth token |
| [**requestDeviceCode**](AuthenticationApi.md#requestDeviceCode) | **POST** /auth/device-codes | Request device code |
| [**signOutSession**](AuthenticationApi.md#signOutSession) | **DELETE** /auth/session | Sign out the current device |
| [**startDemoSession**](AuthenticationApi.md#startDemoSession) | **POST** /auth/demo-session | Start a demo session |


<a id="authorizeClientWeb"></a>
# **authorizeClientWeb**
> authorizeClientWeb(clientID, state, codeChallenge, codeChallengeMethod, redirectURL, platform)

Redirect to web authentication

Starts a web sign-in: sends the user&#39;s browser to the Discovr page where they sign in and approve your app. After they do, Discovr hands your app a short-lived, single-use **authorization code** (never the long-lived credential), and your app trades it for a refresh token with &#x60;POST /auth/web/token&#x60;. This is the OAuth authorization code flow with PKCE, so the SDKs do all of it for you.  - **&#x60;clientID&#x60;** — your registered app ID, so Discovr knows which app is requesting access. - **&#x60;state&#x60;** — your app&#39;s CSRF token. Discovr echoes it back unchanged so you can verify the response came from Discovr and not a third party. - **&#x60;codeChallenge&#x60;** / **&#x60;codeChallengeMethod&#x60;** — &#x60;base64url(SHA-256(verifier))&#x60; of a random &#x60;codeVerifier&#x60; you keep, and &#x60;S256&#x60;. Required on every request. - **&#x60;redirectURL&#x60;** — where to send the user after sign-in; it must be registered for your client. For a popup, send &#x60;openerOrigin&#x60; instead (the SDK does).  **What your app receives.** On your &#x60;redirectURL&#x60; as query parameters, or as a &#x60;postMessage&#x60; to the popup&#39;s opener: &#x60;{ code, state }&#x60; on success, or &#x60;{ error, state }&#x60; when the person cancels (&#x60;authorization-cancelled&#x60;) or sign-in cannot complete. &#x60;error&#x60; is one of the codes in &#x60;ApiError&#x60;. Check &#x60;state&#x60; first, then redeem &#x60;code&#x60; with your &#x60;codeVerifier&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = AuthenticationApi()

val clientID : kotlin.String = abc123xyz // kotlin.String | The client ID of the third-party application
val state : kotlin.String = 9f2c41d07be34a85b1c6e0d3f7a29c84 // kotlin.String | Opaque value to prevent CSRF; echoed back in the callback response. 16 to 256 URL-safe characters (`A-Z a-z 0-9 - _`); 32 random bytes, hex-encoded, is 64. 
val codeChallenge : kotlin.String = E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM // kotlin.String | `base64url(SHA-256(codeVerifier))`, 43 characters. Generate a fresh random `codeVerifier` per sign-in and keep it; you send it to `POST /auth/web/token` when you redeem the code. 
val codeChallengeMethod : kotlin.String = S256 // kotlin.String | Always `S256`. `plain` is not accepted.
val redirectURL : kotlin.String = https://yourapp.com/callback // kotlin.String | Optional custom redirect URL. If omitted, redirects to the hosted callback page at  https://auth.discovr.media/callback.html which handles token exchange via postMessage  for web popup flows or deep links for mobile apps. Must be URL encoded when provided. 
val platform : kotlin.String = web // kotlin.String | Optional platform hint (web popup, mobile deep link, etc.). Not currently used. 
try {
    discovr.authorizeClientWeb(clientID, state, codeChallenge, codeChallengeMethod, redirectURL, platform)
} catch (e: ClientException) {
    println("4xx response calling AuthenticationApi#authorizeClientWeb")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling AuthenticationApi#authorizeClientWeb")
    e.printStackTrace()
}
```

### Parameters
| **clientID** | **kotlin.String**| The client ID of the third-party application | |
| **state** | **kotlin.String**| Opaque value to prevent CSRF; echoed back in the callback response. 16 to 256 URL-safe characters (&#x60;A-Z a-z 0-9 - _&#x60;); 32 random bytes, hex-encoded, is 64.  | |
| **codeChallenge** | **kotlin.String**| &#x60;base64url(SHA-256(codeVerifier))&#x60;, 43 characters. Generate a fresh random &#x60;codeVerifier&#x60; per sign-in and keep it; you send it to &#x60;POST /auth/web/token&#x60; when you redeem the code.  | |
| **codeChallengeMethod** | **kotlin.String**| Always &#x60;S256&#x60;. &#x60;plain&#x60; is not accepted. | [enum: S256] |
| **redirectURL** | **kotlin.String**| Optional custom redirect URL. If omitted, redirects to the hosted callback page at  https://auth.discovr.media/callback.html which handles token exchange via postMessage  for web popup flows or deep links for mobile apps. Must be URL encoded when provided.  | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **platform** | **kotlin.String**| Optional platform hint (web popup, mobile deep link, etc.). Not currently used.  | [optional] [enum: web, mobile, tv] |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="exchangeWebAuthCode"></a>
# **exchangeWebAuthCode**
> RefreshTokenResponse exchangeWebAuthCode(webTokenPayload)

Redeem a web sign-in code

The last step of a web sign-in. Trade the authorization code Discovr delivered to your app, together with the &#x60;codeVerifier&#x60; you generated when you started, for the refresh token. The SDKs call this for you.  The code is single-use and lives 60 seconds. A request with a wrong &#x60;codeVerifier&#x60; fails **and spends the code**, so whoever intercepted it gets one try, not unlimited guesses. The refresh token comes back in this response only — it is never in a URL or a &#x60;postMessage&#x60;. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = AuthenticationApi()

val webTokenPayload : WebTokenPayload =  // WebTokenPayload | 
try {
    val result : RefreshTokenResponse = discovr.exchangeWebAuthCode(webTokenPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling AuthenticationApi#exchangeWebAuthCode")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling AuthenticationApi#exchangeWebAuthCode")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **webTokenPayload** | [**WebTokenPayload**](WebTokenPayload.md)|  | |

### Return type

[**RefreshTokenResponse**](RefreshTokenResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="mintSessionToken"></a>
# **mintSessionToken**
> SessionTokenResponse mintSessionToken(mintSessionTokenPayload)

Mint a session token

Scopes your browsing session to a specific profile. You&#39;ll call this: - after sign-in, to pick which profile is active - when the user switches to a different profile - when the previous session token has expired  Returns a short-lived session token (valid for 30 minutes) and its expiry time. Use this token in the &#x60;Authorization&#x60; header for all session-tier endpoints — pages, rows, and profile-scoped lists.  The response also carries a &#x60;snapshotId&#x60;, which identifies the recommendations the user is currently browsing. Send it back on your next call so renewing a credential doesn&#39;t reshuffle the screen underneath them. Omit it on a first sign-in or a profile switch, where there&#39;s nothing to carry. Page IDs are unaffected either way.  **Auth tier:** identity — send your refresh token in the &#x60;Authorization: Bearer&#x60; header. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = AuthenticationApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val mintSessionTokenPayload : MintSessionTokenPayload =  // MintSessionTokenPayload | 
try {
    val result : SessionTokenResponse = discovr.mintSessionToken(mintSessionTokenPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling AuthenticationApi#mintSessionToken")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling AuthenticationApi#mintSessionToken")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **mintSessionTokenPayload** | [**MintSessionTokenPayload**](MintSessionTokenPayload.md)|  | |

### Return type

[**SessionTokenResponse**](SessionTokenResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="pollDeviceCode"></a>
# **pollDeviceCode**
> PollDeviceCode200Response pollDeviceCode(deviceCode, devicePollPayload)

Poll for auth token

The second step of the device code flow. Call this repeatedly after showing the user code or QR code.  While the user hasn&#39;t confirmed yet, you&#39;ll get &#x60;{ status: \&quot;pending\&quot;, interval }&#x60; — wait &#x60;interval&#x60; seconds and poll again. Once they approve, the response changes to &#x60;{ refreshToken, publicId, expiresAt }&#x60;. Store the &#x60;refreshToken&#x60; securely — it&#39;s your long-lived credential for all identity-tier calls.  **Polling interval:** the server sets it and repeats it in every pending answer; it grows the longer the code has been waiting, so always use the latest value. The SDKs do this for you. Stop polling when you receive a &#x60;refreshToken&#x60; or a &#x60;401&#x60; error.  A person can decline on their phone. Your next poll then returns &#x60;401&#x60; with &#x60;device-code-denied&#x60; straight away (and on every poll after, until the code expires), so you can say so on screen instead of waiting out the timeout. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = AuthenticationApi()

val deviceCode : kotlin.String = dvc_abc123xyz789 // kotlin.String | The device code obtained from the request device code endpoint
val devicePollPayload : DevicePollPayload =  // DevicePollPayload | Send your `deviceId` so that signing in again on the same device replaces the credential it already held. The SDKs send it for you. The body is optional; with none, every sign-in is a credential of its own. 
try {
    val result : PollDeviceCode200Response = discovr.pollDeviceCode(deviceCode, devicePollPayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling AuthenticationApi#pollDeviceCode")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling AuthenticationApi#pollDeviceCode")
    e.printStackTrace()
}
```

### Parameters
| **deviceCode** | **kotlin.String**| The device code obtained from the request device code endpoint | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **devicePollPayload** | [**DevicePollPayload**](DevicePollPayload.md)| Send your &#x60;deviceId&#x60; so that signing in again on the same device replaces the credential it already held. The SDKs send it for you. The body is optional; with none, every sign-in is a credential of its own.  | [optional] |

### Return type

[**PollDeviceCode200Response**](PollDeviceCode200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="requestDeviceCode"></a>
# **requestDeviceCode**
> DeviceCodeResponse requestDeviceCode(deviceCodePayload, size, format)

Request device code

Starts the TV / device sign-in flow. Call this to get a user code and QR code to display on screen. The user opens Discovr on their phone, scans the QR code or types the user code, and confirms sign-in. Once they do, your next poll to &#x60;/auth/device-codes/{deviceCode}/poll&#x60; returns a refresh token.  **Response format:** - &#x60;format&#x3D;json&#x60; (default) — returns &#x60;{ deviceCode, userCode, authQRCode, verificationUrl, expiresIn, interval }&#x60;. The &#x60;authQRCode&#x60; is a base64 data URL — drop it straight into an &#x60;&lt;img&gt;&#x60; tag. Show &#x60;verificationUrl&#x60; next to the code so people who can&#39;t scan can type &#x60;userCode&#x60; there.  Keep &#x60;deviceCode&#x60; on the device. It is what you poll with, so it is never put in the QR code or shown to the person; the QR code and the screen carry only &#x60;userCode&#x60;. - &#x60;format&#x3D;image&#x60; — returns a raw PNG binary. Handy if you&#39;re embedding the image directly without a data URL wrapper.  **QR code size:** Use the &#x60;size&#x60; parameter to match your display. TV screens benefit from larger codes (600–800 px). Default is 300 px. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = AuthenticationApi()

val deviceCodePayload : DeviceCodePayload = {"clientID":"abc123xyz"} // DeviceCodePayload | 
val size : kotlin.Int = 600 // kotlin.Int | QR code size in pixels. Larger sizes are recommended for TV displays.
val format : kotlin.String = json // kotlin.String | Response format. Use \"image\" for native clients to receive binary PNG directly.
try {
    val result : DeviceCodeResponse = discovr.requestDeviceCode(deviceCodePayload, size, format)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling AuthenticationApi#requestDeviceCode")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling AuthenticationApi#requestDeviceCode")
    e.printStackTrace()
}
```

### Parameters
| **deviceCodePayload** | [**DeviceCodePayload**](DeviceCodePayload.md)|  | |
| **size** | **kotlin.Int**| QR code size in pixels. Larger sizes are recommended for TV displays. | [optional] [default to 300] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **format** | **kotlin.String**| Response format. Use \&quot;image\&quot; for native clients to receive binary PNG directly. | [optional] [default to Format.json] [enum: json, image] |

### Return type

[**DeviceCodeResponse**](DeviceCodeResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, image/png

<a id="signOutSession"></a>
# **signOutSession**
> SignOutSession200Response signOutSession()

Sign out the current device

Signs out the current device by revoking the refresh token you send in the &#x60;Authorization&#x60; header. Other devices the user is signed into aren&#39;t affected — you can only sign out the current device from a third-party app.  Identity-tier calls using this token fail immediately after revocation. Any existing session tokens (valid for 30 minutes) remain usable until they naturally expire.  Works the same way for a demo session&#39;s refresh token — a demo sandbox is an ordinary account, so this is a quick way to end one early and test how your app handles it.  Using an SDK? Call &#x60;signOut()&#x60; instead — it wraps this endpoint and also clears the credentials stored on the device.  **Auth tier:** identity — send your refresh token in the &#x60;Authorization: Bearer&#x60; header. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = AuthenticationApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

try {
    val result : SignOutSession200Response = discovr.signOutSession()
    println(result)
} catch (e: ClientException) {
    println("4xx response calling AuthenticationApi#signOutSession")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling AuthenticationApi#signOutSession")
    e.printStackTrace()
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**SignOutSession200Response**](SignOutSession200Response.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="startDemoSession"></a>
# **startDemoSession**
> DemoSessionResponse startDemoSession(demoSessionRequest)

Start a demo session

Gives you a working Discovr account in one call — no sign-up, no credentials, nothing to configure. Use it while you build: to explore the API, prototype against realistic data, or try requests right here in the docs. It&#39;s a development tool, not something to put in front of your users.  You get a private sandbox pre-loaded with profiles, watchlists, and viewing history, so recommendation rows are populated from the very first request. It behaves like any other account: writes really do save, and reading them back returns what you&#39;d expect.  The response is a refresh token. From here you&#39;re on the normal path — call [&#x60;POST /auth/session-token&#x60;](/api-reference/discovr/mint-session-token) with a profile ID to start browsing. Nothing else about your integration changes, which is the point: code you write against a demo session works unchanged against a real one.  Two things to keep in mind: - **Sandboxes are temporary.** Yours lasts 30 minutes (you can ask for a shorter one with &#x60;ttlMs&#x60;, never a longer one) and everything in it is deleted afterwards. Once it has ended, requests made with its token fail with &#x60;401&#x60; &#x60;TOKEN_EXPIRED&#x60;. Don&#39;t build anything that expects it to still be there tomorrow. - **Sandboxes are rate limited.** You can start five per hour from the same network address, and that allowance is shared with the demo button on Discovr&#39;s sign-in screens and with a TV&#39;s device-code demo. When it runs out you get a &#x60;429&#x60; with a &#x60;Retry-After&#x60; header, so hold on to the token you&#39;re given rather than requesting a new one per request.  You do still need a &#x60;clientId&#x60; — the same one your SDK constructor already takes regardless of demo mode, so this asks nothing new of a real integration. Trying this endpoint directly from this page? Use &#x60;discovr-docs-playground&#x60;, a client id that&#39;s always available for exactly that.  It also powers the \&quot;Continue as Demo\&quot; button that Discovr&#39;s sign-in screens show to a client created with &#x60;demoMode&#x60;, which is meant for development builds.  **Auth tier:** none — this is the one endpoint you can call without a credential. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*

val discovr = AuthenticationApi()

val demoSessionRequest : DemoSessionRequest =  // DemoSessionRequest | 
try {
    val result : DemoSessionResponse = discovr.startDemoSession(demoSessionRequest)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling AuthenticationApi#startDemoSession")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling AuthenticationApi#startDemoSession")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **demoSessionRequest** | [**DemoSessionRequest**](DemoSessionRequest.md)|  | |

### Return type

[**DemoSessionResponse**](DemoSessionResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

