
# CreatePageResponse

The page\'s ID and the filters it stands for. Pass the `id` to `GET /pages/{pageId}` or `GET /pages/{pageId}/rows`.

## Properties

Name | Type
------------ | -------------
`id` | string
`pageFilters` | [FilterSpec](FilterSpec.md)

## Example

```typescript
import type { CreatePageResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "pageFilters": null,
} satisfies CreatePageResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreatePageResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


