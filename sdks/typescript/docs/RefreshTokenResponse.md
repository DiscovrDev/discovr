
# RefreshTokenResponse

Returned when a sign-in completes: the device code was confirmed, or a web sign-in\'s authorization code was redeemed. Store the `refreshToken` securely — it\'s your long-lived credential. Call `POST /auth/session-token` with a `profileId` to get a session token and start browsing. 

## Properties

Name | Type
------------ | -------------
`refreshToken` | string
`publicId` | string
`expiresAt` | number

## Example

```typescript
import type { RefreshTokenResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "refreshToken": rt_a1b2c3d4e5f6...,
  "publicId": MqXYz12abc,
  "expiresAt": 1733088000,
} satisfies RefreshTokenResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RefreshTokenResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


