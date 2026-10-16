
# MediaResponseTvSeason


## Properties

Name | Type
------------ | -------------
`tmdbId` | number
`name` | string
`episodeCount` | number
`seasonNumber` | number
`airDate` | Date
`posterPath` | { [key: string]: string; }

## Example

```typescript
import type { MediaResponseTvSeason } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "tmdbId": null,
  "name": null,
  "episodeCount": null,
  "seasonNumber": null,
  "airDate": null,
  "posterPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
} satisfies MediaResponseTvSeason

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaResponseTvSeason
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


