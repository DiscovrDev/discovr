
# RateLimitedError

A `429` body. Same shape as `ApiError` plus the wait hint, which `ApiError` can\'t carry because it forbids extra properties — a strict validator would reject the very body every limiter sends. 

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
  "error": RATE_LIMITED,
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


