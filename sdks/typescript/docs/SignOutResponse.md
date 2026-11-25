
# SignOutResponse

Confirms the refresh token you sent has been revoked.

## Properties

Name | Type
------------ | -------------
`revoked` | boolean

## Example

```typescript
import type { SignOutResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "revoked": true,
} satisfies SignOutResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SignOutResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


