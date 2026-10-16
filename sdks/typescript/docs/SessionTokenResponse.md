
# SessionTokenResponse

The session token scoped to the selected profile. Valid for 30 minutes.

## Properties

Name | Type
------------ | -------------
`sessionToken` | string
`snapshotId` | string
`expiresAt` | number

## Example

```typescript
import type { SessionTokenResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "sessionToken": sess_4f9c1a7e2b...,
  "snapshotId": Wm4rT9xKq2Lv7BnD,
  "expiresAt": 1733091000,
} satisfies SessionTokenResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionTokenResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


