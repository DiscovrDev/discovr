
# CastMember

One cast member of a title.

## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`character` | string
`profilePath` | { [key: string]: string; }

## Example

```typescript
import type { CastMember } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": 6384,
  "name": Keanu Reeves,
  "character": Neo,
  "profilePath": {w185=https://cdn.example.com/w185/8RZLOyYGsoRe9p44q3xin9QkMHv.jpg, original=https://cdn.example.com/original/8RZLOyYGsoRe9p44q3xin9QkMHv.jpg},
} satisfies CastMember

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CastMember
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


