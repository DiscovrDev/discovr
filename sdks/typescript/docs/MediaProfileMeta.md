
# MediaProfileMeta

The current profile\'s interaction data for a title.

## Properties

Name | Type
------------ | -------------
`watchlist` | boolean
`liked` | boolean
`disliked` | boolean
`superLiked` | boolean
`playback` | [MediaProfileMetaPlayback](MediaProfileMetaPlayback.md)
`history` | boolean
`completed` | boolean
`completedSeasons` | Array&lt;number&gt;
`providers` | [Array&lt;ProviderInfo&gt;](ProviderInfo.md)

## Example

```typescript
import type { MediaProfileMeta } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "watchlist": null,
  "liked": null,
  "disliked": null,
  "superLiked": null,
  "playback": null,
  "history": null,
  "completed": null,
  "completedSeasons": null,
  "providers": null,
} satisfies MediaProfileMeta

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaProfileMeta
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


