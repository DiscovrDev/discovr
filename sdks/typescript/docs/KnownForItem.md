
# KnownForItem

A title a person is known for, returned alongside `person` search results.

## Properties

Name | Type
------------ | -------------
`id` | string
`ref` | string
`tmdbId` | number
`mediaType` | string
`title` | string
`name` | string
`overview` | string
`posterPath` | { [key: string]: string; }
`backdropPath` | { [key: string]: string; }
`releaseDate` | Date
`firstAirDate` | Date
`voteAverage` | number

## Example

```typescript
import type { KnownForItem } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": MV_872585,
  "ref": MV_872585@Hd3yW8cBn5JtK1aS,
  "tmdbId": 872585,
  "mediaType": null,
  "title": Oppenheimer,
  "name": null,
  "overview": null,
  "posterPath": null,
  "backdropPath": null,
  "releaseDate": null,
  "firstAirDate": null,
  "voteAverage": null,
} satisfies KnownForItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as KnownForItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


