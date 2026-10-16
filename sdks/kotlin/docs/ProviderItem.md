
# ProviderItem

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | **kotlin.String** | Unique identifier for the provider item |  |
| **title** | **kotlin.String** | Title of the provider (streaming service name) |  |
| **pageId** | **kotlin.String** | ID of the page this provider item links to |  |
| **paths** | **kotlin.collections.Map&lt;kotlin.String, kotlin.String&gt;** | Square Logo URLs in various resolutions (keys are resolution IDs like \&quot;60\&quot;, \&quot;100\&quot;, \&quot;512\&quot;, \&quot;1024\&quot;) |  |
| **ref** | **kotlin.String** | This tile&#39;s &#x60;page_id&#x60; with the place it was shown attached.  Prefer it over &#x60;page_id&#x60; when opening the page this tile links to. It resolves to the same page and sharpens the user&#39;s recommendations. Use it for the profile it was returned to.  A bare &#x60;page_id&#x60; always works; &#x60;ref&#x60; is never required.  |  [optional] |



