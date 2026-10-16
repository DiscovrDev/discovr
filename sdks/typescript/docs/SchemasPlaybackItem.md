
# SchemasPlaybackItem

A title the profile has started but not finished, with how far through they are.

## Properties

Name | Type
------------ | -------------
`mediaId` | string
`mediaType` | string
`createdAt` | Date
`progress` | number
`updatedAt` | Date
`season` | number
`episode` | number

## Example

```typescript
import type { SchemasPlaybackItem } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "mediaId": null,
  "mediaType": null,
  "createdAt": null,
  "progress": null,
  "updatedAt": null,
  "season": 2,
  "episode": 5,
} satisfies SchemasPlaybackItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SchemasPlaybackItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


