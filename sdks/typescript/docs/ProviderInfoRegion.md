
# ProviderInfoRegion


## Properties

Name | Type
------------ | -------------
`englishName` | string
`nativeName` | string
`link` | string

## Example

```typescript
import type { ProviderInfoRegion } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "englishName": United States,
  "nativeName": United States,
  "link": https://example.com/movie/550/watch?locale=US,
} satisfies ProviderInfoRegion

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProviderInfoRegion
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


