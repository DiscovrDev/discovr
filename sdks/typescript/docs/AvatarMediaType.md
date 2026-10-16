
# AvatarMediaType

What kind of file `avatarUrl` points at, as a MIME type. Use it to choose between an image view and a video player, and to decide what can be animated, instead of guessing from the URL, since uploads have no file extension. `image/gif`, `video/mp4` and `video/webm` are animated; the others are still.  On a profile it is absent when the type couldn\'t be determined; treat that as a still image. When you create or update a profile it is optional: Discovr works it out from the URL\'s file extension, so send it only when your URL has none. It can only be sent together with `avatarUrl`, and changing `avatarUrl` replaces it (or clears it when the new URL can\'t be typed), so it never describes the previous picture. 

## Properties

Name | Type
------------ | -------------

## Example

```typescript
import type { AvatarMediaType } from 'discovr'

// TODO: Update the object below with actual values
const example = {
} satisfies AvatarMediaType

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AvatarMediaType
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


