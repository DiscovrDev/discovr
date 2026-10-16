
# GifItem

A single animated GIF result.

## Properties

Name | Type
------------ | -------------
`id` | string
`url` | string
`preview` | [GifPreview](GifPreview.md)
`description` | string
`tags` | Array&lt;string&gt;
`width` | number
`height` | number
`createdAt` | Date

## Example

```typescript
import type { GifItem } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": 12345678,
  "url": https://static.klipy.com/example.gif,
  "preview": null,
  "description": Happy Dance,
  "tags": [happy, dance, celebration],
  "width": 498,
  "height": 498,
  "createdAt": 2024-01-15T10:30:00.000Z,
} satisfies GifItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GifItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


