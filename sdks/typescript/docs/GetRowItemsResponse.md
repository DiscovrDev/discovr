
# GetRowItemsResponse

Paginated list of items within a row.

## Properties

Name | Type
------------ | -------------
`items` | [Array&lt;RowItem&gt;](RowItem.md)
`hasMore` | boolean
`nextPageToken` | string

## Example

```typescript
import type { GetRowItemsResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "items": null,
  "hasMore": null,
  "nextPageToken": null,
} satisfies GetRowItemsResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetRowItemsResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


