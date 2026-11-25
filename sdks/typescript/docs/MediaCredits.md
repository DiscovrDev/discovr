
# MediaCredits

Who is in a title and who made it. Cast is the top-billed 15, in billing order. Crew is limited to directors and writers, plus a show\'s creators for TV.

## Properties

Name | Type
------------ | -------------
`cast` | [Array&lt;CastMember&gt;](CastMember.md)
`crew` | [Array&lt;CrewMember&gt;](CrewMember.md)

## Example

```typescript
import type { MediaCredits } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "cast": null,
  "crew": null,
} satisfies MediaCredits

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MediaCredits
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


