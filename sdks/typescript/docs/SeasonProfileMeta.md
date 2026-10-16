
# SeasonProfileMeta

The current profile\'s state for a TV season — which episodes it has finished, plus the season\'s own aggregate completion state.

## Properties

Name | Type
------------ | -------------
`season` | number
`completed` | boolean
`episodes` | [Array&lt;SeasonProfileMetaEpisode&gt;](SeasonProfileMetaEpisode.md)

## Example

```typescript
import type { SeasonProfileMeta } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "season": 1,
  "completed": null,
  "episodes": null,
} satisfies SeasonProfileMeta

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SeasonProfileMeta
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


