
# MediaAssetsTrailer

The best trailer or clip for this title, picked from the available videos — prefers official YouTube trailers, then teasers, then clips, then the first available video. `null` when no videos exist for this title. 

## Properties

Name | Type
------------ | -------------
`key` | string
`url` | string

## Example

```typescript
import type { MediaAssetsTrailer } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "key": 6ZfuNTqbHE8,
  "url": https://www.youtube.com/watch?v=6ZfuNTqbHE8,
} satisfies MediaAssetsTrailer

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaAssetsTrailer
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


