
# UpdateProfilePayload

Fields to update on the profile. All fields are optional — provide only what\'s changing. At least one must be present.

## Properties

Name | Type
------------ | -------------
`name` | string
`avatarUrl` | string
`avatarMediaType` | [AvatarMediaType](AvatarMediaType.md)

## Example

```typescript
import type { UpdateProfilePayload } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "name": Action Movie Fan,
  "avatarUrl": https://example.com/new-avatar.jpg,
  "avatarMediaType": null,
} satisfies UpdateProfilePayload

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateProfilePayload
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


