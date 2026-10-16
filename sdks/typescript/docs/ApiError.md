
# ApiError

An API error response. `error` is either a machine-readable code or a plain description of what went wrong. The SDKs translate the codes into typed errors, so most apps never read it directly.

## Properties

Name | Type
------------ | -------------
`error` | string

## Example

```typescript
import type { ApiError } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "error": device-code-expired,
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


