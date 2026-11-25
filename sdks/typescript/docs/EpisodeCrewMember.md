
# EpisodeCrewMember

A crew member credited on an episode.

## Properties

Name | Type
------------ | -------------
`tmdbId` | number
`name` | string
`job` | string
`department` | string
`profilePath` | { [key: string]: string; }

## Example

```typescript
import type { EpisodeCrewMember } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "tmdbId": 66633,
  "name": Vince Gilligan,
  "job": Director,
  "department": Directing,
  "profilePath": null,
} satisfies EpisodeCrewMember

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EpisodeCrewMember
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


