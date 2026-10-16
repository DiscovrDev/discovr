
# CreatePagePayload

Optional filters to shape the recommendation page. Omit for a default page based on the profile\'s full taste history.

## Properties

Name | Type
------------ | -------------
`pageFilters` | [FilterSpec](FilterSpec.md)
`name` | string

## Example

```typescript
import type { CreatePagePayload } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "pageFilters": null,
  "name": null,
} satisfies CreatePagePayload

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreatePagePayload
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


