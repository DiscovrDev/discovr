
# WebTokenPayload

Redeems the authorization code a web sign-in delivered to your app.

## Properties

Name | Type
------------ | -------------
`clientID` | string
`code` | string
`codeVerifier` | string

## Example

```typescript
import type { WebTokenPayload } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "clientID": abc123xyz,
  "code": Gh2kd9QpXw3LmN7vRtYa.k3J9xQmPz1VbT6uYhN4oWcE8sA2dF5gLrXiUqZjKvBeM,
  "codeVerifier": dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk,
} satisfies WebTokenPayload

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WebTokenPayload
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


