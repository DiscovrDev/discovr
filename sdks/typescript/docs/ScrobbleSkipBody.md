
# ScrobbleSkipBody

Body form of a skip report, for the route that already carries the title in its path.

## Properties

Name | Type
------------ | -------------
`from` | number
`to` | number
`duration` | number
`tv` | [ScrobbleTv](ScrobbleTv.md)

## Example

```typescript
import type { ScrobbleSkipBody } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "from": 10,
  "to": 20,
  "duration": 20,
  "tv": null,
} satisfies ScrobbleSkipBody

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ScrobbleSkipBody
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


