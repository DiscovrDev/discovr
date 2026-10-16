
# ScrobbleProgressBody

Body form of a progress report, for the route that already carries the title in its path.

## Properties

Name | Type
------------ | -------------
`progress` | number
`tv` | [ScrobbleTv](ScrobbleTv.md)

## Example

```typescript
import type { ScrobbleProgressBody } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "progress": 42.5,
  "tv": null,
} satisfies ScrobbleProgressBody

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ScrobbleProgressBody
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


