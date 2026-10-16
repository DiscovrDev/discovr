
# SeasonProfileMetaEpisode

Whether the current profile has finished a single episode.

## Properties

Name | Type
------------ | -------------
`episode` | number
`completed` | boolean

## Example

```typescript
import type { SeasonProfileMetaEpisode } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "episode": 5,
  "completed": null,
} satisfies SeasonProfileMetaEpisode

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SeasonProfileMetaEpisode
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


