
# AddSimpleListItemPayload

The media item to add. Use the full Discovr media ID — `MV_<id>` for movies, `TV_<id>` for TV shows.

## Properties

Name | Type
------------ | -------------
`mediaId` | string

## Example

```typescript
import type { AddSimpleListItemPayload } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "mediaId": MV_550,
} satisfies AddSimpleListItemPayload

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AddSimpleListItemPayload
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


