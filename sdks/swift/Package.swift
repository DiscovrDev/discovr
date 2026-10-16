// swift-tools-version:6.0

import PackageDescription

let package = Package(
    name: "Discovr",
    platforms: [
        // Floors match what Swift Concurrency actually requires (the generated
        // client uses `async`/`await` and `Task` throughout) — anything lower
        // compiles the manifest but fails at the first `Task { }` with
        // "only available in macOS 10.15 or newer" and its per-platform
        // equivalents. Do not lower these without removing that usage first.
        .iOS(.v13),
        .macOS(.v10_15),
        .tvOS(.v13),
        .watchOS(.v6),
    ],
    products: [
        // Products define the executables and libraries produced by a package, and make them visible to other packages.
        .library(
            name: "Discovr",
            targets: ["Discovr"]
        ),
    ],
    dependencies: [
        // Dependencies declare other packages that this package depends on.
    ],
    targets: [
        // Targets are the basic building blocks of a package. A target can define a module or a test suite.
        // Targets can depend on other targets in this package, and on products in packages which this package depends on.
        .target(
            name: "Discovr",
            dependencies: [],
            path: "Sources/Discovr"
        ),
        .testTarget(
            name: "DiscovrTests",
            dependencies: ["Discovr"],
            path: "Tests/DiscovrTests"
        ),
    ],
    swiftLanguageModes: [.v6]
)
