# RowItem

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | Unique identifier for the provider item | 
**title** | **String** | Title of the provider (streaming service name) | 
**overview** | **String** | Synopsis/summary text for this title. | 
**posterPath** | **[String: String]** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | [optional] 
**backdropPath** | **[String: String]** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | [optional] 
**mediaType** | **String** | Type of media | 
**year** | **Int** | Release year (the first air year for TV). Absent when the title has no date. | [optional] 
**rating** | **Double** | Average viewer rating out of 10, to one decimal. Absent until a title has votes. | [optional] 
**genres** | **[String]** | Genre names, most relevant first. Absent when none are known. | [optional] 
**type** | [**ProviderItemType**](ProviderItemType.md) | Discriminator field indicating this is a provider item | 
**ref** | **String** | This tile&#39;s &#x60;page_id&#x60; with the place it was shown attached.  Prefer it over &#x60;page_id&#x60; when opening the page this tile links to. It resolves to the same page and sharpens the user&#39;s recommendations. Use it for the profile it was returned to.  A bare &#x60;page_id&#x60; always works; &#x60;ref&#x60; is never required.  | [optional] 
**verticalPath** | **[String: String]** | Vertical tile image URLs keyed by size: &#x60;original&#x60; (800×1200) and &#x60;thumbnail&#x60; (400×600), pre-rendered at build time.  | [optional] 
**horizontalPath** | **[String: String]** | Horizontal tile image URLs keyed by size: &#x60;original&#x60; (1080×608) and &#x60;thumbnail&#x60; (540×304), pre-rendered at build time.  | [optional] 
**pageId** | **String** | ID of the page this provider item links to | 
**paths** | **[String: String]** | Square Logo URLs in various resolutions (keys are resolution IDs like \&quot;60\&quot;, \&quot;100\&quot;, \&quot;512\&quot;, \&quot;1024\&quot;) | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


