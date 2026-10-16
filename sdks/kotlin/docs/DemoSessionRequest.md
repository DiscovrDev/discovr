
# DemoSessionRequest

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **clientId** | **kotlin.String** | Your registered client id — the same one your SDK constructor already takes regardless of demo mode. Use &#x60;discovr-docs-playground&#x60; if you&#39;re trying this endpoint directly rather than through an app of your own.  |  |
| **ttlMs** | **kotlin.Int** | Override the sandbox&#39;s lifetime, in milliseconds. Can only shorten it below the default (30 minutes) — never lengthen it. Useful for testing how your app handles an expired session without waiting out the real interval.  |  [optional] |



