
# GifPreview

A secondary rendition of a GIF — either a smaller animated preview for grids (`preview`) or a single still frame (`still`).

## Properties

Name | Type
------------ | -------------
`url` | string
`width` | number
`height` | number
`mediaType` | [AvatarMediaType](AvatarMediaType.md)

## Example

```typescript
import type { GifPreview } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "url": https://static.klipy.com/preview.gif,
  "width": 200,
  "height": 200,
  "mediaType": null,
} satisfies GifPreview

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GifPreview
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


