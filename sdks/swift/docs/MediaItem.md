# MediaItem

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | Unique identifier for the media item | 
**title** | **String** | Title of the media item | 
**overview** | **String** | Synopsis/summary text for this title. | 
**posterPath** | **[String: String]** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | [optional] 
**backdropPath** | **[String: String]** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | [optional] 
**mediaType** | **String** | Type of media | 
**year** | **Int** | Release year (the first air year for TV). Absent when the title has no date. | [optional] 
**rating** | **Double** | Average viewer rating out of 10, to one decimal. Absent until a title has votes. | [optional] 
**genres** | **[String]** | Genre names, most relevant first. Absent when none are known. | [optional] 
**logoPath** | **[String: String]** | Title logo image URLs (English preferred) keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). &#x60;null&#x60; when the title has no logo. Always present on &#x60;hero&#x60; items. On row items it is added when the items are served, and is absent only if the catalogue couldn&#39;t be reached for that title; fetch the row&#39;s items again to fill it in.  | [optional] 
**trailer** | [**MediaItemTrailer**](MediaItemTrailer.md) | The best trailer for the title, picked the same way as &#x60;getMediaAssets&#x60;. &#x60;null&#x60; when it has none. Added to row items when they are served; absent under the same conditions as &#x60;logo_path&#x60;. | [optional] 
**runtime** | **Int** | Running time in minutes. Movies only, and absent when the catalogue has none. Added to row items when they are served. | [optional] 
**numberOfSeasons** | **Int** | How many seasons the show has. TV only, and absent when the catalogue has none. Added to row items when they are served. | [optional] 
**type** | [**MediaItemType**](MediaItemType.md) | Discriminator field indicating this is a media item | 
**ref** | **String** | This item&#39;s &#x60;id&#x60; with the place it was shown attached.  Prefer it wherever you&#39;d pass this item&#39;s &#x60;id&#x60; onward — opening its detail screen, adding it to a list, scrobbling it. It works exactly like the &#x60;id&#x60; and sharpens the user&#39;s recommendations. Use it for the profile it was returned to; for anything you share, use the &#x60;id&#x60;.  A bare &#x60;id&#x60; always works; &#x60;ref&#x60; is never required.  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


