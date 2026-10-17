# discovr@1.0.0-alpha.1

A TypeScript SDK client for the api.discovr.media API.

## Usage

First, install the SDK from npm.

```bash
npm install discovr@alpha --save
```

Next, try it out.


```ts
import { DiscovrClient } from "discovr";

// This scaffold uses the `DiscovrClient` façade. Full examples for every method are in
// the SDK Reference at https://docs.discovr.media.
const client = new DiscovrClient("your-client-id", {
  basePath: "https://api.discovr.media",
});

async function example() {
  const result = await client.authorizeClientWeb(/* see API reference */);
  console.log(result);
}

example().catch(console.error);
```


## Documentation

### API Endpoints

All URIs are relative to *https://api.discovr.media*

| Class | Method | HTTP request | Description
| ----- | ------ | ------------ | -------------
*AuthenticationApi* | [**authorizeClientWeb**](docs/AuthenticationApi.md#authorizeclientweb) | **GET** /auth/web/authorize | Redirect to web authentication
*AuthenticationApi* | [**exchangeWebAuthCode**](docs/AuthenticationApi.md#exchangewebauthcode) | **POST** /auth/web/token | Redeem a web sign-in code
*AuthenticationApi* | [**mintSessionToken**](docs/AuthenticationApi.md#mintsessiontoken) | **POST** /auth/session-token | Mint a session token
*AuthenticationApi* | [**pollDeviceCode**](docs/AuthenticationApi.md#polldevicecode) | **POST** /auth/device-codes/{deviceCode}/poll | Poll for auth token
*AuthenticationApi* | [**requestDeviceCode**](docs/AuthenticationApi.md#requestdevicecode) | **POST** /auth/device-codes | Request device code
*AuthenticationApi* | [**signOutSession**](docs/AuthenticationApi.md#signoutsession) | **DELETE** /auth/session | Sign out the current device
*AuthenticationApi* | [**startDemoSession**](docs/AuthenticationApi.md#startdemosession) | **POST** /auth/demo-session | Start a demo session
*DiscovrApi* | [**addDislikedItem**](docs/DiscovrApi.md#adddislikeditem) | **POST** /profile/disliked | Add an item to disliked list
*DiscovrApi* | [**addHistoryItem**](docs/DiscovrApi.md#addhistoryitem) | **POST** /profile/history | Add an item to history list
*DiscovrApi* | [**addLikedItem**](docs/DiscovrApi.md#addlikeditem) | **POST** /profile/liked | Add an item to liked list
*DiscovrApi* | [**addPlaybackItem**](docs/DiscovrApi.md#addplaybackitem) | **POST** /profile/playback | Add an item to playback list
*DiscovrApi* | [**addSuperLikedItem**](docs/DiscovrApi.md#addsuperlikeditem) | **POST** /profile/super_liked | Add an item to the super-liked list
*DiscovrApi* | [**addWatchlistItem**](docs/DiscovrApi.md#addwatchlistitem) | **POST** /profile/watchlist | Add an item to watchlist
*DiscovrApi* | [**authorizeClientWeb**](docs/DiscovrApi.md#authorizeclientweb) | **GET** /auth/web/authorize | Redirect to web authentication
*DiscovrApi* | [**createPage**](docs/DiscovrApi.md#createpage) | **POST** /pages | Create a recommendation page
*DiscovrApi* | [**createProfile**](docs/DiscovrApi.md#createprofile) | **POST** /profiles | Create a profile
*DiscovrApi* | [**deleteDislikedItem**](docs/DiscovrApi.md#deletedislikeditem) | **DELETE** /profile/disliked/{mediaId} | Delete an item from disliked list
*DiscovrApi* | [**deleteHistoryItem**](docs/DiscovrApi.md#deletehistoryitem) | **DELETE** /profile/history/{mediaId} | Delete an item from history list
*DiscovrApi* | [**deleteLikedItem**](docs/DiscovrApi.md#deletelikeditem) | **DELETE** /profile/liked/{mediaId} | Delete an item from liked list
*DiscovrApi* | [**deletePlaybackItem**](docs/DiscovrApi.md#deleteplaybackitem) | **DELETE** /profile/playback/{mediaId} | Delete an item from playback list
*DiscovrApi* | [**deleteProfile**](docs/DiscovrApi.md#deleteprofile) | **DELETE** /profiles/{profileId} | Delete a profile
*DiscovrApi* | [**deleteSuperLikedItem**](docs/DiscovrApi.md#deletesuperlikeditem) | **DELETE** /profile/super_liked/{mediaId} | Delete an item from the super-liked list
*DiscovrApi* | [**deleteWatchlistItem**](docs/DiscovrApi.md#deletewatchlistitem) | **DELETE** /profile/watchlist/{mediaId} | Delete an item from watchlist
*DiscovrApi* | [**exchangeWebAuthCode**](docs/DiscovrApi.md#exchangewebauthcode) | **POST** /auth/web/token | Redeem a web sign-in code
*DiscovrApi* | [**getDislikedItems**](docs/DiscovrApi.md#getdislikeditems) | **GET** /profile/disliked | Get disliked items
*DiscovrApi* | [**getHistoryItems**](docs/DiscovrApi.md#gethistoryitems) | **GET** /profile/history | Get history items
*DiscovrApi* | [**getHistoryItemsByMediaId**](docs/DiscovrApi.md#gethistoryitemsbymediaid) | **GET** /profile/history/{mediaId} | Get history items for a specific media
*DiscovrApi* | [**getLikedItems**](docs/DiscovrApi.md#getlikeditems) | **GET** /profile/liked | Get liked items
*DiscovrApi* | [**getMedia**](docs/DiscovrApi.md#getmedia) | **GET** /media/{mediaId} | Get media details
*DiscovrApi* | [**getMediaAssets**](docs/DiscovrApi.md#getmediaassets) | **GET** /media/{mediaId}/assets | Get media assets
*DiscovrApi* | [**getMediaProfileMeta**](docs/DiscovrApi.md#getmediaprofilemeta) | **GET** /media/{mediaId}/profile_meta | Get profile interaction data for a title
*DiscovrApi* | [**getPage**](docs/DiscovrApi.md#getpage) | **GET** /pages/{pageId} | Get a page
*DiscovrApi* | [**getPlaybackItems**](docs/DiscovrApi.md#getplaybackitems) | **GET** /profile/playback | Get playback items
*DiscovrApi* | [**getProfile**](docs/DiscovrApi.md#getprofile) | **GET** /profiles/{profileId} | Get a profile
*DiscovrApi* | [**getProfileImages**](docs/DiscovrApi.md#getprofileimages) | **GET** /profile-images | List avatar images
*DiscovrApi* | [**getProfiles**](docs/DiscovrApi.md#getprofiles) | **GET** /profiles | List profiles
*DiscovrApi* | [**getRow**](docs/DiscovrApi.md#getrow) | **GET** /pages/{pageId}/rows/{rowId} | Get a row
*DiscovrApi* | [**getRowItems**](docs/DiscovrApi.md#getrowitems) | **GET** /pages/{pageId}/rows/{rowId}/items | List row items
*DiscovrApi* | [**getRows**](docs/DiscovrApi.md#getrows) | **GET** /pages/{pageId}/rows | List rows
*DiscovrApi* | [**getSeasonDetails**](docs/DiscovrApi.md#getseasondetails) | **GET** /media/{mediaId}/seasons/{seasonNumber} | Get TV season details
*DiscovrApi* | [**getSeasonProfileMeta**](docs/DiscovrApi.md#getseasonprofilemeta) | **GET** /media/{mediaId}/seasons/{seasonNumber}/meta | Get which episodes of a TV season are finished
*DiscovrApi* | [**getSimilarRecommendations**](docs/DiscovrApi.md#getsimilarrecommendations) | **GET** /media/{mediaId}/similar | Get similar titles
*DiscovrApi* | [**getSuperLikedItems**](docs/DiscovrApi.md#getsuperlikeditems) | **GET** /profile/super_liked | Get super-liked items
*DiscovrApi* | [**getWatchlistItems**](docs/DiscovrApi.md#getwatchlistitems) | **GET** /profile/watchlist | Get watchlist items
*DiscovrApi* | [**markUnwatched**](docs/DiscovrApi.md#markunwatched) | **DELETE** /profile/watched/{mediaId} | Mark a title as unwatched
*DiscovrApi* | [**mintSessionToken**](docs/DiscovrApi.md#mintsessiontoken) | **POST** /auth/session-token | Mint a session token
*DiscovrApi* | [**patchHistoryItem**](docs/DiscovrApi.md#patchhistoryitem) | **PATCH** /profile/history/{mediaId} | Update or create a history item
*DiscovrApi* | [**pollDeviceCode**](docs/DiscovrApi.md#polldevicecode) | **POST** /auth/device-codes/{deviceCode}/poll | Poll for auth token
*DiscovrApi* | [**requestDeviceCode**](docs/DiscovrApi.md#requestdevicecode) | **POST** /auth/device-codes | Request device code
*DiscovrApi* | [**scrobble**](docs/DiscovrApi.md#scrobble) | **POST** /profile/scrobble/{mediaId} | Record playback progress
*DiscovrApi* | [**scrobbleSkip**](docs/DiscovrApi.md#scrobbleskip) | **POST** /profile/scrobble/{mediaId}/skip | Record a skip event
*DiscovrApi* | [**searchGifs**](docs/DiscovrApi.md#searchgifs) | **GET** /gif-search | Search GIFs
*DiscovrApi* | [**searchMedia**](docs/DiscovrApi.md#searchmedia) | **GET** /search | Search media
*DiscovrApi* | [**signOutSession**](docs/DiscovrApi.md#signoutsession) | **DELETE** /auth/session | Sign out the current device
*DiscovrApi* | [**startDemoSession**](docs/DiscovrApi.md#startdemosession) | **POST** /auth/demo-session | Start a demo session
*DiscovrApi* | [**updatePlaybackItem**](docs/DiscovrApi.md#updateplaybackitem) | **PATCH** /profile/playback | Update playback progress
*DiscovrApi* | [**updateProfile**](docs/DiscovrApi.md#updateprofile) | **PATCH** /profiles/{profileId} | Update a profile
*MediaApi* | [**getMedia**](docs/MediaApi.md#getmedia) | **GET** /media/{mediaId} | Get media details
*MediaApi* | [**getMediaAssets**](docs/MediaApi.md#getmediaassets) | **GET** /media/{mediaId}/assets | Get media assets
*MediaApi* | [**getMediaProfileMeta**](docs/MediaApi.md#getmediaprofilemeta) | **GET** /media/{mediaId}/profile_meta | Get profile interaction data for a title
*MediaApi* | [**getSeasonDetails**](docs/MediaApi.md#getseasondetails) | **GET** /media/{mediaId}/seasons/{seasonNumber} | Get TV season details
*MediaApi* | [**getSeasonProfileMeta**](docs/MediaApi.md#getseasonprofilemeta) | **GET** /media/{mediaId}/seasons/{seasonNumber}/meta | Get which episodes of a TV season are finished
*MediaApi* | [**getSimilarRecommendations**](docs/MediaApi.md#getsimilarrecommendations) | **GET** /media/{mediaId}/similar | Get similar titles
*MiscApi* | [**getProfileImages**](docs/MiscApi.md#getprofileimages) | **GET** /profile-images | List avatar images
*MiscApi* | [**searchGifs**](docs/MiscApi.md#searchgifs) | **GET** /gif-search | Search GIFs
*PagesApi* | [**createPage**](docs/PagesApi.md#createpage) | **POST** /pages | Create a recommendation page
*PagesApi* | [**getPage**](docs/PagesApi.md#getpage) | **GET** /pages/{pageId} | Get a page
*ProfileListsApi* | [**addDislikedItem**](docs/ProfileListsApi.md#adddislikeditem) | **POST** /profile/disliked | Add an item to disliked list
*ProfileListsApi* | [**addHistoryItem**](docs/ProfileListsApi.md#addhistoryitem) | **POST** /profile/history | Add an item to history list
*ProfileListsApi* | [**addLikedItem**](docs/ProfileListsApi.md#addlikeditem) | **POST** /profile/liked | Add an item to liked list
*ProfileListsApi* | [**addPlaybackItem**](docs/ProfileListsApi.md#addplaybackitem) | **POST** /profile/playback | Add an item to playback list
*ProfileListsApi* | [**addSuperLikedItem**](docs/ProfileListsApi.md#addsuperlikeditem) | **POST** /profile/super_liked | Add an item to the super-liked list
*ProfileListsApi* | [**addWatchlistItem**](docs/ProfileListsApi.md#addwatchlistitem) | **POST** /profile/watchlist | Add an item to watchlist
*ProfileListsApi* | [**deleteDislikedItem**](docs/ProfileListsApi.md#deletedislikeditem) | **DELETE** /profile/disliked/{mediaId} | Delete an item from disliked list
*ProfileListsApi* | [**deleteHistoryItem**](docs/ProfileListsApi.md#deletehistoryitem) | **DELETE** /profile/history/{mediaId} | Delete an item from history list
*ProfileListsApi* | [**deleteLikedItem**](docs/ProfileListsApi.md#deletelikeditem) | **DELETE** /profile/liked/{mediaId} | Delete an item from liked list
*ProfileListsApi* | [**deletePlaybackItem**](docs/ProfileListsApi.md#deleteplaybackitem) | **DELETE** /profile/playback/{mediaId} | Delete an item from playback list
*ProfileListsApi* | [**deleteSuperLikedItem**](docs/ProfileListsApi.md#deletesuperlikeditem) | **DELETE** /profile/super_liked/{mediaId} | Delete an item from the super-liked list
*ProfileListsApi* | [**deleteWatchlistItem**](docs/ProfileListsApi.md#deletewatchlistitem) | **DELETE** /profile/watchlist/{mediaId} | Delete an item from watchlist
*ProfileListsApi* | [**getDislikedItems**](docs/ProfileListsApi.md#getdislikeditems) | **GET** /profile/disliked | Get disliked items
*ProfileListsApi* | [**getHistoryItems**](docs/ProfileListsApi.md#gethistoryitems) | **GET** /profile/history | Get history items
*ProfileListsApi* | [**getHistoryItemsByMediaId**](docs/ProfileListsApi.md#gethistoryitemsbymediaid) | **GET** /profile/history/{mediaId} | Get history items for a specific media
*ProfileListsApi* | [**getLikedItems**](docs/ProfileListsApi.md#getlikeditems) | **GET** /profile/liked | Get liked items
*ProfileListsApi* | [**getPlaybackItems**](docs/ProfileListsApi.md#getplaybackitems) | **GET** /profile/playback | Get playback items
*ProfileListsApi* | [**getSuperLikedItems**](docs/ProfileListsApi.md#getsuperlikeditems) | **GET** /profile/super_liked | Get super-liked items
*ProfileListsApi* | [**getWatchlistItems**](docs/ProfileListsApi.md#getwatchlistitems) | **GET** /profile/watchlist | Get watchlist items
*ProfileListsApi* | [**patchHistoryItem**](docs/ProfileListsApi.md#patchhistoryitem) | **PATCH** /profile/history/{mediaId} | Update or create a history item
*ProfileListsApi* | [**updatePlaybackItem**](docs/ProfileListsApi.md#updateplaybackitem) | **PATCH** /profile/playback | Update playback progress
*ProfilesApi* | [**createProfile**](docs/ProfilesApi.md#createprofile) | **POST** /profiles | Create a profile
*ProfilesApi* | [**deleteProfile**](docs/ProfilesApi.md#deleteprofile) | **DELETE** /profiles/{profileId} | Delete a profile
*ProfilesApi* | [**getProfile**](docs/ProfilesApi.md#getprofile) | **GET** /profiles/{profileId} | Get a profile
*ProfilesApi* | [**getProfiles**](docs/ProfilesApi.md#getprofiles) | **GET** /profiles | List profiles
*ProfilesApi* | [**updateProfile**](docs/ProfilesApi.md#updateprofile) | **PATCH** /profiles/{profileId} | Update a profile
*RowsApi* | [**getRow**](docs/RowsApi.md#getrow) | **GET** /pages/{pageId}/rows/{rowId} | Get a row
*RowsApi* | [**getRowItems**](docs/RowsApi.md#getrowitems) | **GET** /pages/{pageId}/rows/{rowId}/items | List row items
*RowsApi* | [**getRows**](docs/RowsApi.md#getrows) | **GET** /pages/{pageId}/rows | List rows
*ScrobbleApi* | [**markUnwatched**](docs/ScrobbleApi.md#markunwatched) | **DELETE** /profile/watched/{mediaId} | Mark a title as unwatched
*ScrobbleApi* | [**scrobble**](docs/ScrobbleApi.md#scrobble) | **POST** /profile/scrobble/{mediaId} | Record playback progress
*ScrobbleApi* | [**scrobbleSkip**](docs/ScrobbleApi.md#scrobbleskip) | **POST** /profile/scrobble/{mediaId}/skip | Record a skip event
*SearchApi* | [**searchMedia**](docs/SearchApi.md#searchmedia) | **GET** /search | Search media


### Models

- [AddHistoryPayload](docs/AddHistoryPayload.md)
- [AddPlaybackPayload](docs/AddPlaybackPayload.md)
- [AddSimpleListItemPayload](docs/AddSimpleListItemPayload.md)
- [ApiError](docs/ApiError.md)
- [AvatarMediaType](docs/AvatarMediaType.md)
- [CreatePagePayload](docs/CreatePagePayload.md)
- [CreatePageResponse](docs/CreatePageResponse.md)
- [CreateProfilePayload](docs/CreateProfilePayload.md)
- [CreateProfileResponse](docs/CreateProfileResponse.md)
- [DeleteProfileResponse](docs/DeleteProfileResponse.md)
- [DemoSessionRequest](docs/DemoSessionRequest.md)
- [DemoSessionResponse](docs/DemoSessionResponse.md)
- [DeviceCodePayload](docs/DeviceCodePayload.md)
- [DeviceCodePendingResponse](docs/DeviceCodePendingResponse.md)
- [DeviceCodeResponse](docs/DeviceCodeResponse.md)
- [DevicePollPayload](docs/DevicePollPayload.md)
- [EditPlaybackPayload](docs/EditPlaybackPayload.md)
- [Episode](docs/Episode.md)
- [FilterSpec](docs/FilterSpec.md)
- [GetProfilesResponse](docs/GetProfilesResponse.md)
- [GetRowItemsResponse](docs/GetRowItemsResponse.md)
- [GetRowsResponse](docs/GetRowsResponse.md)
- [GifItem](docs/GifItem.md)
- [GifPreview](docs/GifPreview.md)
- [GifSearchResponse](docs/GifSearchResponse.md)
- [HeroItem](docs/HeroItem.md)
- [HistoryItem](docs/HistoryItem.md)
- [HistoryListResponse](docs/HistoryListResponse.md)
- [KnownForItem](docs/KnownForItem.md)
- [MediaAssetsResponse](docs/MediaAssetsResponse.md)
- [MediaAssetsTrailer](docs/MediaAssetsTrailer.md)
- [MediaItem](docs/MediaItem.md)
- [MediaItemType](docs/MediaItemType.md)
- [MediaProfileMeta](docs/MediaProfileMeta.md)
- [MediaProfileMetaPlayback](docs/MediaProfileMetaPlayback.md)
- [MediaResponse](docs/MediaResponse.md)
- [MediaResponseMovie](docs/MediaResponseMovie.md)
- [MediaResponseMovieGenre](docs/MediaResponseMovieGenre.md)
- [MediaResponseTv](docs/MediaResponseTv.md)
- [MediaResponseTvGenre](docs/MediaResponseTvGenre.md)
- [MediaResponseTvSeason](docs/MediaResponseTvSeason.md)
- [MintSessionTokenPayload](docs/MintSessionTokenPayload.md)
- [NavigationItem](docs/NavigationItem.md)
- [NavigationItemType](docs/NavigationItemType.md)
- [Page](docs/Page.md)
- [PatchHistoryPayload](docs/PatchHistoryPayload.md)
- [PlaybackItem](docs/PlaybackItem.md)
- [PlaybackListResponse](docs/PlaybackListResponse.md)
- [PollDeviceCode200Response](docs/PollDeviceCode200Response.md)
- [Profile](docs/Profile.md)
- [ProfileImagesResponse](docs/ProfileImagesResponse.md)
- [ProviderInfo](docs/ProviderInfo.md)
- [ProviderInfoRegion](docs/ProviderInfoRegion.md)
- [ProviderItem](docs/ProviderItem.md)
- [ProviderItemType](docs/ProviderItemType.md)
- [RateLimitedError](docs/RateLimitedError.md)
- [RefreshTokenResponse](docs/RefreshTokenResponse.md)
- [Row](docs/Row.md)
- [RowItem](docs/RowItem.md)
- [RowType](docs/RowType.md)
- [SchemasPlaybackItem](docs/SchemasPlaybackItem.md)
- [ScrobbleProgressBody](docs/ScrobbleProgressBody.md)
- [ScrobbleProgressPayload](docs/ScrobbleProgressPayload.md)
- [ScrobbleResponse](docs/ScrobbleResponse.md)
- [ScrobbleSkipBody](docs/ScrobbleSkipBody.md)
- [ScrobbleSkipResponse](docs/ScrobbleSkipResponse.md)
- [ScrobbleTv](docs/ScrobbleTv.md)
- [SearchResponse](docs/SearchResponse.md)
- [SearchResult](docs/SearchResult.md)
- [SeasonDetailsResponse](docs/SeasonDetailsResponse.md)
- [SeasonProfileMeta](docs/SeasonProfileMeta.md)
- [SeasonProfileMetaEpisode](docs/SeasonProfileMetaEpisode.md)
- [SessionTokenResponse](docs/SessionTokenResponse.md)
- [SignOutSession200Response](docs/SignOutSession200Response.md)
- [SimilarResponse](docs/SimilarResponse.md)
- [SimilarResult](docs/SimilarResult.md)
- [SimpleListItem](docs/SimpleListItem.md)
- [SimpleListResponse](docs/SimpleListResponse.md)
- [SuccessMessage](docs/SuccessMessage.md)
- [UpdateProfilePayload](docs/UpdateProfilePayload.md)
- [WebTokenPayload](docs/WebTokenPayload.md)

### Authorization


Authentication schemes defined for the API:
<a id="BearerAuth"></a>
#### BearerAuth


- **Type**: HTTP Bearer Token authentication

## About

This TypeScript SDK client supports the [Fetch API](https://fetch.spec.whatwg.org/)
and is automatically generated by the
[OpenAPI Generator](https://openapi-generator.tech) project:

- API version: `1.0.0-alpha.1`
- Package version: `1.0.0-alpha.1`
- Generator version: `7.17.0`
- Build package: `org.openapitools.codegen.languages.TypeScriptFetchClientCodegen`

The generated npm module supports the following:

- Environments
  * Node.js
  * Webpack
  * Browserify
- Language levels
  * ES5 - you must have a Promises/A+ library installed
  * ES6
- Module systems
  * CommonJS
  * ES6 module system


## Development

### Building

To build the TypeScript source code, you need to have Node.js and npm installed.
After cloning the repository, navigate to the project directory and run:

```bash
npm install
npm run build
```

## License

This SDK is released under the [MIT License](https://github.com/DiscovrDev/discovr/blob/main/LICENSE).
Use of the Discovr API is governed by the [Developer Terms](https://discovr.media/terms).
