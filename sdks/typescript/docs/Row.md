
# Row

A single row within a page — a labeled group of media items with display info and pagination cursor.

## Properties

Name | Type
------------ | -------------
`id` | string
`title` | string
`pageId` | string
`type` | [RowType](RowType.md)
`index` | number
`createdAt` | Date

## Example

```typescript
import type { Row } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "title": null,
  "pageId": null,
  "type": null,
  "index": null,
  "createdAt": null,
} satisfies Row

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Row
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


