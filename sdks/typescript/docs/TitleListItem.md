
# TitleListItem

A title from a profile\'s rating, watchlist, or watch-history list, with display artwork and state summary.

## Properties

Name | Type
------------ | -------------
`id` | string
`ref` | string
`mediaType` | string
`title` | string
`posterPath` | { [key: string]: string; }
`backdropPath` | { [key: string]: string; }
`rating` | [Rating](Rating.md)
`watchlist` | boolean
`updatedAt` | Date
`completed` | boolean
`plays` | number
`season` | number
`episode` | number
`imported` | string

## Example

```typescript
import type { TitleListItem } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": MV_550,
  "ref": MV_550@Pc1tD7vKj3NxU6eO,
  "mediaType": movie,
  "title": Fight Club,
  "posterPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "backdropPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "rating": null,
  "watchlist": false,
  "updatedAt": 2026-01-15T20:00:00.000Z,
  "completed": true,
  "plays": 1,
  "season": 2,
  "episode": 5,
  "imported": trakt,
} satisfies TitleListItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TitleListItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


