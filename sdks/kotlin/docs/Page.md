
# Page

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | **kotlin.String** | Stable identifier for the page. Safe to store, bookmark or put in a URL. |  |
| **createdAt** | [**kotlin.time.Instant**](kotlin.time.Instant.md) | When this view of the page was built. Moves when recommendations refresh; it is not the page&#39;s own age. |  |
| **hero** | [**kotlin.collections.List&lt;HeroItem&gt;**](HeroItem.md) | Array of exactly 10 featured HeroItems for the hero section |  |
| **name** | **kotlin.String** | Human-readable page title, suitable for a breadcrumb (e.g. \&quot;Movies &amp; Series • Anime • Fantasy\&quot;).  Present only for pages that carry their own name — navigation tiles and built-in pages. &#x60;POST /pages&#x60; takes no name, so a page you create from filters alone has none. Absent otherwise — read it defensively.  |  [optional] |



