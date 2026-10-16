
# SimpleListResponse

Paginated list of items. Use `nextPageToken` with the `nextPageToken` query parameter to get the next page.

## Properties

Name | Type
------------ | -------------
`items` | [Array&lt;SimpleListItem&gt;](SimpleListItem.md)
`hasMore` | boolean
`nextPageToken` | string

## Example

```typescript
import type { SimpleListResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "items": null,
  "hasMore": true,
  "nextPageToken": null,
} satisfies SimpleListResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SimpleListResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


