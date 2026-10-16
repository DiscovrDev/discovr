# PlaybackItem

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | The DiscovrID (TV_&lt;number&gt; or MV_&lt;number&gt;) | 
**ref** | **String** | This item&#39;s &#x60;id&#x60; with the list it came from attached.  Prefer it wherever you&#39;d pass this item&#39;s &#x60;id&#x60; onward — opening its detail screen, scrobbling it, removing it from a list. It works exactly like the &#x60;id&#x60; and sharpens the user&#39;s recommendations. Use it for the profile it was returned to; for anything you share, use the &#x60;id&#x60;.  A bare &#x60;id&#x60; always works; &#x60;ref&#x60; is never required.  | [optional] 
**mediaType** | **String** | The type of media | 
**title** | **String** | The title of the media | 
**posterPath** | **[String: String]** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | 
**backdropPath** | **[String: String]** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | 
**episodeImage** | **[String: String]** | Episode still image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). Only present for episode-level playback items.  | [optional] 
**episodeTitle** | **String** | The title of the episode (only present for episode-level playback items) | [optional] 
**progress** | **Double** | Playback progress percentage (0-100) | [optional] 
**updatedAt** | **Date** | ISO 8601 timestamp indicating when playback was last updated | [optional] 
**season** | **Int** | Season number (only for TV shows) | [optional] 
**episode** | **Int** | Episode number (only for TV shows) | [optional] 
**createdAt** | **Date** | ISO 8601 timestamp indicating when the item was first added to the list | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


