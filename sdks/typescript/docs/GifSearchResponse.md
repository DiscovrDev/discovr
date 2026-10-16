
# GifSearchResponse

Paginated GIF search results.

## Properties

Name | Type
------------ | -------------
`items` | [Array&lt;GifItem&gt;](GifItem.md)
`next` | string

## Example

```typescript
import type { GifSearchResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "items": null,
  "next": 1:20,
} satisfies GifSearchResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GifSearchResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


