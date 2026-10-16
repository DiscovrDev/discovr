# MediaResponseTv

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | The Discovr media ID for this show — the &#x60;TV_&lt;id&gt;&#x60; value you pass to other endpoints. | [optional] 
**tmdbId** | **Int** | Catalogue identifier for this show, without the &#x60;TV_&#x60; prefix. | [optional] 
**name** | **String** | Display name, localised where a translation is available. | [optional] 
**originalName** | **String** | Name in the show&#39;s original language. Differs from &#x60;name&#x60; for translated releases. | [optional] 
**overview** | **String** | Short synopsis, suitable for a detail sheet. | [optional] 
**posterPath** | **[String: String]** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | [optional] 
**backdropPath** | **[String: String]** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | [optional] 
**firstAirDate** | **Date** | Date the first episode aired, as &#x60;YYYY-MM-DD&#x60;. | [optional] 
**lastAirDate** | **Date** | Date the most recent episode aired, as &#x60;YYYY-MM-DD&#x60;. | [optional] 
**numberOfEpisodes** | **Int** | Total episodes released across every season. | [optional] 
**numberOfSeasons** | **Int** | Total seasons released. | [optional] 
**voteAverage** | **Double** | Average audience rating out of 10. | [optional] 
**voteCount** | **Int** | How many ratings &#x60;vote_average&#x60; is based on — useful for deciding whether to show the score at all. | [optional] 
**popularity** | **Double** | Relative popularity score. Comparable between titles, but has no fixed upper bound, so treat it as a sort key rather than something to display. | [optional] 
**genres** | [MediaResponseTvGenre] | Genres this show belongs to. | [optional] 
**tagline** | **String** | Short marketing line, where one exists. | [optional] 
**status** | **String** | Production status, such as &#x60;Returning Series&#x60;, &#x60;Ended&#x60;, or &#x60;Canceled&#x60;. | [optional] 
**homepage** | **String** | Official site for the show, where one exists. | [optional] 
**inProduction** | **Bool** | Whether more episodes are still being made. | [optional] 
**seasons** | [MediaResponseTvSeason] | Every season of the show, including specials as season &#x60;0&#x60; where one exists. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


