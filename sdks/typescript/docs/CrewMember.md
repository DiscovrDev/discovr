
# CrewMember

A director, writer or creator of a title.

## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`job` | string
`profilePath` | { [key: string]: string; }

## Example

```typescript
import type { CrewMember } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": 9340,
  "name": Lana Wachowski,
  "job": Director,
  "profilePath": {w185=https://cdn.example.com/w185/fTE4gvedUe9xJRAdKUnCM09TkwZ.jpg, original=https://cdn.example.com/original/fTE4gvedUe9xJRAdKUnCM09TkwZ.jpg},
} satisfies CrewMember

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CrewMember
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


