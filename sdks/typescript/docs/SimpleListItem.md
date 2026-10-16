
# SimpleListItem

A media item in a profile list, with its display metadata (title, poster, backdrop) and when it was added.

## Properties

Name | Type
------------ | -------------
`id` | string
`ref` | string
`mediaType` | string
`title` | string
`posterPath` | { [key: string]: string; }
`backdropPath` | { [key: string]: string; }
`createdAt` | Date

## Example

```typescript
import type { SimpleListItem } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": MV_550,
  "ref": MV_550@Pc1tD7vKj3NxU6eO,
  "mediaType": movie,
  "title": Fight Club,
  "posterPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "backdropPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "createdAt": 2023-01-01T00:00:00.000Z,
} satisfies SimpleListItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SimpleListItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


