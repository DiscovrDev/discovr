
# ApiError

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **error** | **kotlin.String** | Why the request failed. Authentication endpoints return one of these codes: &#x60;session-expired&#x60;, &#x60;session-already-consumed&#x60;, &#x60;session-not-found&#x60;, &#x60;client-not-found&#x60;, &#x60;client-mismatch&#x60;, &#x60;device-code-not-found&#x60;, &#x60;device-code-expired&#x60;, &#x60;device-code-already-consumed&#x60;, &#x60;device-code-denied&#x60;, &#x60;code-verifier-invalid&#x60;, &#x60;token-invalid&#x60;. Other endpoints return a plain description.  |  |



