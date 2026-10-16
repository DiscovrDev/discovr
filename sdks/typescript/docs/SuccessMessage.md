
# SuccessMessage

Confirmation response with the action taken. For exclusive lists (liked/disliked/super_liked), also includes `added` (which list the item was added to) and optionally `removed` (which list it was removed from).

## Properties

Name | Type
------------ | -------------
`message` | string
`added` | string
`removed` | string

## Example

```typescript
import type { SuccessMessage } from 'discovr'

// TODO: Update the object below with actual values
const example = {
  "message": Item added successfully,
  "added": liked,
  "removed": disliked,
} satisfies SuccessMessage

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SuccessMessage
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


