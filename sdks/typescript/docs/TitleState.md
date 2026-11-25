
# TitleState

The active profile\'s complete state for a title — returned by `getTitleState` and by every title state write.

## Properties

Name | Type
------------ | -------------
`mediaId` | string
`mediaType` | string
`rating` | [Rating](Rating.md)
`watchlist` | boolean
`watched` | boolean
`completed` | boolean
`completedSeasons` | Array&lt;number&gt;
`episodes` | { [key: string]: Array&lt;number&gt;; }
`plays` | number
`playback` | [TitlePlayback](TitlePlayback.md)
`providers` | [Array&lt;ProviderInfo&gt;](ProviderInfo.md)

## Example

```typescript
import type { TitleState } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "mediaId": TV_1396,
  "mediaType": tv,
  "rating": null,
  "watchlist": true,
  "watched": true,
  "completed": false,
  "completedSeasons": [1, 2],
  "episodes": {1=[1, 2, 3, 4, 5, 6, 7]},
  "plays": 7,
  "playback": null,
  "providers": null,
} satisfies TitleState

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TitleState
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


