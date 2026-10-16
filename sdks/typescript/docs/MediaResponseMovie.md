
# MediaResponseMovie

Movie details — only present when `media_type` is `movie`.

## Properties

Name | Type
------------ | -------------
`id` | string
`tmdbId` | number
`title` | string
`originalTitle` | string
`overview` | string
`posterPath` | { [key: string]: string; }
`backdropPath` | { [key: string]: string; }
`releaseDate` | Date
`runtime` | number
`voteAverage` | number
`voteCount` | number
`popularity` | number
`genres` | [Array&lt;MediaResponseMovieGenre&gt;](MediaResponseMovieGenre.md)
`tagline` | string
`status` | string
`budget` | number
`revenue` | number
`homepage` | string
`imdbId` | string

## Example

```typescript
import type { MediaResponseMovie } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "tmdbId": null,
  "title": null,
  "originalTitle": null,
  "overview": null,
  "posterPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "backdropPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "releaseDate": null,
  "runtime": null,
  "voteAverage": null,
  "voteCount": null,
  "popularity": null,
  "genres": null,
  "tagline": null,
  "status": null,
  "budget": null,
  "revenue": null,
  "homepage": null,
  "imdbId": null,
} satisfies MediaResponseMovie

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaResponseMovie
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


