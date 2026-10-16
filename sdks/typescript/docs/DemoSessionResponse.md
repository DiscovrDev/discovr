
# DemoSessionResponse

A refresh token for a freshly created demo sandbox.

## Properties

Name | Type
------------ | -------------
`refreshToken` | string
`expiresAt` | number

## Example

```typescript
import type { DemoSessionResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "refreshToken": rt_9f8c2a1b4d6e...,
  "expiresAt": 1733091000,
} satisfies DemoSessionResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DemoSessionResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


