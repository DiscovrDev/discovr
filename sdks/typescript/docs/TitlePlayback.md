
# TitlePlayback

The active profile\'s live resume position for an in-progress title.

## Properties

Name | Type
------------ | -------------
`progress` | number
`season` | number
`episode` | number
`updatedAt` | Date

## Example

```typescript
import type { TitlePlayback } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "progress": 45.5,
  "season": 2,
  "episode": 5,
  "updatedAt": 2026-01-15T20:00:00.000Z,
} satisfies TitlePlayback

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TitlePlayback
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


