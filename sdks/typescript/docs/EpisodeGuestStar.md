
# EpisodeGuestStar

A guest actor credited on an episode.

## Properties

Name | Type
------------ | -------------
`tmdbId` | number
`name` | string
`character` | string
`order` | number
`profilePath` | { [key: string]: string; }

## Example

```typescript
import type { EpisodeGuestStar } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "tmdbId": 14329,
  "name": John Koyama,
  "character": Emilio Koyama,
  "order": 1,
  "profilePath": null,
} satisfies EpisodeGuestStar

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EpisodeGuestStar
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


