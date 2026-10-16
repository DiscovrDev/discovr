
# HistoryItem

A watch history entry. TV shows include season and episode.

## Properties

Name | Type
------------ | -------------
`id` | string
`ref` | string
`mediaType` | string
`title` | string
`posterPath` | { [key: string]: string; }
`backdropPath` | { [key: string]: string; }
`updatedAt` | Date
`progress` | number
`completed` | boolean
`watchedCount` | number
`season` | number
`episode` | number
`imported` | string
`createdAt` | Date

## Example

```typescript
import type { HistoryItem } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": TV_1396,
  "ref": TV_1396@Ae8sG5qRb2WmH9yL,
  "mediaType": tv,
  "title": Breaking Bad,
  "posterPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "backdropPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "updatedAt": 2023-01-15T00:00:00.000Z,
  "progress": 45.5,
  "completed": false,
  "watchedCount": 3,
  "season": 1,
  "episode": 5,
  "imported": trakt,
  "createdAt": 2023-01-01T00:00:00.000Z,
} satisfies HistoryItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as HistoryItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


