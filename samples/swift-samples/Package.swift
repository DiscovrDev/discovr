// swift-tools-version:6.0
import PackageDescription

// Compiles every Swift guide sample against the generated SDK, so a sample in
// the docs cannot drift from the API it describes.
let package = Package(
    name: "Samples",
    platforms: [.iOS(.v16), .macOS(.v13), .tvOS(.v16)],
    products: [.library(name: "Samples", targets: ["Samples"])],
    dependencies: [.package(path: "../../sdks/swift")],
    targets: [
        .target(name: "Samples", dependencies: [.product(name: "Discovr", package: "swift")]),
    ]
)
