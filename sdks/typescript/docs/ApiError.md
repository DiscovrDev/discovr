
# ApiError

An API error response. `error` is a machine-readable kebab-case code from `ApiErrorCode`; `message` is an optional developer-facing detail. The SDKs translate these codes into typed errors, so most apps never read the raw JSON.

## Properties

Name | Type
------------ | -------------
`error` | [ApiErrorCode](ApiErrorCode.md)
`message` | string
`retryAfterSeconds` | number
`tokenKind` | string
`expected` | string

## Example

```typescript
import type { ApiError } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "error": null,
  "message": null,
  "retryAfterSeconds": null,
  "tokenKind": null,
  "expected": null,
} satisfies ApiError

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiError
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


