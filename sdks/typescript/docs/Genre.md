
# Genre

A catalogue genre.

## Properties

Name | Type
------------ | -------------
`tmdbId` | number
`name` | string

## Example

```typescript
import type { Genre } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "tmdbId": null,
  "name": null,
} satisfies Genre

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Genre
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


