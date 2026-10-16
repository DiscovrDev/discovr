
# MintSessionTokenPayload

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **profileId** | **kotlin.String** | The ID of the profile to activate. Must belong to the signed-in user. |  |
| **ttlMs** | **kotlin.Int** | Override the session token&#39;s lifetime, in milliseconds. Can only shorten it below the default (30 minutes) — never lengthen it. Whether or not you send this, a session token never outlives the refresh token that minted it, so a demo sandbox&#39;s session token ends with the sandbox.  |  [optional] |
| **snapshotId** | **kotlin.String** | The &#x60;snapshotId&#x60; from your previous session token. Pass it to keep the user&#39;s recommendations where they were — renewing a session token is routine, and shouldn&#39;t reshuffle the screen underneath them.  Omit it on a first sign-in, or when switching profiles — there&#39;s nothing to carry over in either case. Recommendations refresh on their own roughly every 30 minutes.  |  [optional] |



