
# CreateProfileResponse

Contains the ID of the newly created profile. Use it with `POST /auth/session-token` to start browsing.

## Properties

Name | Type
------------ | -------------
`profileId` | string

## Example

```typescript
import type { CreateProfileResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "profileId": profile_abc123xyz,
} satisfies CreateProfileResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateProfileResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


