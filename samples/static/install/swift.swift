// Package.swift
dependencies: [
    .package(url: "https://github.com/DiscovrDev/discovr", {{swiftRequirement}})
],
targets: [
    .target(
        name: "YourApp",
        dependencies: [.product(name: "Discovr", package: "discovr")]
    )
]
