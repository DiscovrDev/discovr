---
name: discovr
description: Use when building or reviewing an integration with Discovr, the recommendation engine for streaming apps (sign-in, profiles, recommendation pages, media details, playback tracking, search). Tells an agent which docs to read, in what order, and where to look up exact API/SDK contracts.
---

# Discovr

Discovr is a recommendation engine for streaming apps: users sign in, pick a profile, and get a personalized home screen of rows that updates with what they watch. Apps integrate it via SDK (TypeScript, Kotlin, Swift) or the REST API.

All docs live at **https://docs.discovr.media**. If you have the Discovr MCP server connected, search it directly. If not, fetch the URLs below over HTTP — every page is also available as Markdown by appending `.md` (for example, `https://docs.discovr.media/guides/authentication.md`).

## Before you write any code

You need a **Client ID** for the person's app. It's in their dashboard under **Developer Options → Demo sessions** (the **Developer** toggle must be on). Ask them for it. You can't sign in to the dashboard on their behalf, and you shouldn't try.

## Read the docs in order, starting here

Discovr's guides are written as a single build path, each one picking up where the last left off. Don't skip ahead or infer API shape from general knowledge — read the actual guide for the step you're on.

Start at **[Getting started](https://docs.discovr.media/guides/getting-started)** and follow it. It lays out the full build order and links to the next guide at the bottom of every page. In order, the path covers:

1. [Sign in](https://docs.discovr.media/guides/authentication)
2. [Profile picker](https://docs.discovr.media/guides/profiles)
3. [Recommendation pages](https://docs.discovr.media/guides/pages)
4. [Media details](https://docs.discovr.media/guides/media)
5. [Playback tracking](https://docs.discovr.media/guides/profile-context)
6. [Search](https://docs.discovr.media/guides/media/search)

If the docs are restructured, this list — not its content — is what needs updating.

## The six steps are not the whole job

Those six steps are the order to build in, not the definition of done. A complete Discovr client also has the controls that sit beside them. Implement **every** item below. Don't leave one out because it looks optional or because the guide introduces it as a suggestion; if the person doesn't want it, they'll say so.

**Sign-in and profiles**

- Sign in with the flow that fits the platform ([web](https://docs.discovr.media/guides/authentication/web-sign-in), or [device code](https://docs.discovr.media/guides/authentication/device-code) on TVs), and listen to the auth state so every sign-in and sign-out lands in one place.
- Sign out, and handle being signed out for you: [signing out](https://docs.discovr.media/guides/authentication/signing-out).
- Choose a profile ("who's watching?") and switch profile from anywhere: [listing and selecting profiles](https://docs.discovr.media/guides/profiles/listing-and-selecting-profiles).
- Create, edit and delete a profile: [managing profiles](https://docs.discovr.media/guides/profiles/managing-profiles).
- Avatars from the default gallery **and** GIF search (with the KLIPY attribution). Render both pictures and video, and animate only the avatar that has focus or hover.

**Browse**

- A home page with its hero and rows, plus the Movies and Series tabs: [pages](https://docs.discovr.media/guides/pages).
- Every row type: `media` and `top_n` open a title, `navigation` opens another page (draw the tile art as given, don't add the title on top), `provider` opens a streaming service's page: [rows](https://docs.discovr.media/guides/rows).
- Drill-down pages with a way back: [navigation](https://docs.discovr.media/guides/navigation). Load the hero first and rows as they scroll into view: [lazy loading](https://docs.discovr.media/guides/navigation/lazy-loading).
- Refresh when recommendations turn over: [recommendations](https://docs.discovr.media/guides/recommendations).
- Search, including people, not only titles: [search](https://docs.discovr.media/guides/media/search).

**Title details**

- Artwork, synopsis and metadata, plus seasons and episodes (with a checkmark on each finished episode) for a series, and similar titles when there are any: [media details](https://docs.discovr.media/guides/media), [finished episodes](https://docs.discovr.media/guides/profile-context/season-profile-meta).
- Where to watch: `providers: true` on `getMediaProfileMeta` for the services the viewer picked, `watchProviders` on `getMedia` for every service that carries the title.
- The viewer's own state on the title (lists, resume position, finished or not): [media state](https://docs.discovr.media/guides/profile-context/media-profile-meta).

**Lists and ratings**

- Rate a title with like, dislike and super-like as **one** three-way control ("not for me", "I like this", "love this"); a title is in only one of the three: [rating a title](https://docs.discovr.media/guides/profile-context#rating-a-title).
- A watchlist ("My list"): add and remove on the details screen, and a screen that lists it.
- Continue Watching, built from the playback list: [profile context](https://docs.discovr.media/guides/profile-context).

**Playback**

- Scrobble while playing, about every 30 seconds and on every pause, seek and end: [scrobbling](https://docs.discovr.media/guides/profile-context/scrobbling).
- Mark as watched (scrobble 100) and mark as unwatched (`markUnwatched`), per movie, season or episode: [scrobbling](https://docs.discovr.media/guides/profile-context/scrobbling).
- Watch history where it helps the viewer, for example a "Watch it again" row.

**Quality**

- Handle errors the way the SDK expects, including rate limits: [error handling](https://docs.discovr.media/guides/reference/error-handling).
- Follow the [security](https://docs.discovr.media/guides/reference/security) guidance for stored credentials, and use the [Discovr branding](https://docs.discovr.media/guides/reference/branding) for the sign-in button.

## Look up exact contracts in the references

Once you know which step you're implementing, use:

- **[API Reference](https://docs.discovr.media/api-reference)** for endpoint request/response shapes.
- **[SDK Reference](https://docs.discovr.media/sdk-reference)** for exact method signatures and types across TypeScript, Kotlin, and Swift.

These are the source of truth for signatures — don't guess or reuse patterns from unrelated APIs.

## How the MCP server fits in

This file tells you what to read and in what order. The Discovr MCP server (`https://docs.discovr.media/mcp`) searches that same live documentation — guides, API reference, and SDK reference — so you can look something up mid-implementation without leaving your editor. Install both for the best results; if you only have this file, fall back to fetching the URLs above directly.

## Bugs, feature requests and what's changing

Bugs and feature requests go to the **[Discovr Feedback Board](https://discoverapi.userjot.com/)**. The public roadmap and the changelog live there too, so it's also where to check whether something is planned or already fixed.

If the person hits behaviour that looks like a Discovr bug, or needs something Discovr doesn't offer, tell them about the board rather than working around it silently. You can't post there on their behalf. If a docs page is wrong or unclear and you have the MCP server's `submit_feedback` tool, use it for that.

## When in doubt

Search the docs via MCP, or check [error handling](https://docs.discovr.media/guides/reference/error-handling), [security](https://docs.discovr.media/guides/reference/security), and [branding](https://docs.discovr.media/guides/reference/branding) for anything outside the six steps above.
