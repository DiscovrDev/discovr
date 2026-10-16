
# DemoSessionRequest

Starts a demo sandbox — a throwaway account, pre-populated, that needs no sign-up.

## Properties

Name | Type
------------ | -------------
`clientId` | string
`ttlMs` | number

## Example

```typescript
import type { DemoSessionRequest } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "clientId": discovr-docs-playground,
  "ttlMs": 120000,
} satisfies DemoSessionRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DemoSessionRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


