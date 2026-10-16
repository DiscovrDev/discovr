
# DeviceCodePayload

Request body for starting the device code flow.

## Properties

Name | Type
------------ | -------------
`clientID` | string
`demo` | boolean

## Example

```typescript
import type { DeviceCodePayload } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "clientID": abc123xyz,
  "demo": null,
} satisfies DeviceCodePayload

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DeviceCodePayload
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


