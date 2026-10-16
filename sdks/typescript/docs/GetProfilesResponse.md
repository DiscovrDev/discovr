
# GetProfilesResponse

List of profiles for the signed-in user.

## Properties

Name | Type
------------ | -------------
`profiles` | [Array&lt;Profile&gt;](Profile.md)

## Example

```typescript
import type { GetProfilesResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "profiles": [{id=profile_abc123xyz, name=Sci-Fi Lover, avatarUrl=https://example.com/avatar.jpg, createdAt=2023-01-01T00:00:00.000Z}, {id=profile_def456uvw, name=Action Movie Fan, avatarUrl=https://example.com/avatar2.jpg, createdAt=2023-01-02T00:00:00.000Z}],
} satisfies GetProfilesResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetProfilesResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


