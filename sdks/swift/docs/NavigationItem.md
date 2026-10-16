# NavigationItem

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | Unique identifier for the navigation item | 
**title** | **String** | Title of the navigation item | 
**verticalPath** | **[String: String]** | Vertical tile image URLs keyed by size: &#x60;original&#x60; (800×1200) and &#x60;thumbnail&#x60; (400×600), pre-rendered at build time.  | [optional] 
**horizontalPath** | **[String: String]** | Horizontal tile image URLs keyed by size: &#x60;original&#x60; (1080×608) and &#x60;thumbnail&#x60; (540×304), pre-rendered at build time.  | [optional] 
**pageId** | **String** | ID of the page this navigation item links to | 
**ref** | **String** | This tile&#39;s &#x60;page_id&#x60; with the place it was shown attached.  Prefer it over &#x60;page_id&#x60; when opening the page this tile links to. It resolves to the same page and sharpens the user&#39;s recommendations. Use it for the profile it was returned to.  A bare &#x60;page_id&#x60; always works; &#x60;ref&#x60; is never required.  | [optional] 
**type** | [**NavigationItemType**](NavigationItemType.md) | Discriminator field indicating this is a navigation item | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


