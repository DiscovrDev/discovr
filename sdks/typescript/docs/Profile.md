
# Profile

A Discovr profile with its display info and creation timestamp.

## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`avatarUrl` | string
`avatarMediaType` | [AvatarMediaType](AvatarMediaType.md)
`createdAt` | Date

## Example

```typescript
import type { Profile } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "id": profile_abc123xyz,
  "name": Sci-Fi Lover,
  "avatarUrl": https://example.com/avatar.jpg,
  "avatarMediaType": null,
  "createdAt": 2023-01-01T00:00:00.000Z,
} satisfies Profile

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Profile
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


