
# NavigationItem

A tile that drills into another page rather than opening a title — a genre, a decade, a curated collection.

## Properties

Name | Type
------------ | -------------
`id` | string
`title` | string
`verticalPath` | { [key: string]: string; }
`horizontalPath` | { [key: string]: string; }
`pageId` | string
`ref` | string
`type` | [NavigationItemType](NavigationItemType.md)

## Example

```typescript
import type { NavigationItem } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "title": null,
  "verticalPath": {original=https://cdn.example.com/rows/keyword-nav-vertical.jpg, thumbnail=https://cdn.example.com/rows/keyword-nav-vertical-thumbnail.jpg},
  "horizontalPath": {original=https://cdn.example.com/rows/keyword-nav-horizontal.jpg, thumbnail=https://cdn.example.com/rows/keyword-nav-horizontal-thumbnail.jpg},
  "pageId": null,
  "ref": k7Qm2xR9pT@Ju4nE1oZd6XcV3gP,
  "type": null,
} satisfies NavigationItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as NavigationItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


