
# RateLimitedError

A `429` error body carrying `error: \"rate-limited\"` and the wait hint (`retryAfterSeconds`), mirroring the `Retry-After` header. 

## Properties

Name | Type
------------ | -------------
`error` | string
`retryAfterSeconds` | number

## Example

```typescript
import type { RateLimitedError } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "error": rate-limited,
  "retryAfterSeconds": 14,
} satisfies RateLimitedError

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RateLimitedError
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


