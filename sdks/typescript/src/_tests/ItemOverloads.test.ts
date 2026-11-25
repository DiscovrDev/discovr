import { DiscovrClient } from "../DiscovrClient";
import { _DiscovrClientBase } from "../_DiscovrClientBase";
import type {
	MediaItem,
	NavigationItem,
	PlaybackItem,
	ProviderItem,
	TitleListItem,
} from "../models/index";

describe("DiscovrClient item-taking overloads (A16)", () => {
	const mediaItem = {
		id: "MV_550",
		ref: "MV_550@row",
		title: "Fight Club",
		overview: "",
		mediaType: "movie",
		type: "media",
	} as unknown as MediaItem;

	const titleWithoutRef = {
		id: "TV_1396",
		mediaType: "tv",
		title: "Breaking Bad",
		posterPath: {},
		backdropPath: {},
		watchlist: true,
		updatedAt: new Date(0),
	} as unknown as TitleListItem;

	const playbackItem: PlaybackItem = {
		id: "TV_1396",
		ref: "TV_1396@cw",
		mediaType: "tv",
		title: "Breaking Bad",
		posterPath: {},
		backdropPath: {},
		season: 1,
		episode: 3,
		createdAt: new Date(0),
	};

	const navTile = {
		id: "nav-action",
		title: "Action",
		pageId: "pAction123",
		ref: "pAction123@nav",
		type: "navigation",
	} as unknown as NavigationItem;

	const providerTileNoRef = {
		id: "prov-8",
		title: "Provider",
		pageId: "pProv8",
		type: "provider",
		paths: {},
	} as unknown as ProviderItem;

	let client: DiscovrClient;

	beforeEach(() => {
		client = new DiscovrClient("test-client", { cache: false });
	});

	afterEach(() => {
		jest.restoreAllMocks();
		client.close();
	});

	it("forwards refOrId for every title-taking method (preferring ref over id)", async () => {
		const proto = _DiscovrClientBase.prototype;
		const spies = {
			getMedia: jest.spyOn(proto, "getMedia").mockResolvedValue({} as never),
			getMediaAssets: jest.spyOn(proto, "getMediaAssets").mockResolvedValue({} as never),
			getSimilarRecommendations: jest
				.spyOn(proto, "getSimilarRecommendations")
				.mockResolvedValue({} as never),
			getSeasonDetails: jest.spyOn(proto, "getSeasonDetails").mockResolvedValue({} as never),
			getTitleState: jest.spyOn(proto, "getTitleState").mockResolvedValue({} as never),
			getSeasonState: jest.spyOn(proto, "getSeasonState").mockResolvedValue({} as never),
			setRating: jest.spyOn(proto, "setRating").mockResolvedValue({} as never),
			clearRating: jest.spyOn(proto, "clearRating").mockResolvedValue({} as never),
			addToWatchlist: jest.spyOn(proto, "addToWatchlist").mockResolvedValue({} as never),
			removeFromWatchlist: jest.spyOn(proto, "removeFromWatchlist").mockResolvedValue({} as never),
			markWatched: jest.spyOn(proto, "markWatched").mockResolvedValue({} as never),
			markUnwatched: jest.spyOn(proto, "markUnwatched").mockResolvedValue({} as never),
			deletePlaybackItem: jest.spyOn(proto, "deletePlaybackItem").mockResolvedValue({} as never),
			scrobble: jest.spyOn(proto, "scrobble").mockResolvedValue({} as never),
		};

		await client.getMedia(mediaItem);
		await client.getMediaAssets(mediaItem);
		await client.getSimilarRecommendations(mediaItem, { page: 2 });
		await client.getSeasonDetails(playbackItem, 1);
		await client.getTitleState(mediaItem, { providers: true });
		await client.getSeasonState(titleWithoutRef, 2);
		await client.setRating(mediaItem, "liked");
		await client.clearRating(mediaItem);
		await client.addToWatchlist(mediaItem);
		await client.removeFromWatchlist(mediaItem);
		await client.markWatched(playbackItem, { season: 1, episode: 3 });
		await client.markUnwatched(titleWithoutRef, { season: 1 });
		await client.deletePlaybackItem(playbackItem);
		await client.scrobble(playbackItem, 55, { tv: { season: 1, episode: 3 } });

		expect(spies.getMedia).toHaveBeenCalledWith("MV_550@row", undefined);
		expect(spies.getMediaAssets).toHaveBeenCalledWith("MV_550@row", undefined);
		expect(spies.getSimilarRecommendations).toHaveBeenCalledWith("MV_550@row", { page: 2 });
		expect(spies.getSeasonDetails).toHaveBeenCalledWith("TV_1396@cw", 1, undefined);
		expect(spies.getTitleState).toHaveBeenCalledWith("MV_550@row", { providers: true });
		expect(spies.getSeasonState).toHaveBeenCalledWith("TV_1396", 2);
		expect(spies.setRating).toHaveBeenCalledWith("MV_550@row", "liked");
		expect(spies.clearRating).toHaveBeenCalledWith("MV_550@row");
		expect(spies.addToWatchlist).toHaveBeenCalledWith("MV_550@row");
		expect(spies.removeFromWatchlist).toHaveBeenCalledWith("MV_550@row");
		expect(spies.markWatched).toHaveBeenCalledWith("TV_1396@cw", { season: 1, episode: 3 });
		expect(spies.markUnwatched).toHaveBeenCalledWith("TV_1396", { season: 1 });
		expect(spies.deletePlaybackItem).toHaveBeenCalledWith("TV_1396@cw");
		expect(spies.scrobble).toHaveBeenCalledWith("TV_1396@cw", 55, {
			tv: { season: 1, episode: 3 },
		});
	});

	it("forwards refOrId for every page/tile-taking method (falling back to pageId)", async () => {
		const proto = _DiscovrClientBase.prototype;
		const spies = {
			getPage: jest.spyOn(proto, "getPage").mockResolvedValue({} as never),
			getRows: jest.spyOn(proto, "getRows").mockResolvedValue({} as never),
			getRow: jest.spyOn(proto, "getRow").mockResolvedValue({} as never),
			getRowItems: jest.spyOn(proto, "getRowItems").mockResolvedValue({} as never),
		};

		await client.getPage(navTile);
		await client.getRows(navTile, { limit: 10 });
		await client.getRow(providerTileNoRef, "row_1");
		await client.getRowItems(providerTileNoRef, "row_1", { limit: 12 });

		// Raw strings continue to work unchanged
		await client.getPage("rawPageId");

		expect(spies.getPage).toHaveBeenNthCalledWith(1, "pAction123@nav", undefined);
		expect(spies.getPage).toHaveBeenNthCalledWith(2, "rawPageId", undefined);
		expect(spies.getRows).toHaveBeenCalledWith("pAction123@nav", { limit: 10 });
		expect(spies.getRow).toHaveBeenCalledWith("pProv8", "row_1", undefined);
		expect(spies.getRowItems).toHaveBeenCalledWith("pProv8", "row_1", { limit: 12 });
	});
});
