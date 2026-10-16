
# SeasonDetailsResponse

Detailed information about a TV season, including its episodes.

## Properties

Name | Type
------------ | -------------
`showId` | string
`showTmdbId` | number
`tmdbInternalId` | string
`id` | number
`seasonTmdbId` | number
`name` | string
`overview` | string
`posterPath` | { [key: string]: string; }
`seasonNumber` | number
`airDate` | Date
`episodes` | [Array&lt;Episode&gt;](Episode.md)

## Example

```typescript
import type { SeasonDetailsResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "showId": TV_1396,
  "showTmdbId": 1396,
  "tmdbInternalId": 57599026c3a368369a000494,
  "id": 3572,
  "seasonTmdbId": 3572,
  "name": Season 1,
  "overview": null,
  "posterPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "seasonNumber": 1,
  "airDate": 2011-04-17,
  "episodes": null,
} satisfies SeasonDetailsResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SeasonDetailsResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


