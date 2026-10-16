
# ScrobbleProgressPayload

Reports how far through a title the viewer is. Send this as the user watches.

## Properties

Name | Type
------------ | -------------
`mediaId` | string
`progress` | number
`tv` | [ScrobbleTv](ScrobbleTv.md)

## Example

```typescript
import type { ScrobbleProgressPayload } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "mediaId": TV_1396,
  "progress": 42.5,
  "tv": null,
} satisfies ScrobbleProgressPayload

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ScrobbleProgressPayload
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


