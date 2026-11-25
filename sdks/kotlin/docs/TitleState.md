
# TitleState

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **mediaId** | **kotlin.String** | The title&#39;s media ID (&#x60;MV_&lt;id&gt;&#x60; or &#x60;TV_&lt;id&gt;&#x60;). |  |
| **mediaType** | [**inline**](#MediaType) | Whether this title is a movie or a TV show. |  |
| **watchlist** | **kotlin.Boolean** | Whether the title is on the profile&#39;s watchlist. |  |
| **watched** | **kotlin.Boolean** | Whether the profile has played any of this title, even briefly. Use &#x60;completed&#x60; for a \&quot;Watched\&quot; checkmark. |  |
| **completed** | **kotlin.Boolean** | Whether the profile has finished the title (≥ 80% for a movie; every aired episode of every regular season for a TV show; specials excluded). |  |
| **plays** | **kotlin.Int** | Number of completed plays (of the movie or of episodes). |  |
| **rating** | [**Rating**](Rating.md) | The profile&#39;s rating (&#x60;liked&#x60;, &#x60;disliked&#x60;, &#x60;super_liked&#x60;), or &#x60;null&#x60; if unrated. |  [optional] |
| **completedSeasons** | **kotlin.collections.List&lt;kotlin.Int&gt;** | TV shows only — regular season numbers (1 and up) whose aired episodes are all watched. |  [optional] |
| **episodes** | **kotlin.collections.Map&lt;kotlin.String, kotlin.collections.List&lt;kotlin.Int&gt;&gt;** | TV shows only — map from season number (as string) to sorted watched episode numbers. |  [optional] |
| **playback** | [**TitlePlayback**](TitlePlayback.md) | Live resume position if the viewer is currently mid-watch, or &#x60;null&#x60; otherwise. |  [optional] |
| **providers** | [**kotlin.collections.List&lt;ProviderInfo&gt;**](ProviderInfo.md) | Streaming services where this title is available, filtered to the account&#39;s selected providers. Present only when &#x60;providers&#x3D;true&#x60; is passed to &#x60;getTitleState&#x60;. |  [optional] |


<a id="MediaType"></a>
## Enum: mediaType
| Name | Value |
| ---- | ----- |
| mediaType | movie, tv |



