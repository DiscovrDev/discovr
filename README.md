# Discovr

Discovr is the recommendation engine your streaming app needs. We handle personalization so you can focus on building a great experience for your users.

This repository holds everything developers build on: the API specification, the three client SDKs, the documentation source, and the code samples the guides are built from.

**Start here:** [docs.discovr.media](https://docs.discovr.media)

## Install

The SDKs are in alpha. They share one version number, which is also the API version.

| SDK        | Install                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| TypeScript | `npm install discovr@alpha`                                                                          |
| Kotlin     | `implementation("media.discovr:discovr-sdk:<version>")`                                              |
| Swift      | `.package(url: "https://github.com/DiscovrDev/discovr", exact: "<version>")` (Swift Package Manager) |

Pick `<version>` from the [releases page](https://github.com/DiscovrDev/discovr/releases). Alpha versions look like `1.0.0-alpha.1`, and Swift Package Manager only selects them when you pin the version exactly.

## What's in here

| Folder      | What it is                                                                           |
| ----------- | ------------------------------------------------------------------------------------ |
| `sdks/`     | The TypeScript, Kotlin and Swift SDKs. All three expose the same features.           |
| `open_api/` | The API specification the SDKs and reference docs are generated from.                |
| `docs/`     | The source of [docs.discovr.media](https://docs.discovr.media), built with Mintlify. |
| `samples/`  | The code samples used in the guides, compiled against the SDKs so they stay honest.  |
| `scripts/`  | The tooling that generates the SDKs and reference pages from the specification.      |

## A note on this repository

The SDKs and reference docs here are generated, and this repository is published from our own development setup. That means pull requests can't be merged here directly, and the scripts in `scripts/` are published for reference rather than to be run from this checkout.

Found a bug, or a page that's unclear? Open an issue and we'll take it from there. For security problems, see [SECURITY.md](SECURITY.md).

## License

The SDKs, samples and documentation are released under the [MIT License](LICENSE). The Discovr name and logos are not covered by it (see [NOTICE](NOTICE)), and use of the API is governed by the [Developer Terms](https://discovr.media/terms).
