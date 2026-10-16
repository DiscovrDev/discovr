# SimilarResult

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | Unique identifier. &#x60;TV_&lt;id&gt;&#x60; for TV shows or &#x60;MV_&lt;id&gt;&#x60; for movies. | 
**ref** | **String** | This title&#39;s &#x60;id&#x60; with the place it was suggested attached.  Prefer it wherever you&#39;d pass this title&#39;s &#x60;id&#x60; onward — opening its detail screen, adding it to a list. It works exactly like the &#x60;id&#x60; and sharpens the user&#39;s recommendations. Use it for the profile it was returned to; for anything you share, use the &#x60;id&#x60;.  A bare &#x60;id&#x60; always works; &#x60;ref&#x60; is never required.  | [optional] 
**tmdbId** | **Int** | The numeric ID for this title. | 
**mediaType** | **String** | Whether this result is a movie or TV show. | 
**title** | **String** | Title of the movie (only for movies) | [optional] 
**name** | **String** | Name of the TV show (only for TV shows) | [optional] 
**originalTitle** | **String** | Original title of the movie (only for movies) | [optional] 
**originalName** | **String** | Original name of the TV show (only for TV shows) | [optional] 
**overview** | **String** | Overview or description | [optional] 
**posterPath** | **[String: String]** | Poster image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | [optional] 
**backdropPath** | **[String: String]** | Backdrop image URLs keyed by width bucket (&#x60;w45&#x60;, &#x60;w92&#x60;, &#x60;w154&#x60;, &#x60;w185&#x60;, &#x60;w300&#x60;, &#x60;w342&#x60;, &#x60;w500&#x60;, &#x60;w780&#x60;, &#x60;w1280&#x60;, &#x60;original&#x60;). | [optional] 
**releaseDate** | **Date** | Release date (only for movies) | [optional] 
**firstAirDate** | **Date** | First air date (only for TV shows) | [optional] 
**popularity** | **Double** | Popularity score | [optional] 
**voteAverage** | **Double** | Average vote rating | [optional] 
**voteCount** | **Int** | Number of votes | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


