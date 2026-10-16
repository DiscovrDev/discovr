
# SessionTokenResponse

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **sessionToken** | **kotlin.String** | Your session credential, valid for 30 minutes. Send it as the bearer in the &#x60;Authorization&#x60; header for all session-tier endpoints (&#x60;/pages/_*&#x60;, &#x60;/profile/_*&#x60;).  |  |
| **snapshotId** | **kotlin.String** | Identifies the set of recommendations the user is currently browsing. Keep it and send it back on your next call to this endpoint, so renewing their credential doesn&#39;t reshuffle what they&#39;re looking at.  Recommendations refresh roughly every 30 minutes; when they do, this value changes and pages come back re-ranked. Page IDs are unaffected.  |  |
| **expiresAt** | **kotlin.Long** | When the session token expires, as a Unix timestamp (seconds). |  |



