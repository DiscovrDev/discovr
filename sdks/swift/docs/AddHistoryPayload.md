# AddHistoryPayload

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**mediaId** | **String** | Full media ID — &#x60;MV_&lt;number&gt;&#x60; for movies, &#x60;TV_&lt;number&gt;&#x60; for TV shows (e.g., &#x60;TV_1396&#x60;).  Also accepts an item&#39;s &#x60;ref&#x60; in place of the id. Prefer the &#x60;ref&#x60; when you have one — it resolves to the same title and sharpens the user&#39;s recommendations.  | 
**updatedAt** | **Date** | ISO 8601 timestamp indicating when the history entry was last updated | [optional] 
**progress** | **Double** | Playback progress percentage (0-100) | [optional] 
**season** | **Int** | Season number (required for TV shows) | [optional] 
**episode** | **Int** | Episode number (optional for TV shows). When omitted, creates a \&quot;Default for Episode\&quot; entry that applies to all episodes in the season where episode.air_date &lt; historyItem.updatedAt. This allows updating multiple episodes with a single history entry.  **Overriding Season Defaults:** When provided, creates an explicit episode entry that takes precedence over any season default entries. To unmark an episode completed via season default, create an explicit entry with progress &lt; 80% (which will not be marked as completed).  | [optional] 
**imported** | **String** | Source of import (e.g., \&quot;trakt\&quot;) if this item was imported | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


