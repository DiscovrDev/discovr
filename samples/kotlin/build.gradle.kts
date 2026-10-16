plugins {
    kotlin("jvm") version "2.2.20"
}

repositories {
    mavenCentral()
}

dependencies {
    // Substituted by the included SDK build, so this is never fetched from a registry.
    implementation("media.discovr:discovr-sdk")
    // The SDK exposes StateFlow and suspend functions, so samples need coroutines too.
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2")
}
