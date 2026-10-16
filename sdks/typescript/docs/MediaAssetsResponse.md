
# MediaAssetsResponse

Best-available poster, backdrop, logo, and trailer for a title — one resolved URL per asset type.

## Properties

Name | Type
------------ | -------------
`poster` | { [key: string]: string; }
`backdrop` | { [key: string]: string; }
`logo` | { [key: string]: string; }
`trailer` | [MediaAssetsTrailer](MediaAssetsTrailer.md)

## Example

```typescript
import type { MediaAssetsResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "poster": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "backdrop": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "logo": {w185=https://cdn.example.com/w185/wwemzKWzjKYJFfCeiB57q3r4Bcm.png, w500=https://cdn.example.com/w500/wwemzKWzjKYJFfCeiB57q3r4Bcm.png, original=https://cdn.example.com/original/wwemzKWzjKYJFfCeiB57q3r4Bcm.png},
  "trailer": null,
} satisfies MediaAssetsResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaAssetsResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


