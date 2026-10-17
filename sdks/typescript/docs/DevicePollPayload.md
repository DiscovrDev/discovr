
# DevicePollPayload

Optional body of a device-code poll.

## Properties

Name | Type
------------ | -------------
`deviceId` | string

## Example

```typescript
import type { DevicePollPayload } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "deviceId": 7f3a91c2d4e85b60a1c97e24f8d03b5a,
} satisfies DevicePollPayload

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DevicePollPayload
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


