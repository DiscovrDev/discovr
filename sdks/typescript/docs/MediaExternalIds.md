
# MediaExternalIds

The title\'s identifiers on other services, for deep links and cross-referencing.

## Properties

Name | Type
------------ | -------------
`imdbId` | string
`tvdbId` | number

## Example

```typescript
import type { MediaExternalIds } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "imdbId": tt0133093,
  "tvdbId": 81189,
} satisfies MediaExternalIds

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaExternalIds
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


