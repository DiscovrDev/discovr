
# AddPlaybackPayload

Playback progress to record. `progress` is 0–100. `updatedAt` is an ISO timestamp from the client — use the actual time of the progress update.

## Properties

Name | Type
------------ | -------------
`mediaId` | string
`progress` | number
`updatedAt` | Date

## Example

```typescript
import type { AddPlaybackPayload } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "mediaId": MV_550,
  "progress": 25.5,
  "updatedAt": 2023-01-15T00:00:00.000Z,
} satisfies AddPlaybackPayload

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AddPlaybackPayload
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


