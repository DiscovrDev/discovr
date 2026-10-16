# KnownForItem

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | Unique identifier — &#x60;TV_&lt;id&gt;&#x60; for TV shows, &#x60;MV_&lt;id&gt;&#x60; for movies. Ready to pass to &#x60;/media/{mediaId}&#x60;. | 
**ref** | **String** | This title&#39;s &#x60;id&#x60; with the search it came from attached.  Prefer it wherever you&#39;d pass this title&#39;s &#x60;id&#x60; onward — opening its detail screen, adding it to a list. It works exactly like the &#x60;id&#x60; and sharpens the user&#39;s recommendations. Use it for the profile it was returned to; for anything you share, use the &#x60;id&#x60;.  A bare &#x60;id&#x60; always works; &#x60;ref&#x60; is never required.  | [optional] 
**tmdbId** | **Int** | The numeric ID for this title. | 
**mediaType** | **String** | Whether this title is a movie or a TV show. | 
**title** | **String** | Movie title. TV shows use &#x60;name&#x60; instead. | [optional] 
**name** | **String** | TV show name. Movies use &#x60;title&#x60; instead. | [optional] 
**overview** | **String** | Short synopsis of the title. | [optional] 
**posterPath** | **[String: String]** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | [optional] 
**backdropPath** | **[String: String]** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | [optional] 
**releaseDate** | **Date** | Release date, for movies. | [optional] 
**firstAirDate** | **Date** | First air date, for TV shows. | [optional] 
**voteAverage** | **Double** | Average audience rating out of 10. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


