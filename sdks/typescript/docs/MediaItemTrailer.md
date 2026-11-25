
# MediaItemTrailer

The best trailer or clip for a title.

## Properties

Name | Type
------------ | -------------
`key` | string
`url` | string

## Example

```typescript
import type { MediaItemTrailer } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "key": 6ZfuNTqbHE8,
  "url": https://www.youtube.com/watch?v=6ZfuNTqbHE8,
} satisfies MediaItemTrailer

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaItemTrailer
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


