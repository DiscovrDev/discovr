# TitleState

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**mediaId** | **String** | The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;). | 
**mediaType** | **String** | Whether this title is a movie or a TV show. | 
**rating** | [**Rating**](Rating.md) | The profile&#39;s rating (&#x60;liked&#x60;, &#x60;disliked&#x60;, &#x60;super_liked&#x60;), or &#x60;null&#x60; if unrated. | [optional] 
**watchlist** | **Bool** | Whether the title is on the profile&#39;s watchlist. | 
**watched** | **Bool** | Whether the profile has played any of this title, even briefly. Use &#x60;completed&#x60; for a \&quot;Watched\&quot; checkmark. | 
**completed** | **Bool** | Whether the profile has finished the title (≥ 80% for a movie; every aired episode of every regular season for a TV show; specials excluded). | 
**completedSeasons** | **[Int]** | TV shows only — regular season numbers (1 and up) whose aired episodes are all watched. | [optional] 
**episodes** | [String: [Int]] | TV shows only — map from season number (as string) to sorted watched episode numbers. | [optional] 
**plays** | **Int** | Number of completed plays (of the movie or of episodes). | 
**playback** | [**TitlePlayback**](TitlePlayback.md) | Live resume position if the viewer is currently mid-watch, or &#x60;null&#x60; otherwise. | [optional] 
**providers** | [ProviderInfo] | Streaming services where this title is available, filtered to the account&#39;s selected providers. Present only when &#x60;providers&#x3D;true&#x60; is passed to &#x60;getTitleState&#x60;. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


