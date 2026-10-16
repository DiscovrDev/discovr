
# MediaProfileMeta

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **watchlist** | **kotlin.Boolean** | Whether the title is on the profile&#39;s watchlist. |  |
| **liked** | **kotlin.Boolean** | Whether the profile has liked the title. |  |
| **disliked** | **kotlin.Boolean** | Whether the profile has disliked the title. |  |
| **superLiked** | **kotlin.Boolean** | Whether the profile has super-liked the title. |  |
| **playback** | [**MediaProfileMetaPlayback**](MediaProfileMetaPlayback.md) |  |  |
| **history** | **kotlin.Boolean** | Whether the profile has played any of this title before, even briefly. It does not mean they finished it; use &#x60;completed&#x60; for that. |  |
| **completed** | **kotlin.Boolean** | Whether the profile has completed this title (progress ≥ 80% for movies; all seasons complete for TV shows).  |  |
| **completedSeasons** | **kotlin.collections.List&lt;kotlin.Int&gt;** | TV shows only — the season numbers the profile has fully completed. Not present for movies.  |  [optional] |
| **providers** | [**kotlin.collections.List&lt;ProviderInfo&gt;**](ProviderInfo.md) | Streaming services where this title is available, filtered to the profile&#39;s selected providers. Only included when &#x60;providers&#x3D;true&#x60; is passed. For the full, unfiltered list see &#x60;watch_providers&#x60; on the base &#x60;GET /media/{id}&#x60; response.  |  [optional] |



