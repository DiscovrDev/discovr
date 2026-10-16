
# HistoryListResponse

Paginated list of watch history entries.

## Properties

Name | Type
------------ | -------------
`items` | [Array&lt;HistoryItem&gt;](HistoryItem.md)
`hasMore` | boolean
`nextPageToken` | string

## Example

```typescript
import type { HistoryListResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "items": null,
  "hasMore": true,
  "nextPageToken": null,
} satisfies HistoryListResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as HistoryListResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


