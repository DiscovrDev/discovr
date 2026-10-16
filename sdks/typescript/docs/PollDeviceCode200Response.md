
# PollDeviceCode200Response


## Properties

Name | Type
------------ | -------------
`refreshToken` | string
`publicId` | string
`expiresAt` | number
`status` | string
`interval` | number

## Example

```typescript
import type { PollDeviceCode200Response } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "refreshToken": rt_a1b2c3d4e5f6...,
  "publicId": MqXYz12abc,
  "expiresAt": 1733088000,
  "status": null,
  "interval": 10,
} satisfies PollDeviceCode200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PollDeviceCode200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


