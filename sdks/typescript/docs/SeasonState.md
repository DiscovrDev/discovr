
# SeasonState

Per-episode completion state for one TV season, plus whether the season as a whole is complete.

## Properties

Name | Type
------------ | -------------
`season` | number
`completed` | boolean
`episodes` | [Array&lt;SeasonEpisodeState&gt;](SeasonEpisodeState.md)

## Example

```typescript
import type { SeasonState } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "season": 1,
  "completed": false,
  "episodes": null,
} satisfies SeasonState

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SeasonState
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


