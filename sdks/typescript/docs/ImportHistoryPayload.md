
# ImportHistoryPayload

A watch history entry to import from an external source.

## Properties

Name | Type
------------ | -------------
`mediaId` | string
`imported` | string
`updatedAt` | Date
`season` | number
`episode` | number

## Example

```typescript
import type { ImportHistoryPayload } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "mediaId": TV_1396,
  "imported": trakt,
  "updatedAt": 2023-01-15T20:00:00.000Z,
  "season": 1,
  "episode": 5,
} satisfies ImportHistoryPayload

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ImportHistoryPayload
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


