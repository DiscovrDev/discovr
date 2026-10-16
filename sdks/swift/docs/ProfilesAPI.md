# ProfilesAPI

All URIs are relative to *https://api.discovr.media*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createProfile**](ProfilesAPI.md#createprofile) | **POST** /profiles | Create a profile
[**deleteProfile**](ProfilesAPI.md#deleteprofile) | **DELETE** /profiles/{profileId} | Delete a profile
[**getProfile**](ProfilesAPI.md#getprofile) | **GET** /profiles/{profileId} | Get a profile
[**getProfiles**](ProfilesAPI.md#getprofiles) | **GET** /profiles | List profiles
[**updateProfile**](ProfilesAPI.md#updateprofile) | **PATCH** /profiles/{profileId} | Update a profile


# **createProfile**
```swift
    open class func createProfile(createProfilePayload: CreateProfilePayload, completion: @escaping (_ data: CreateProfileResponse?, _ error: Error?) -> Void)
```

Create a profile

Creates a new profile for the signed-in user. Provide a display name and an avatar URL.  On success you'll get back a `profileId`. Use that ID with `POST /auth/session-token` to mint a session token and start browsing recommendations for this profile. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let createProfilePayload: CreateProfilePayload = CreateProfilePayload(name: "name_example", avatarUrl: "avatarUrl_example", avatarMediaType: AvatarMediaType()) // 

Task {
    do {
        let result = try await discovr.createProfile(createProfilePayload: createProfilePayload)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createProfilePayload** | [**CreateProfilePayload**](CreateProfilePayload.md) |  | 

### Return type

[**CreateProfileResponse**](CreateProfileResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteProfile**
```swift
    open class func deleteProfile(profileId: String, completion: @escaping (_ data: DeleteProfileResponse?, _ error: Error?) -> Void)
```

Delete a profile

Permanently deletes the profile. This action can't be undone.  Deleting an account's only profile is allowed. The account then has no profiles and can't mint a session token until a new one is created — see [Handle zero profiles](/guides/profiles/listing-and-selecting-profiles). Returns 404 if the profile doesn't exist or doesn't belong to the signed-in user. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let profileId: String = "profileId_example" // The ID of the profile to delete.

Task {
    do {
        let result = try await discovr.deleteProfile(profileId: profileId)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **profileId** | **String** | The ID of the profile to delete. | 

### Return type

[**DeleteProfileResponse**](DeleteProfileResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProfile**
```swift
    open class func getProfile(profileId: String, completion: @escaping (_ data: Profile?, _ error: Error?) -> Void)
```

Get a profile

Returns a single profile by ID. Returns 404 if the profile doesn't exist or doesn't belong to the signed-in user. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let profileId: String = "profileId_example" // The ID of the profile to retrieve.

Task {
    do {
        let result = try await discovr.getProfile(profileId: profileId)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **profileId** | **String** | The ID of the profile to retrieve. | 

### Return type

[**Profile**](Profile.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProfiles**
```swift
    open class func getProfiles(completion: @escaping (_ data: GetProfilesResponse?, _ error: Error?) -> Void)
```

List profiles

Returns the signed-in user's profiles, newest first. Each one carries its ID, display name, avatar URL, and creation timestamp.  A profile that can't be read is left out of the response rather than failing it, so a single bad profile never costs the user their whole picker. Treat the list as complete for display purposes, and don't assume a missing profile means it was deleted.  **Auth tier:** identity — send your refresh token in the `Authorization: Bearer` header. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]


Task {
    do {
        let result = try await discovr.getProfiles()
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**GetProfilesResponse**](GetProfilesResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateProfile**
```swift
    open class func updateProfile(profileId: String, updateProfilePayload: UpdateProfilePayload, completion: @escaping (_ data: Profile?, _ error: Error?) -> Void)
```

Update a profile

Updates a profile's name, avatar URL, or both. Provide only the fields you want to change — omitted fields stay as-is.  Returns the updated profile object. Returns 404 if the profile doesn't exist or doesn't belong to the signed-in user. 

### Example
```swift
import Discovr

// Initialize DiscovrClient (public entry point)
let discovr = DiscovrClient(clientId: "your-client-id")
// Or manually configure: DiscovrAPI.customHeaders = ["Authorization": "Bearer YOUR TOKEN"]

let profileId: String = "profileId_example" // The ID of the profile to update.
let updateProfilePayload: UpdateProfilePayload = UpdateProfilePayload(name: "name_example", avatarUrl: "avatarUrl_example", avatarMediaType: AvatarMediaType()) // 

Task {
    do {
        let result = try await discovr.updateProfile(profileId: profileId, updateProfilePayload: updateProfilePayload)
        dump(result)
    } catch {
        print(error)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **profileId** | **String** | The ID of the profile to update. | 
 **updateProfilePayload** | [**UpdateProfilePayload**](UpdateProfilePayload.md) |  | 

### Return type

[**Profile**](Profile.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

