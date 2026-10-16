
# ProviderInfo

A streaming service and the regions where this title is available on it.

## Properties

Name | Type
------------ | -------------
`id` | string
`title` | string
`logos` | { [key: string]: string; }
`regions` | [{ [key: string]: ProviderInfoRegion; }](ProviderInfoRegion.md)

## Example

```typescript
import type { ProviderInfo } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": 119,
  "title": Amazon Prime Video,
  "logos": {60=https://is1-ssl.mzstatic.com/image/thumb/.../60x60bb.jpg, 100=https://is1-ssl.mzstatic.com/image/thumb/.../100x100bb.jpg, 512=https://is1-ssl.mzstatic.com/image/thumb/.../512x512bb.jpg, 1024=https://is1-ssl.mzstatic.com/image/thumb/.../1024x1024bb.png},
  "regions": null,
} satisfies ProviderInfo

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProviderInfo
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


