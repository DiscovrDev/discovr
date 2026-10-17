# AuthenticationAPI

All URIs are relative to *https://api.discovr.media*

Method | HTTP request | Description
------------- | ------------- | -------------
[**authorizeClientWeb**](AuthenticationAPI.md#authorizeclientweb) | **GET** /auth/web/authorize | Redirect to web authentication
[**exchangeWebAuthCode**](AuthenticationAPI.md#exchangewebauthcode) | **POST** /auth/web/token | Redeem a web sign-in code
[**mintSessionToken**](AuthenticationAPI.md#mintsessiontoken) | **POST** /auth/session-token | Mint a session token
[**pollDeviceCode**](AuthenticationAPI.md#polldevicecode) | **POST** /auth/device-codes/{deviceCode}/poll | Poll for auth token
[**requestDeviceCode**](AuthenticationAPI.md#requestdevicecode) | **POST** /auth/device-codes | Request device code
[**signOutSession**](AuthenticationAPI.md#signoutsession) | **DELETE** /auth/session | Sign out the current device
[**startDemoSession**](AuthenticationAPI.md#startdemosession) | **POST** /auth/demo-session | Start a demo session


# **authorizeClientWeb**
```swift
    open class func authorizeClientWeb(clientID: String, state: String, codeChallenge: String, codeChallengeMethod: CodeChallengeMethod_authorizeClientWeb, redirectURL: String? = nil, platform: Platform_authorizeClientWeb? = nil, completion: @escaping (_ data: Void?, _ error: Error?) -> Void)
```

Redirect to web authentication

Starts a web sign-in: sends the user's browser to the Discovr page where they sign in and approve your app. After they do, Discovr hands your app a short-lived, single-use **authorization code** (never the long-lived credential), and your app trades it for a refresh token with `POST /auth/web/token`. This is the OAuth authorization code flow with PKCE, so the SDKs do all of it for you.  - **`clientID`** — your registered app ID, so Discovr knows which app is requesting access. - **`state`** — your app's CSRF token. Discovr echoes it back unchanged so you can verify the response came from Discovr and not a third party. - **`codeChallenge`** / **`codeChallengeMethod`** — `base64url(SHA-256(verifier))` of a random `codeVerifier` you keep, and `S256`. Required on every request. - **`redirectURL`** — where to send the user after sign-in; it must be registered for your client. For a popup, send `openerOrigin` instead (the SDK does).  **What your app receives.** On your `redirectURL` as query parameters, or as a `postMessage` to the popup's opener: `{ code, state }` on success, or `{ error, state }` when the person cancels (`authorization-cancelled`) or sign-in cannot complete. `error` is one of the codes in `ApiError`. Check `state` first, then redeem `code` with your `codeVerifier`. 

### Example
```swift
import Discovr


let clientID: String = "clientID_example" // The client ID of the third-party application
let state: String = "state_example" // Opaque value to prevent CSRF; echoed back in the callback response. 16 to 256 URL-safe characters (`A-Z a-z 0-9 - _`); 32 random bytes, hex-encoded, is 64. 
let codeChallenge: String = "codeChallenge_example" // `base64url(SHA-256(codeVerifier))`, 43 characters. Generate a fresh random `codeVerifier` per sign-in and keep it; you send it to `POST /auth/web/token` when you redeem the code. 
let codeChallengeMethod: String = "codeChallengeMethod_example" // Always `S256`. `plain` is not accepted.
let redirectURL: String = "redirectURL_example" // Optional custom redirect URL. If omitted, redirects to the hosted callback page at  https://auth.discovr.media/callback.html which handles token exchange via postMessage  for web popup flows or deep links for mobile apps. Must be URL encoded when provided.  (optional)
let platform: String = "platform_example" // Optional platform hint (web popup, mobile deep link, etc.). Not currently used.  (optional)

AuthenticationAPI.authorizeClientWeb(clientID: clientID, state: state, codeChallenge: codeChallenge, codeChallengeMethod: codeChallengeMethod, redirectURL: redirectURL, platform: platform) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientID** | **String** | The client ID of the third-party application | 
 **state** | **String** | Opaque value to prevent CSRF; echoed back in the callback response. 16 to 256 URL-safe characters (&#x60;A-Z a-z 0-9 - _&#x60;); 32 random bytes, hex-encoded, is 64.  | 
 **codeChallenge** | **String** | &#x60;base64url(SHA-256(codeVerifier))&#x60;, 43 characters. Generate a fresh random &#x60;codeVerifier&#x60; per sign-in and keep it; you send it to &#x60;POST /auth/web/token&#x60; when you redeem the code.  | 
 **codeChallengeMethod** | **String** | Always &#x60;S256&#x60;. &#x60;plain&#x60; is not accepted. | 
 **redirectURL** | **String** | Optional custom redirect URL. If omitted, redirects to the hosted callback page at  https://auth.discovr.media/callback.html which handles token exchange via postMessage  for web popup flows or deep links for mobile apps. Must be URL encoded when provided.  | [optional] 
 **platform** | **String** | Optional platform hint (web popup, mobile deep link, etc.). Not currently used.  | [optional] 

### Return type

Void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **exchangeWebAuthCode**
```swift
    open class func exchangeWebAuthCode(webTokenPayload: WebTokenPayload, completion: @escaping (_ data: RefreshTokenResponse?, _ error: Error?) -> Void)
```

Redeem a web sign-in code

The last step of a web sign-in. Trade the authorization code Discovr delivered to your app, together with the `codeVerifier` you generated when you started, for the refresh token. The SDKs call this for you.  The code is single-use and lives 60 seconds. A request with a wrong `codeVerifier` fails **and spends the code**, so whoever intercepted it gets one try, not unlimited guesses. The refresh token comes back in this response only — it is never in a URL or a `postMessage`. 

### Example
```swift
import Discovr


let webTokenPayload: WebTokenPayload = WebTokenPayload(clientID: "clientID_example", code: "code_example", codeVerifier: "codeVerifier_example", deviceId: "deviceId_example") // 

AuthenticationAPI.exchangeWebAuthCode(webTokenPayload: webTokenPayload) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **webTokenPayload** | [**WebTokenPayload**](WebTokenPayload.md) |  | 

### Return type

[**RefreshTokenResponse**](RefreshTokenResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mintSessionToken**
```swift
    open class func mintSessionToken(mintSessionTokenPayload: MintSessionTokenPayload, completion: @escaping (_ data: SessionTokenResponse?, _ error: Error?) -> Void)
```

Mint a session token

Scopes your browsing session to a specific profile. You'll call this: - after sign-in, to pick which profile is active - when the user switches to a different profile - when the previous session token has expired  Returns a short-lived session token (valid for 30 minutes) and its expiry time. Use this token in the `Authorization` header for all session-tier endpoints — pages, rows, and profile-scoped lists.  The response also carries a `snapshotId`, which identifies the recommendations the user is currently browsing. Send it back on your next call so renewing a credential doesn't reshuffle the screen underneath them. Omit it on a first sign-in or a profile switch, where there's nothing to carry. Page IDs are unaffected either way.  **Auth tier:** identity — send your refresh token in the `Authorization: Bearer` header. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let mintSessionTokenPayload: MintSessionTokenPayload = MintSessionTokenPayload(profileId: "profileId_example", ttlMs: 123, snapshotId: "snapshotId_example") // 

Task {
    do {
        let result = try await discovr.mintSessionToken(mintSessionTokenPayload: mintSessionTokenPayload)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mintSessionTokenPayload** | [**MintSessionTokenPayload**](MintSessionTokenPayload.md) |  | 

### Return type

[**SessionTokenResponse**](SessionTokenResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pollDeviceCode**
```swift
    open class func pollDeviceCode(deviceCode: String, devicePollPayload: DevicePollPayload? = nil, completion: @escaping (_ data: PollDeviceCode200Response?, _ error: Error?) -> Void)
```

Poll for auth token

The second step of the device code flow. Call this repeatedly after showing the user code or QR code.  While the user hasn't confirmed yet, you'll get `{ status: \"pending\", interval }` — wait `interval` seconds and poll again. Once they approve, the response changes to `{ refreshToken, publicId, expiresAt }`. Store the `refreshToken` securely — it's your long-lived credential for all identity-tier calls.  **Polling interval:** the server sets it and repeats it in every pending answer; it grows the longer the code has been waiting, so always use the latest value. The SDKs do this for you. Stop polling when you receive a `refreshToken` or a `401` error.  A person can decline on their phone. Your next poll then returns `401` with `device-code-denied` straight away (and on every poll after, until the code expires), so you can say so on screen instead of waiting out the timeout. 

### Example
```swift
import Discovr


let deviceCode: String = "deviceCode_example" // The device code obtained from the request device code endpoint
let devicePollPayload: DevicePollPayload = DevicePollPayload(deviceId: "deviceId_example") // Send your `deviceId` so that signing in again on the same device replaces the credential it already held. The SDKs send it for you. The body is optional; with none, every sign-in is a credential of its own.  (optional)

AuthenticationAPI.pollDeviceCode(deviceCode: deviceCode, devicePollPayload: devicePollPayload) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceCode** | **String** | The device code obtained from the request device code endpoint | 
 **devicePollPayload** | [**DevicePollPayload**](DevicePollPayload.md) | Send your &#x60;deviceId&#x60; so that signing in again on the same device replaces the credential it already held. The SDKs send it for you. The body is optional; with none, every sign-in is a credential of its own.  | [optional] 

### Return type

[**PollDeviceCode200Response**](PollDeviceCode200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestDeviceCode**
```swift
    open class func requestDeviceCode(deviceCodePayload: DeviceCodePayload, size: Int? = nil, format: Format_requestDeviceCode? = nil, completion: @escaping (_ data: DeviceCodeResponse?, _ error: Error?) -> Void)
```

Request device code

Starts the TV / device sign-in flow. Call this to get a user code and QR code to display on screen. The user opens Discovr on their phone, scans the QR code or types the user code, and confirms sign-in. Once they do, your next poll to `/auth/device-codes/{deviceCode}/poll` returns a refresh token.  **Response format:** - `format=json` (default) — returns `{ deviceCode, userCode, authQRCode, verificationUrl, expiresIn, interval }`. The `authQRCode` is a base64 data URL — drop it straight into an `<img>` tag. Show `verificationUrl` next to the code so people who can't scan can type `userCode` there.  Keep `deviceCode` on the device. It is what you poll with, so it is never put in the QR code or shown to the person; the QR code and the screen carry only `userCode`. - `format=image` — returns a raw PNG binary. Handy if you're embedding the image directly without a data URL wrapper.  **QR code size:** Use the `size` parameter to match your display. TV screens benefit from larger codes (600–800 px). Default is 300 px. 

### Example
```swift
import Discovr


let deviceCodePayload: DeviceCodePayload = DeviceCodePayload(clientID: "clientID_example", demo: false) // 
let size: Int = 987 // QR code size in pixels. Larger sizes are recommended for TV displays. (optional) (default: 300)
let format: String = "format_example" // Response format. Use \"image\" for native clients to receive binary PNG directly. (optional) (default: .json)

AuthenticationAPI.requestDeviceCode(deviceCodePayload: deviceCodePayload, size: size, format: format) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceCodePayload** | [**DeviceCodePayload**](DeviceCodePayload.md) |  | 
 **size** | **Int** | QR code size in pixels. Larger sizes are recommended for TV displays. | [optional] [default to 300]
 **format** | **String** | Response format. Use \&quot;image\&quot; for native clients to receive binary PNG directly. | [optional] [default to .json]

### Return type

[**DeviceCodeResponse**](DeviceCodeResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, image/png

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **signOutSession**
```swift
    open class func signOutSession(completion: @escaping (_ data: SignOutSession200Response?, _ error: Error?) -> Void)
```

Sign out the current device

Signs out the current device by revoking the refresh token you send in the `Authorization` header. Other devices the user is signed into aren't affected — you can only sign out the current device from a third-party app.  Identity-tier calls using this token fail immediately after revocation. Any existing session tokens (valid for 30 minutes) remain usable until they naturally expire.  Works the same way for a demo session's refresh token — a demo sandbox is an ordinary account, so this is a quick way to end one early and test how your app handles it.  Using an SDK? Call `signOut()` instead — it wraps this endpoint and also clears the credentials stored on the device.  **Auth tier:** identity — send your refresh token in the `Authorization: Bearer` header. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]


Task {
    do {
        let result = try await discovr.signOutSession()
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**SignOutSession200Response**](SignOutSession200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **startDemoSession**
```swift
    open class func startDemoSession(demoSessionRequest: DemoSessionRequest, completion: @escaping (_ data: DemoSessionResponse?, _ error: Error?) -> Void)
```

Start a demo session

Gives you a working Discovr account in one call — no sign-up, no credentials, nothing to configure. Use it while you build: to explore the API, prototype against realistic data, or try requests right here in the docs. It's a development tool, not something to put in front of your users.  You get a private sandbox pre-loaded with profiles, watchlists, and viewing history, so recommendation rows are populated from the very first request. It behaves like any other account: writes really do save, and reading them back returns what you'd expect.  The response is a refresh token. From here you're on the normal path — call [`POST /auth/session-token`](/api-reference/discovr/mint-session-token) with a profile ID to start browsing. Nothing else about your integration changes, which is the point: code you write against a demo session works unchanged against a real one.  Two things to keep in mind: - **Sandboxes are temporary.** Yours lasts 30 minutes (you can ask for a shorter one with `ttlMs`, never a longer one) and everything in it is deleted afterwards. Once it has ended, requests made with its token fail with `401` `TOKEN_EXPIRED`. Don't build anything that expects it to still be there tomorrow. - **Sandboxes are rate limited.** You can start five per hour from the same network address, and that allowance is shared with the demo button on Discovr's sign-in screens and with a TV's device-code demo. When it runs out you get a `429` with a `Retry-After` header, so hold on to the token you're given rather than requesting a new one per request.  You do still need a `clientId` — the same one your SDK constructor already takes regardless of demo mode, so this asks nothing new of a real integration. Trying this endpoint directly from this page? Use `discovr-docs-playground`, a client id that's always available for exactly that.  It also powers the \"Continue as Demo\" button that Discovr's sign-in screens show to a client created with `demoMode`, which is meant for development builds.  **Auth tier:** none — this is the one endpoint you can call without a credential. 

### Example
```swift
import Discovr


let demoSessionRequest: DemoSessionRequest = DemoSessionRequest(clientId: "clientId_example", ttlMs: 123) // 

AuthenticationAPI.startDemoSession(demoSessionRequest: demoSessionRequest) { response, error in
    if let error = error {
        print(error)
        return
    }
    if let response = response {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **demoSessionRequest** | [**DemoSessionRequest**](DemoSessionRequest.md) |  | 

### Return type

[**DemoSessionResponse**](DemoSessionResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

