
# ProfileImagesResponse

Available avatar images for profile setup. All are still images.

## Properties

Name | Type
------------ | -------------
`nextToken` | string
`images` | Array&lt;string&gt;

## Example

```typescript
import type { ProfileImagesResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "nextToken": null,
  "images": [https://api.discovr.media/profile-images/profile-amber.png, https://api.discovr.media/profile-images/profile-sage.png, https://api.discovr.media/profile-images/profile-indigo.png],
} satisfies ProfileImagesResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProfileImagesResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


