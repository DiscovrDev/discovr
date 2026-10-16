/**
 * Tests for the one-line helper integrators are told to reach for instead of
 * `.id`.
 *
 * Its whole job is picking the right string out of an item, and it has two
 * ways to be quietly wrong. Return the `id` when a `ref` was present and the
 * call still succeeds — it just loses the attribution the ref exists to carry,
 * with nothing to notice. Return a navigation tile's own `id` instead of its
 * `pageId` and the call fails outright, because a tile's id is not a page id.
 * Both are invisible in the facade's type signature, so they need assertions.
 */

import { idOf, refOrId } from "../DiscovrClient";

/**
 * The same table is asserted in the Kotlin and Swift SDKs and against the
 * the API's own ref parser. Keep all four identical: a row added here and not
 * there is how the helpers drift apart.
 */
const ID_OF_CASES: ReadonlyArray<readonly [input: string, id: string]> = [
	["MV_550", "MV_550"],
	["MV_550@ctx", "MV_550"],
	["TV_1396@Zk3vQ9tXp2Lw.AbCdEfGhIjKlMnOp", "TV_1396"],
	["k7Qm2xR9pT@ctx", "k7Qm2xR9pT"],
	["", ""],
	["@ctx", ""],
];

describe("idOf", () => {
	it.each(ID_OF_CASES)("turns %j into %j", (input, id) => {
		expect(idOf(input)).toBe(id);
	});

	it("round-trips with refOrId, so a ref can be stored and its id recovered", () => {
		const item = { id: "MV_550", ref: "MV_550@ctx" };
		expect(idOf(refOrId(item))).toBe(item.id);
	});

	it("leaves a plain id alone, so it is safe to call on either", () => {
		expect(idOf(idOf("MV_550@ctx"))).toBe("MV_550");
	});

	it("recovers a navigation tile's page id from its ref", () => {
		const tile = { id: "nav-movies", pageId: "k7Qm2xR9pT", ref: "k7Qm2xR9pT@ctx" };
		expect(idOf(refOrId(tile))).toBe("k7Qm2xR9pT");
	});
});

describe("refOrId on every item that carries a ref", () => {
	// The helper is structural, so it works on whatever Discovr returns -- these
	// are the shapes that gained a `ref`: suggestions, a person's known-for
	// titles, and the three profile lists.
	it.each([
		["a similar result", { id: "MV_13", ref: "MV_13@ctx", tmdb_id: 13 }],
		["a known-for title", { id: "MV_238", ref: "MV_238@ctx", tmdb_id: 238 }],
		["a list item", { id: "MV_550", ref: "MV_550@ctx", title: "Fight Club" }],
	])("prefers the ref on %s", (_label, item) => {
		expect(refOrId(item)).toBe(item.ref);
	});

	it("falls back to the id when one has none", () => {
		expect(refOrId({ id: "MV_13" })).toBe("MV_13");
	});
});

describe("refOrId", () => {
	it("prefers the ref over the id", () => {
		expect(refOrId({ id: "MV_550", ref: "MV_550@ctx" })).toBe("MV_550@ctx");
	});

	it("falls back to the id when the item has no ref", () => {
		// Hero items built from a cached materialization, and anything a client
		// reconstructed itself, arrive without one. They still have to work.
		expect(refOrId({ id: "MV_550" })).toBe("MV_550");
		expect(refOrId({ id: "MV_550", ref: undefined })).toBe("MV_550");
	});

	it("resolves a navigation tile to the page it opens, not to the tile", () => {
		// A tile's `id` identifies the tile; `getPage` wants the page it links
		// to. Handing it the tile id is a 404, so the fallback order matters
		// more here than anywhere else.
		expect(refOrId({ id: "nav-movies", pageId: "k7Qm2xR9pT" })).toBe("k7Qm2xR9pT");
	});

	it("still prefers a tile's ref over its pageId", () => {
		expect(refOrId({ id: "nav-movies", pageId: "k7Qm2xR9pT", ref: "k7Qm2xR9pT@ctx" })).toBe(
			"k7Qm2xR9pT@ctx",
		);
	});

	it("ignores a null ref rather than returning it", () => {
		// The Kotlin and Swift ports get `null` from deserialization; the TS
		// models use `undefined`. The signature accepts both, so both have to
		// fall through — returning `null` here would put the string "null" in a
		// URL path.
		expect(refOrId({ id: "MV_550", ref: null })).toBe("MV_550");
		expect(refOrId({ id: "nav-movies", pageId: null, ref: null })).toBe("nav-movies");
	});
});
