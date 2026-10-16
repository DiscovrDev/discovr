
# MediaResponse

Full details for a movie or TV show.

## Properties

Name | Type
------------ | -------------
`id` | string
`mediaType` | string
`movie` | [MediaResponseMovie](MediaResponseMovie.md)
`tv` | [MediaResponseTv](MediaResponseTv.md)
`watchProviders` | [Array&lt;ProviderInfo&gt;](ProviderInfo.md)

## Example

```typescript
import type { MediaResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "mediaType": null,
  "movie": null,
  "tv": null,
  "watchProviders": null,
} satisfies MediaResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


