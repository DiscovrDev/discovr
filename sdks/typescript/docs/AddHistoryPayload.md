
# AddHistoryPayload

A watch history entry to record. For TV shows, `season` is required; `episode` is optional.

## Properties

Name | Type
------------ | -------------
`mediaId` | string
`updatedAt` | Date
`progress` | number
`season` | number
`episode` | number
`imported` | string

## Example

```typescript
import type { AddHistoryPayload } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "mediaId": TV_1396,
  "updatedAt": 2023-01-15T00:00:00.000Z,
  "progress": 45.5,
  "season": 1,
  "episode": 5,
  "imported": trakt,
} satisfies AddHistoryPayload

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AddHistoryPayload
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


