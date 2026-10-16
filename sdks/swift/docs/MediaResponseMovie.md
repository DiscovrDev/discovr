# MediaResponseMovie

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | The Discovr media ID for this movie — the &#x60;MV_&lt;id&gt;&#x60; value you pass to other endpoints. | [optional] 
**tmdbId** | **Int** | Catalogue identifier for this movie, without the &#x60;MV_&#x60; prefix. | [optional] 
**title** | **String** | Display title, localised where a translation is available. | [optional] 
**originalTitle** | **String** | Title in the movie&#39;s original language. Differs from &#x60;title&#x60; for translated releases. | [optional] 
**overview** | **String** | Short synopsis, suitable for a detail sheet. | [optional] 
**posterPath** | **[String: String]** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | [optional] 
**backdropPath** | **[String: String]** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | [optional] 
**releaseDate** | **Date** | Theatrical or first release date, as &#x60;YYYY-MM-DD&#x60;. | [optional] 
**runtime** | **Int** | Length in whole minutes. | [optional] 
**voteAverage** | **Double** | Average audience rating out of 10. | [optional] 
**voteCount** | **Int** | How many ratings &#x60;vote_average&#x60; is based on — useful for deciding whether to show the score at all. | [optional] 
**popularity** | **Double** | Relative popularity score. Comparable between titles, but has no fixed upper bound, so treat it as a sort key rather than something to display. | [optional] 
**genres** | [MediaResponseMovieGenre] | Genres this movie belongs to. | [optional] 
**tagline** | **String** | Short marketing line, where one exists. | [optional] 
**status** | **String** | Release status, such as &#x60;Released&#x60;, &#x60;In Production&#x60;, or &#x60;Post Production&#x60;. | [optional] 
**budget** | **Int** | Production budget in US dollars. &#x60;0&#x60; when unknown. | [optional] 
**revenue** | **Int** | Worldwide box office in US dollars. &#x60;0&#x60; when unknown. | [optional] 
**homepage** | **String** | Official site for the movie, where one exists. | [optional] 
**imdbId** | **String** | IMDb identifier, for linking out to IMDb. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


