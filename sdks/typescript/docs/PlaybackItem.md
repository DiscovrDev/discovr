
# PlaybackItem

A media item with playback progress. `progress` is 0–100.

## Properties

Name | Type
------------ | -------------
`id` | string
`ref` | string
`mediaType` | string
`title` | string
`posterPath` | { [key: string]: string; }
`backdropPath` | { [key: string]: string; }
`episodeImage` | { [key: string]: string; }
`episodeTitle` | string
`progress` | number
`updatedAt` | Date
`season` | number
`episode` | number
`createdAt` | Date

## Example

```typescript
import type { PlaybackItem } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": MV_550,
  "ref": MV_550@Zi9bF4wSm0QaT2hC,
  "mediaType": movie,
  "title": Fight Club,
  "posterPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "backdropPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "episodeImage": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "episodeTitle": Winter Is Coming,
  "progress": 45.5,
  "updatedAt": 2023-01-15T00:00:00.000Z,
  "season": 2,
  "episode": 5,
  "createdAt": 2023-01-01T00:00:00.000Z,
} satisfies PlaybackItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PlaybackItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


