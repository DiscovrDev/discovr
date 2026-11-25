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
*DiscovrApi* | [**addToWatchlist**](docs/DiscovrApi.md#addtowatchlist) | **PUT** /profile/titles/{mediaId}/watchlist | Add a title to the watchlist
*DiscovrApi* | [**authorizeClientWeb**](docs/DiscovrApi.md#authorizeclientweb) | **GET** /auth/web/authorize | Redirect to web authentication
*DiscovrApi* | [**clearRating**](docs/DiscovrApi.md#clearrating) | **DELETE** /profile/titles/{mediaId}/rating | Clear a title\&#39;s rating
*DiscovrApi* | [**createPage**](docs/DiscovrApi.md#createpage) | **POST** /pages | Create a recommendation page
*DiscovrApi* | [**createProfile**](docs/DiscovrApi.md#createprofile) | **POST** /profiles | Create a profile
*DiscovrApi* | [**deletePlaybackItem**](docs/DiscovrApi.md#deleteplaybackitem) | **DELETE** /profile/playback/{mediaId} | Remove a title from Continue Watching
*DiscovrApi* | [**deleteProfile**](docs/DiscovrApi.md#deleteprofile) | **DELETE** /profiles/{profileId} | Delete a profile
*DiscovrApi* | [**exchangeWebAuthCode**](docs/DiscovrApi.md#exchangewebauthcode) | **POST** /auth/web/token | Redeem a web sign-in code
*DiscovrApi* | [**getMedia**](docs/DiscovrApi.md#getmedia) | **GET** /media/{mediaId} | Get media details
*DiscovrApi* | [**getMediaAssets**](docs/DiscovrApi.md#getmediaassets) | **GET** /media/{mediaId}/assets | Get media assets
*DiscovrApi* | [**getPage**](docs/DiscovrApi.md#getpage) | **GET** /pages/{pageId} | Get a page
*DiscovrApi* | [**getPlaybackItems**](docs/DiscovrApi.md#getplaybackitems) | **GET** /profile/playback | Get playback items
*DiscovrApi* | [**getProfile**](docs/DiscovrApi.md#getprofile) | **GET** /profiles/{profileId} | Get a profile
*DiscovrApi* | [**getProfileImages**](docs/DiscovrApi.md#getprofileimages) | **GET** /profile-images | List avatar images
*DiscovrApi* | [**getProfiles**](docs/DiscovrApi.md#getprofiles) | **GET** /profiles | List profiles
*DiscovrApi* | [**getRow**](docs/DiscovrApi.md#getrow) | **GET** /pages/{pageId}/rows/{rowId} | Get a row
*DiscovrApi* | [**getRowItems**](docs/DiscovrApi.md#getrowitems) | **GET** /pages/{pageId}/rows/{rowId}/items | List row items
*DiscovrApi* | [**getRows**](docs/DiscovrApi.md#getrows) | **GET** /pages/{pageId}/rows | List rows
*DiscovrApi* | [**getSeasonDetails**](docs/DiscovrApi.md#getseasondetails) | **GET** /media/{mediaId}/seasons/{seasonNumber} | Get TV season details
*DiscovrApi* | [**getSeasonState**](docs/DiscovrApi.md#getseasonstate) | **GET** /profile/titles/{mediaId}/seasons/{seasonNumber} | Get which episodes of a TV season are watched
*DiscovrApi* | [**getSimilarRecommendations**](docs/DiscovrApi.md#getsimilarrecommendations) | **GET** /media/{mediaId}/similar | Get similar titles
*DiscovrApi* | [**getTitleState**](docs/DiscovrApi.md#gettitlestate) | **GET** /profile/titles/{mediaId} | Get the active profile\&#39;s state for a title
*DiscovrApi* | [**getTitles**](docs/DiscovrApi.md#gettitles) | **GET** /profile/titles | List titles by rating, watchlist, or watch history
*DiscovrApi* | [**importHistory**](docs/DiscovrApi.md#importhistory) | **POST** /profile/history | Import a watch history entry
*DiscovrApi* | [**markUnwatched**](docs/DiscovrApi.md#markunwatched) | **DELETE** /profile/titles/{mediaId}/watched | Mark a title, season, or episode as unwatched
*DiscovrApi* | [**markWatched**](docs/DiscovrApi.md#markwatched) | **PUT** /profile/titles/{mediaId}/watched | Mark a title, season, or episode as watched
*DiscovrApi* | [**mintSessionToken**](docs/DiscovrApi.md#mintsessiontoken) | **POST** /auth/session-token | Mint a session token
*DiscovrApi* | [**pollDeviceCode**](docs/DiscovrApi.md#polldevicecode) | **POST** /auth/device-codes/{deviceCode}/poll | Poll for auth token
*DiscovrApi* | [**removeFromWatchlist**](docs/DiscovrApi.md#removefromwatchlist) | **DELETE** /profile/titles/{mediaId}/watchlist | Remove a title from the watchlist
*DiscovrApi* | [**requestDeviceCode**](docs/DiscovrApi.md#requestdevicecode) | **POST** /auth/device-codes | Request device code
*DiscovrApi* | [**scrobble**](docs/DiscovrApi.md#scrobble) | **POST** /profile/scrobble/{mediaId} | Record playback progress
*DiscovrApi* | [**searchGifs**](docs/DiscovrApi.md#searchgifs) | **GET** /gif-search | Search GIFs
*DiscovrApi* | [**searchMedia**](docs/DiscovrApi.md#searchmedia) | **GET** /search | Search media
*DiscovrApi* | [**setRating**](docs/DiscovrApi.md#setrating) | **PUT** /profile/titles/{mediaId}/rating | Set a title\&#39;s rating
*DiscovrApi* | [**signOutSession**](docs/DiscovrApi.md#signoutsession) | **DELETE** /auth/session | Sign out the current device
*DiscovrApi* | [**startDemoSession**](docs/DiscovrApi.md#startdemosession) | **POST** /auth/demo-session | Start a demo session
*DiscovrApi* | [**updateProfile**](docs/DiscovrApi.md#updateprofile) | **PATCH** /profiles/{profileId} | Update a profile
*MediaApi* | [**getMedia**](docs/MediaApi.md#getmedia) | **GET** /media/{mediaId} | Get media details
*MediaApi* | [**getMediaAssets**](docs/MediaApi.md#getmediaassets) | **GET** /media/{mediaId}/assets | Get media assets
*MediaApi* | [**getSeasonDetails**](docs/MediaApi.md#getseasondetails) | **GET** /media/{mediaId}/seasons/{seasonNumber} | Get TV season details
*MediaApi* | [**getSimilarRecommendations**](docs/MediaApi.md#getsimilarrecommendations) | **GET** /media/{mediaId}/similar | Get similar titles
*MiscApi* | [**getProfileImages**](docs/MiscApi.md#getprofileimages) | **GET** /profile-images | List avatar images
*MiscApi* | [**searchGifs**](docs/MiscApi.md#searchgifs) | **GET** /gif-search | Search GIFs
*PagesApi* | [**createPage**](docs/PagesApi.md#createpage) | **POST** /pages | Create a recommendation page
*PagesApi* | [**getPage**](docs/PagesApi.md#getpage) | **GET** /pages/{pageId} | Get a page
*ProfileListsApi* | [**addToWatchlist**](docs/ProfileListsApi.md#addtowatchlist) | **PUT** /profile/titles/{mediaId}/watchlist | Add a title to the watchlist
*ProfileListsApi* | [**clearRating**](docs/ProfileListsApi.md#clearrating) | **DELETE** /profile/titles/{mediaId}/rating | Clear a title\&#39;s rating
*ProfileListsApi* | [**deletePlaybackItem**](docs/ProfileListsApi.md#deleteplaybackitem) | **DELETE** /profile/playback/{mediaId} | Remove a title from Continue Watching
*ProfileListsApi* | [**getPlaybackItems**](docs/ProfileListsApi.md#getplaybackitems) | **GET** /profile/playback | Get playback items
*ProfileListsApi* | [**getSeasonState**](docs/ProfileListsApi.md#getseasonstate) | **GET** /profile/titles/{mediaId}/seasons/{seasonNumber} | Get which episodes of a TV season are watched
*ProfileListsApi* | [**getTitleState**](docs/ProfileListsApi.md#gettitlestate) | **GET** /profile/titles/{mediaId} | Get the active profile\&#39;s state for a title
*ProfileListsApi* | [**getTitles**](docs/ProfileListsApi.md#gettitles) | **GET** /profile/titles | List titles by rating, watchlist, or watch history
*ProfileListsApi* | [**importHistory**](docs/ProfileListsApi.md#importhistory) | **POST** /profile/history | Import a watch history entry
*ProfileListsApi* | [**removeFromWatchlist**](docs/ProfileListsApi.md#removefromwatchlist) | **DELETE** /profile/titles/{mediaId}/watchlist | Remove a title from the watchlist
*ProfileListsApi* | [**setRating**](docs/ProfileListsApi.md#setrating) | **PUT** /profile/titles/{mediaId}/rating | Set a title\&#39;s rating
*ProfilesApi* | [**createProfile**](docs/ProfilesApi.md#createprofile) | **POST** /profiles | Create a profile
*ProfilesApi* | [**deleteProfile**](docs/ProfilesApi.md#deleteprofile) | **DELETE** /profiles/{profileId} | Delete a profile
*ProfilesApi* | [**getProfile**](docs/ProfilesApi.md#getprofile) | **GET** /profiles/{profileId} | Get a profile
*ProfilesApi* | [**getProfiles**](docs/ProfilesApi.md#getprofiles) | **GET** /profiles | List profiles
*ProfilesApi* | [**updateProfile**](docs/ProfilesApi.md#updateprofile) | **PATCH** /profiles/{profileId} | Update a profile
*RowsApi* | [**getRow**](docs/RowsApi.md#getrow) | **GET** /pages/{pageId}/rows/{rowId} | Get a row
*RowsApi* | [**getRowItems**](docs/RowsApi.md#getrowitems) | **GET** /pages/{pageId}/rows/{rowId}/items | List row items
*RowsApi* | [**getRows**](docs/RowsApi.md#getrows) | **GET** /pages/{pageId}/rows | List rows
*ScrobbleApi* | [**markUnwatched**](docs/ScrobbleApi.md#markunwatched) | **DELETE** /profile/titles/{mediaId}/watched | Mark a title, season, or episode as unwatched
*ScrobbleApi* | [**markWatched**](docs/ScrobbleApi.md#markwatched) | **PUT** /profile/titles/{mediaId}/watched | Mark a title, season, or episode as watched
*ScrobbleApi* | [**scrobble**](docs/ScrobbleApi.md#scrobble) | **POST** /profile/scrobble/{mediaId} | Record playback progress
*SearchApi* | [**searchMedia**](docs/SearchApi.md#searchmedia) | **GET** /search | Search media


### Models

- [ApiError](docs/ApiError.md)
- [ApiErrorCode](docs/ApiErrorCode.md)
- [AvatarMediaType](docs/AvatarMediaType.md)
- [CastMember](docs/CastMember.md)
- [CreatePagePayload](docs/CreatePagePayload.md)
- [CreatePageResponse](docs/CreatePageResponse.md)
- [CreateProfilePayload](docs/CreateProfilePayload.md)
- [CreateProfileResponse](docs/CreateProfileResponse.md)
- [CrewMember](docs/CrewMember.md)
- [DeleteProfileResponse](docs/DeleteProfileResponse.md)
- [DemoSessionRequest](docs/DemoSessionRequest.md)
- [DemoSessionResponse](docs/DemoSessionResponse.md)
- [DeviceCodePayload](docs/DeviceCodePayload.md)
- [DeviceCodePendingResponse](docs/DeviceCodePendingResponse.md)
- [DeviceCodePollResponse](docs/DeviceCodePollResponse.md)
- [DeviceCodeResponse](docs/DeviceCodeResponse.md)
- [DevicePollPayload](docs/DevicePollPayload.md)
- [Episode](docs/Episode.md)
- [EpisodeCrewMember](docs/EpisodeCrewMember.md)
- [EpisodeGuestStar](docs/EpisodeGuestStar.md)
- [EpisodeRef](docs/EpisodeRef.md)
- [FilterSpec](docs/FilterSpec.md)
- [Genre](docs/Genre.md)
- [GetProfilesResponse](docs/GetProfilesResponse.md)
- [GetRowItemsResponse](docs/GetRowItemsResponse.md)
- [GetRowsResponse](docs/GetRowsResponse.md)
- [GifItem](docs/GifItem.md)
- [GifPreview](docs/GifPreview.md)
- [GifSearchResponse](docs/GifSearchResponse.md)
- [ImportHistoryPayload](docs/ImportHistoryPayload.md)
- [KnownForItem](docs/KnownForItem.md)
- [MediaAssetsResponse](docs/MediaAssetsResponse.md)
- [MediaAssetsTrailer](docs/MediaAssetsTrailer.md)
- [MediaCredits](docs/MediaCredits.md)
- [MediaExternalIds](docs/MediaExternalIds.md)
- [MediaItem](docs/MediaItem.md)
- [MediaItemTrailer](docs/MediaItemTrailer.md)
- [MediaItemType](docs/MediaItemType.md)
- [MediaResponse](docs/MediaResponse.md)
- [MediaResponseMovie](docs/MediaResponseMovie.md)
- [MediaResponseTv](docs/MediaResponseTv.md)
- [MediaResponseTvSeason](docs/MediaResponseTvSeason.md)
- [MintSessionTokenPayload](docs/MintSessionTokenPayload.md)
- [NavigationItem](docs/NavigationItem.md)
- [NavigationItemType](docs/NavigationItemType.md)
- [Page](docs/Page.md)
- [PlaybackItem](docs/PlaybackItem.md)
- [PlaybackListResponse](docs/PlaybackListResponse.md)
- [Profile](docs/Profile.md)
- [ProfileImagesResponse](docs/ProfileImagesResponse.md)
- [ProviderInfo](docs/ProviderInfo.md)
- [ProviderInfoRegion](docs/ProviderInfoRegion.md)
- [ProviderItem](docs/ProviderItem.md)
- [ProviderItemType](docs/ProviderItemType.md)
- [RateLimitedError](docs/RateLimitedError.md)
- [Rating](docs/Rating.md)
- [RefreshTokenResponse](docs/RefreshTokenResponse.md)
- [Row](docs/Row.md)
- [RowItem](docs/RowItem.md)
- [RowType](docs/RowType.md)
- [ScrobbleProgressBody](docs/ScrobbleProgressBody.md)
- [ScrobbleResponse](docs/ScrobbleResponse.md)
- [SearchResponse](docs/SearchResponse.md)
- [SearchResult](docs/SearchResult.md)
- [SeasonDetailsResponse](docs/SeasonDetailsResponse.md)
- [SeasonEpisodeState](docs/SeasonEpisodeState.md)
- [SeasonState](docs/SeasonState.md)
- [SessionTokenResponse](docs/SessionTokenResponse.md)
- [SetRatingPayload](docs/SetRatingPayload.md)
- [SignOutResponse](docs/SignOutResponse.md)
- [SimilarResponse](docs/SimilarResponse.md)
- [SimilarResult](docs/SimilarResult.md)
- [SuccessMessage](docs/SuccessMessage.md)
- [TitleListItem](docs/TitleListItem.md)
- [TitleListResponse](docs/TitleListResponse.md)
- [TitlePlayback](docs/TitlePlayback.md)
- [TitleState](docs/TitleState.md)
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
