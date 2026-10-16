
# SearchResponse

A page of search results.  There is no total result count — use `has_more` to page instead. 

## Properties

Name | Type
------------ | -------------
`page` | number
`results` | [Array&lt;SearchResult&gt;](SearchResult.md)
`hasMore` | boolean

## Example

```typescript
import type { SearchResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "page": 1,
  "results": null,
  "hasMore": true,
} satisfies SearchResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SearchResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


