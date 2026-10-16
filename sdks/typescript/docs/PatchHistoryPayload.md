
# PatchHistoryPayload

Updates the recorded progress for a title already in the profile\'s history.

## Properties

Name | Type
------------ | -------------
`progress` | number

## Example

```typescript
import type { PatchHistoryPayload } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "progress": 0,
} satisfies PatchHistoryPayload

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PatchHistoryPayload
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


