# ProviderItem

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | Unique identifier for the provider item | 
**title** | **String** | Title of the provider (streaming service name) | 
**pageId** | **String** | ID of the page this provider item links to | 
**ref** | **String** | This tile&#39;s &#x60;page_id&#x60; with the place it was shown attached.  Prefer it over &#x60;page_id&#x60; when opening the page this tile links to. It resolves to the same page and sharpens the user&#39;s recommendations. Use it for the profile it was returned to.  A bare &#x60;page_id&#x60; always works; &#x60;ref&#x60; is never required.  | [optional] 
**type** | [**ProviderItemType**](ProviderItemType.md) | Discriminator field indicating this is a provider item | 
**paths** | **[String: String]** | Square Logo URLs in various resolutions (keys are resolution IDs like \&quot;60\&quot;, \&quot;100\&quot;, \&quot;512\&quot;, \&quot;1024\&quot;) | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


