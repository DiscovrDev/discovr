
# DeleteProfileResponse

Confirmation that the profile was deleted.

## Properties

Name | Type
------------ | -------------
`message` | string

## Example

```typescript
import type { DeleteProfileResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "message": Profile deleted successfully,
} satisfies DeleteProfileResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DeleteProfileResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


