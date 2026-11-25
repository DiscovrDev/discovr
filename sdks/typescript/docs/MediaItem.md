
# MediaItem

A title in a row or the hero, with display metadata. The hero is a placement, not a type: its items are `MediaItem`s too.

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
`logoPath` | { [key: string]: string; }
`trailer` | [MediaItemTrailer](MediaItemTrailer.md)
`runtime` | number
`numberOfSeasons` | number
`type` | [MediaItemType](MediaItemType.md)
`ref` | string

## Example

```typescript
import type { MediaItem } from 'discovr'

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
  "logoPath": {w185=https://cdn.example.com/w185/wwemzKWzjKYJFfCeiB57q3r4Bcm.png, w500=https://cdn.example.com/w500/wwemzKWzjKYJFfCeiB57q3r4Bcm.png, original=https://cdn.example.com/original/wwemzKWzjKYJFfCeiB57q3r4Bcm.png},
  "trailer": null,
  "runtime": 139,
  "numberOfSeasons": 5,
  "type": null,
  "ref": MV_550@Lw2rC9sYh5TaB8kF,
} satisfies MediaItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


