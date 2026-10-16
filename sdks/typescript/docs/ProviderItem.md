
# ProviderItem

A tile for a streaming service, drilling into what\'s available on it.

## Properties

Name | Type
------------ | -------------
`id` | string
`title` | string
`pageId` | string
`ref` | string
`type` | [ProviderItemType](ProviderItemType.md)
`paths` | { [key: string]: string; }

## Example

```typescript
import type { ProviderItem } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "title": null,
  "pageId": null,
  "ref": k7Qm2xR9pT@Ju4nE1oZd6XcV3gP,
  "type": null,
  "paths": {60=https://is1-ssl.mzstatic.com/image/thumb/.../60x60bb.jpg, 100=https://is1-ssl.mzstatic.com/image/thumb/.../100x100bb.jpg, 512=https://is1-ssl.mzstatic.com/image/thumb/.../512x512bb.jpg, 1024=https://is1-ssl.mzstatic.com/image/thumb/.../1024x1024bb.png},
} satisfies ProviderItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProviderItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


