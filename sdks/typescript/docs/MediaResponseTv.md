
# MediaResponseTv

TV show details — only present when `media_type` is `tv`.

## Properties

Name | Type
------------ | -------------
`id` | string
`tmdbId` | number
`name` | string
`originalName` | string
`overview` | string
`posterPath` | { [key: string]: string; }
`backdropPath` | { [key: string]: string; }
`firstAirDate` | Date
`lastAirDate` | Date
`numberOfEpisodes` | number
`numberOfSeasons` | number
`voteAverage` | number
`voteCount` | number
`popularity` | number
`genres` | [Array&lt;MediaResponseTvGenre&gt;](MediaResponseTvGenre.md)
`tagline` | string
`status` | string
`homepage` | string
`inProduction` | boolean
`seasons` | [Array&lt;MediaResponseTvSeason&gt;](MediaResponseTvSeason.md)

## Example

```typescript
import type { MediaResponseTv } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "tmdbId": null,
  "name": null,
  "originalName": null,
  "overview": null,
  "posterPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "backdropPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "firstAirDate": null,
  "lastAirDate": null,
  "numberOfEpisodes": null,
  "numberOfSeasons": null,
  "voteAverage": null,
  "voteCount": null,
  "popularity": null,
  "genres": null,
  "tagline": null,
  "status": null,
  "homepage": null,
  "inProduction": null,
  "seasons": null,
} satisfies MediaResponseTv

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaResponseTv
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


