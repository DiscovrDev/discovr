
# SimilarResult

A title that\'s similar to the requested media.

## Properties

Name | Type
------------ | -------------
`id` | string
`ref` | string
`tmdbId` | number
`mediaType` | string
`title` | string
`name` | string
`originalTitle` | string
`originalName` | string
`overview` | string
`posterPath` | { [key: string]: string; }
`backdropPath` | { [key: string]: string; }
`releaseDate` | Date
`firstAirDate` | Date
`popularity` | number
`voteAverage` | number
`voteCount` | number

## Example

```typescript
import type { SimilarResult } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": TV_1396,
  "ref": TV_1396@Vb6pN0uXe4GqM7zD,
  "tmdbId": 1396,
  "mediaType": null,
  "title": null,
  "name": null,
  "originalTitle": null,
  "originalName": null,
  "overview": null,
  "posterPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "backdropPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "releaseDate": null,
  "firstAirDate": null,
  "popularity": null,
  "voteAverage": null,
  "voteCount": null,
} satisfies SimilarResult

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SimilarResult
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


