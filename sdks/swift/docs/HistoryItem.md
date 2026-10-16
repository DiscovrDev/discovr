# HistoryItem

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | The DiscovrID (TV_&lt;number&gt; or MV_&lt;number&gt;) | 
**ref** | **String** | This entry&#39;s &#x60;id&#x60; with the list it came from attached.  Prefer it wherever you&#39;d pass this entry&#39;s &#x60;id&#x60; onward — opening its detail screen, removing it from your history. It works exactly like the &#x60;id&#x60; and sharpens the user&#39;s recommendations. Use it for the profile it was returned to; for anything you share, use the &#x60;id&#x60;.  A bare &#x60;id&#x60; always works; &#x60;ref&#x60; is never required.  | [optional] 
**mediaType** | **String** | The type of media | 
**title** | **String** | The title of the media | 
**posterPath** | **[String: String]** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | 
**backdropPath** | **[String: String]** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | 
**updatedAt** | **Date** | ISO 8601 timestamp indicating when the history entry was last updated | 
**progress** | **Double** | Playback progress percentage (0-100) | [optional] 
**completed** | **Bool** | Whether the media is considered completed (progress &gt;&#x3D; 80%) | 
**watchedCount** | **Int** | How many times the profile has finished this title (or episode). &#x60;0&#x60; means it has been started but not finished. | 
**season** | **Int** | Season number (required for TV shows) | [optional] 
**episode** | **Int** | Episode number (required for TV shows) | [optional] 
**imported** | **String** | Source of import (e.g., \&quot;trakt\&quot;) if this item was imported | [optional] 
**createdAt** | **Date** | ISO 8601 timestamp indicating when the item was added to the list | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


