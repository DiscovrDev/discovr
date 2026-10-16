
# SimilarResponse

Paginated list of similar titles.

## Properties

Name | Type
------------ | -------------
`page` | number
`results` | [Array&lt;SimilarResult&gt;](SimilarResult.md)
`totalPages` | number
`totalResults` | number

## Example

```typescript
import type { SimilarResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "page": 1,
  "results": null,
  "totalPages": 10,
  "totalResults": 100,
} satisfies SimilarResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SimilarResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


