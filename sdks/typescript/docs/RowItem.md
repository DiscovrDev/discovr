
# RowItem

A row item can be a MediaItem, NavigationItem, or ProviderItem. Use the `type` field to determine which type it is: - `type: \"media\"` indicates a MediaItem (has `media_type` field) - `type: \"navigation\"` indicates a NavigationItem (has `page_id` field) - `type: \"provider\"` indicates a ProviderItem (has `paths` field with resolution URLs) 

## Properties

Name | Type
------------ | -------------
`id` | string
`title` | string
`overview` | string
`posterPath` | { [key: string]: string; }
`backdropPath` | { [key: string]: string; }
`mediaType` | string
`year` | number
`rating` | number
`genres` | Array&lt;string&gt;
`type` | [ProviderItemType](ProviderItemType.md)
`ref` | string
`verticalPath` | { [key: string]: string; }
`horizontalPath` | { [key: string]: string; }
`pageId` | string
`paths` | { [key: string]: string; }

## Example

```typescript
import type { RowItem } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "title": null,
  "overview": null,
  "posterPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "backdropPath": {w185=https://cdn.example.com/w185/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, w500=https://cdn.example.com/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg, original=https://cdn.example.com/original/kqjL17yufvn9OVLyXYpvtyrFfak.jpg},
  "mediaType": null,
  "year": 1999,
  "rating": 8.4,
  "genres": [Drama, Thriller],
  "type": null,
  "ref": k7Qm2xR9pT@Ju4nE1oZd6XcV3gP,
  "verticalPath": {original=https://cdn.example.com/rows/keyword-nav-vertical.jpg, thumbnail=https://cdn.example.com/rows/keyword-nav-vertical-thumbnail.jpg},
  "horizontalPath": {original=https://cdn.example.com/rows/keyword-nav-horizontal.jpg, thumbnail=https://cdn.example.com/rows/keyword-nav-horizontal-thumbnail.jpg},
  "pageId": null,
  "paths": {60=https://is1-ssl.mzstatic.com/image/thumb/.../60x60bb.jpg, 100=https://is1-ssl.mzstatic.com/image/thumb/.../100x100bb.jpg, 512=https://is1-ssl.mzstatic.com/image/thumb/.../512x512bb.jpg, 1024=https://is1-ssl.mzstatic.com/image/thumb/.../1024x1024bb.png},
} satisfies RowItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RowItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


