# Page

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | Stable identifier for the page. Safe to store, bookmark or put in a URL. | 
**createdAt** | **Date** | When this view of the page was built. Moves when recommendations refresh; it is not the page&#39;s own age. | 
**hero** | [HeroItem] | Array of exactly 10 featured HeroItems for the hero section | 
**name** | **String** | Human-readable page title, suitable for a breadcrumb (e.g. \&quot;Movies &amp; Series • Anime • Fantasy\&quot;).  Present only for pages that carry their own name — navigation tiles and built-in pages. A &#x60;name&#x60; you pass to &#x60;POST /pages&#x60; is a label for your own use and is not returned here. Absent otherwise — read it defensively.  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


