
# FilterSpec

Filters that shape which titles appear in a page\'s rows. All filters are optional.

## Properties

Name | Type
------------ | -------------
`genres` | Array&lt;number&gt;
`keywords` | Array&lt;number&gt;
`mediaType` | string
`region` | Array&lt;string&gt;
`withRuntimeGte` | number
`withRuntimeLte` | number
`withReleaseDateGte` | Date
`withReleaseDateLte` | Date
`withWatchProviders` | Array&lt;string&gt;

## Example

```typescript
import type { FilterSpec } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "genres": null,
  "keywords": null,
  "mediaType": null,
  "region": null,
  "withRuntimeGte": null,
  "withRuntimeLte": null,
  "withReleaseDateGte": null,
  "withReleaseDateLte": null,
  "withWatchProviders": null,
} satisfies FilterSpec

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FilterSpec
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


