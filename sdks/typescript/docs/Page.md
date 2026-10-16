
# Page

A recommendation page containing rows of media titles. Its ID comes from its filters alone, so the same page keeps the same ID for every profile, on every device, indefinitely.

## Properties

Name | Type
------------ | -------------
`id` | string
`createdAt` | Date
`hero` | [Array&lt;HeroItem&gt;](HeroItem.md)
`name` | string

## Example

```typescript
import type { Page } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "createdAt": null,
  "hero": null,
  "name": null,
} satisfies Page

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Page
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


