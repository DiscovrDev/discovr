
# ScrobbleResponse

Confirms a progress report, echoing what was recorded and whether it counted as watched.

## Properties

Name | Type
------------ | -------------
`status` | string
`progress` | number
`completed` | boolean

## Example

```typescript
import type { ScrobbleResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "status": ok,
  "progress": 85,
  "completed": true,
} satisfies ScrobbleResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ScrobbleResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


