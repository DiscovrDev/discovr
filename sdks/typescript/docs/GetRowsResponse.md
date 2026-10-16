
# GetRowsResponse

Paginated list of rows for the page.

## Properties

Name | Type
------------ | -------------
`rows` | [Array&lt;Row&gt;](Row.md)
`hasMore` | boolean
`nextPageToken` | string

## Example

```typescript
import type { GetRowsResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "rows": null,
  "hasMore": null,
  "nextPageToken": null,
} satisfies GetRowsResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetRowsResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


