# ProfilesApi

All URIs are relative to *https://api.discovr.media*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**createProfile**](ProfilesApi.md#createProfile) | **POST** /profiles | Create a profile |
| [**deleteProfile**](ProfilesApi.md#deleteProfile) | **DELETE** /profiles/{profileId} | Delete a profile |
| [**getProfile**](ProfilesApi.md#getProfile) | **GET** /profiles/{profileId} | Get a profile |
| [**getProfiles**](ProfilesApi.md#getProfiles) | **GET** /profiles | List profiles |
| [**updateProfile**](ProfilesApi.md#updateProfile) | **PATCH** /profiles/{profileId} | Update a profile |


<a id="createProfile"></a>
# **createProfile**
> CreateProfileResponse createProfile(createProfilePayload)

Create a profile

Creates a new profile for the signed-in user. Provide a display name and an avatar URL.  On success you&#39;ll get back a &#x60;profileId&#x60;. Use that ID with &#x60;POST /auth/session-token&#x60; to mint a session token and start browsing recommendations for this profile. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfilesApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val createProfilePayload : CreateProfilePayload = {"name":"Sci-Fi Lover","avatarUrl":"https://example.com/avatar.jpg"} // CreateProfilePayload | 
try {
    val result : CreateProfileResponse = discovr.createProfile(createProfilePayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfilesApi#createProfile")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfilesApi#createProfile")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **createProfilePayload** | [**CreateProfilePayload**](CreateProfilePayload.md)|  | |

### Return type

[**CreateProfileResponse**](CreateProfileResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="deleteProfile"></a>
# **deleteProfile**
> DeleteProfileResponse deleteProfile(profileId)

Delete a profile

Permanently deletes the profile. This action can&#39;t be undone.  Deleting an account&#39;s only profile is allowed. The account then has no profiles and can&#39;t mint a session token until a new one is created — see [Handle zero profiles](/guides/profiles/listing-and-selecting-profiles). Returns 404 if the profile doesn&#39;t exist or doesn&#39;t belong to the signed-in user. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfilesApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val profileId : kotlin.String = profile_abc123xyz // kotlin.String | The ID of the profile to delete.
try {
    val result : DeleteProfileResponse = discovr.deleteProfile(profileId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfilesApi#deleteProfile")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfilesApi#deleteProfile")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **profileId** | **kotlin.String**| The ID of the profile to delete. | |

### Return type

[**DeleteProfileResponse**](DeleteProfileResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getProfile"></a>
# **getProfile**
> Profile getProfile(profileId)

Get a profile

Returns a single profile by ID. Returns 404 if the profile doesn&#39;t exist or doesn&#39;t belong to the signed-in user. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfilesApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val profileId : kotlin.String = profile_abc123xyz // kotlin.String | The ID of the profile to retrieve.
try {
    val result : Profile = discovr.getProfile(profileId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfilesApi#getProfile")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfilesApi#getProfile")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **profileId** | **kotlin.String**| The ID of the profile to retrieve. | |

### Return type

[**Profile**](Profile.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getProfiles"></a>
# **getProfiles**
> GetProfilesResponse getProfiles()

List profiles

Returns the signed-in user&#39;s profiles, newest first. Each one carries its ID, display name, avatar URL, and creation timestamp.  A profile that can&#39;t be read is left out of the response rather than failing it, so a single bad profile never costs the user their whole picker. Treat the list as complete for display purposes, and don&#39;t assume a missing profile means it was deleted.  **Auth tier:** identity — send your refresh token in the &#x60;Authorization: Bearer&#x60; header. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfilesApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

try {
    val result : GetProfilesResponse = discovr.getProfiles()
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfilesApi#getProfiles")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfilesApi#getProfiles")
    e.printStackTrace()
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**GetProfilesResponse**](GetProfilesResponse.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="updateProfile"></a>
# **updateProfile**
> Profile updateProfile(profileId, updateProfilePayload)

Update a profile

Updates a profile&#39;s name, avatar URL, or both. Provide only the fields you want to change — omitted fields stay as-is.  Returns the updated profile object. Returns 404 if the profile doesn&#39;t exist or doesn&#39;t belong to the signed-in user. 

### Example
```kotlin
// Import classes:
//import api.discovr.infrastructure.*
//import api.discovr.models.*
import api.discovr.DiscovrClient

// Initialize DiscovrClient (public entry point)
val discovr = DiscovrClient(clientId = "your-client-id", storage = yourAuthStorageImpl)
// Or manually: val discovr = ProfilesApi(ApiConfig(basePath = "https://api.discovr.media").apply { accessToken = "YOUR TOKEN" })

val profileId : kotlin.String = profile_abc123xyz // kotlin.String | The ID of the profile to update.
val updateProfilePayload : UpdateProfilePayload = {"name":"Action Movie Fan","avatarUrl":"https://example.com/new-avatar.jpg"} // UpdateProfilePayload | 
try {
    val result : Profile = discovr.updateProfile(profileId, updateProfilePayload)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ProfilesApi#updateProfile")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ProfilesApi#updateProfile")
    e.printStackTrace()
}
```

### Parameters
| **profileId** | **kotlin.String**| The ID of the profile to update. | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **updateProfilePayload** | [**UpdateProfilePayload**](UpdateProfilePayload.md)|  | |

### Return type

[**Profile**](Profile.md)

### Authorization


Configure BearerAuth:
    ApiClient.accessToken = ""

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

