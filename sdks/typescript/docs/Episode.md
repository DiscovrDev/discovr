
# Episode

Details for a single TV episode.

## Properties

Name | Type
------------ | -------------
`episodeTmdbId` | number
`episodeNumber` | number
`name` | string
`overview` | string
`stillPath` | { [key: string]: string; }
`airDate` | Date
`runtime` | number
`seasonNumber` | number
`showId` | number
`productionCode` | string
`voteAverage` | number
`voteCount` | number
`crew` | Array&lt;object&gt;
`guestStars` | Array&lt;object&gt;

## Example

```typescript
import type { Episode } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "episodeTmdbId": 63056,
  "episodeNumber": 1,
  "name": Winter Is Coming,
  "overview": null,
  "stillPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "airDate": 2011-04-17,
  "runtime": 62,
  "seasonNumber": 1,
  "showId": 1396,
  "productionCode": null,
  "voteAverage": 9.1,
  "voteCount": 123,
  "crew": null,
  "guestStars": null,
} satisfies Episode

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Episode
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


