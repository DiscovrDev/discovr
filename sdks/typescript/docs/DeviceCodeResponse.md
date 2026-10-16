
# DeviceCodeResponse

Contains the codes needed for device authentication. Display `userCode` on screen and use `authQRCode` as an image source. Returned when `format=json` (the default). With `format=image`, the response is a binary PNG instead. 

## Properties

Name | Type
------------ | -------------
`deviceCode` | string
`userCode` | string
`authQRCode` | string
`verificationUrl` | string
`expiresIn` | number
`interval` | number

## Example

```typescript
import type { DeviceCodeResponse } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "deviceCode": dvc_abc123xyz789,
  "userCode": 1234,
  "authQRCode": data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...,
  "verificationUrl": https://discovr.media/tv-auth,
  "expiresIn": 600000,
  "interval": 5,
} satisfies DeviceCodeResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DeviceCodeResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


