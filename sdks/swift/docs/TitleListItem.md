# TitleListItem

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | The DiscovrID (&#x60;TV_&lt;number&gt;&#x60; or &#x60;MV_&lt;number&gt;&#x60;). | 
**ref** | **String** | This item&#39;s &#x60;id&#x60; with the list it came from attached.  Prefer it wherever you&#39;d pass this item&#39;s &#x60;id&#x60; onward — opening its detail screen, rating it, or removing it from a list. A bare &#x60;id&#x60; always works; &#x60;ref&#x60; is never required.  | [optional] 
**mediaType** | **String** | The type of media. | 
**title** | **String** | The title of the media. | 
**posterPath** | **[String: String]** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | 
**backdropPath** | **[String: String]** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | 
**rating** | [**Rating**](Rating.md) | The profile&#39;s rating for this title, or &#x60;null&#x60; if unrated. | [optional] 
**watchlist** | **Bool** | Whether this title is on the profile&#39;s watchlist. | 
**updatedAt** | **Date** | ISO 8601 timestamp for the active sort dimension (rated time, watchlisted time, or last watched time). | 
**completed** | **Bool** | Present on &#x60;watched&#x3D;true&#x60; results — whether the title is fully finished. | [optional] 
**plays** | **Int** | Present on &#x60;watched&#x3D;true&#x60; results — total completed plays. | [optional] 
**season** | **Int** | Present on &#x60;watched&#x3D;true&#x60; TV results — most recently watched season number. | [optional] 
**episode** | **Int** | Present on &#x60;watched&#x3D;true&#x60; TV results — most recently watched episode number. | [optional] 
**imported** | **String** | Present on &#x60;watched&#x3D;true&#x60; results when imported from an external source (e.g., &#x60;\&quot;trakt\&quot;&#x60;). | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


