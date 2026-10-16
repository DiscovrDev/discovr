import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget

plugins {
    kotlin("multiplatform") version "2.2.20" // kotlin_version
    kotlin("plugin.serialization") version "2.2.20" // kotlin_version
    id("com.vanniktech.maven.publish") version "0.36.0"
}

group = "media.discovr"
version = "1.0.0-alpha.1"

val kotlin_version = "2.2.20"
val coroutines_version = "1.10.2"
val serialization_version = "1.9.0"
val ktor_version = "3.2.3"

repositories {
    mavenCentral()
}

kotlin {
    jvm()
    iosX64()
    iosArm64()
    iosSimulatorArm64()
    js {
        browser()
        nodejs()
    }

    sourceSets {
        commonMain {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:$coroutines_version")
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:$serialization_version")
                // Models use kotlinx.serialization.json.JsonElement for free-form/untyped
                // API fields (e.g. Episode.crew, SearchResult.knownFor) — core alone doesn't include it.
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:$serialization_version")

                api("io.ktor:ktor-client-core:$ktor_version")
                api("io.ktor:ktor-client-serialization:$ktor_version")
                api("io.ktor:ktor-client-content-negotiation:$ktor_version")
                api("io.ktor:ktor-serialization-kotlinx-json:$ktor_version")

                api("org.jetbrains.kotlinx:kotlinx-datetime:0.7.1")
            }
        }

        commonTest {
            dependencies {
                implementation(kotlin("test"))
                implementation("io.ktor:ktor-client-mock:$ktor_version")
                // Needed by _DiscovrCacheTest.kt's runTest {} — not part of the
                // stock generator template, which only wires plain kotlin("test").
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:$coroutines_version")
            }
        }

        jvmMain {
            dependencies {
                implementation(kotlin("stdlib-jdk7"))
                implementation("io.ktor:ktor-client-cio-jvm:$ktor_version")
            }
        }

        jvmTest {
            dependencies {
                implementation(kotlin("test-junit"))
            }
        }

        iosMain {
            dependencies {
                api("io.ktor:ktor-client-ios:$ktor_version")
            }
        }

        jsMain {
            dependencies {
                api("io.ktor:ktor-client-js:$ktor_version")
            }
        }

        all {
            languageSettings {
                optIn("kotlin.time.ExperimentalTime")
            }
        }
    }
}

// Published to Maven Central by the release workflow. Signing only runs when the
// release job supplies a key, so local and CI builds stay unsigned.
mavenPublishing {
    publishToMavenCentral()
    if (providers.gradleProperty("signingInMemoryKey").isPresent) {
        signAllPublications()
    }

    coordinates("media.discovr", "discovr-sdk", "1.0.0-alpha.1")

    pom {
        name.set("Discovr SDK")
        description.set("Kotlin Multiplatform SDK for the Discovr API.")
        url.set("https://docs.discovr.media")
        inceptionYear.set("2026")
        licenses {
            license {
                name.set("MIT License")
                url.set("https://opensource.org/licenses/MIT")
                distribution.set("repo")
            }
        }
        developers {
            developer {
                id.set("discovr")
                name.set("Discovr")
                email.set("dev@discovr.media")
                url.set("https://discovr.media")
            }
        }
        scm {
            url.set("https://github.com/DiscovrDev/discovr")
            connection.set("scm:git:git://github.com/DiscovrDev/discovr.git")
            developerConnection.set("scm:git:ssh://git@github.com/DiscovrDev/discovr.git")
        }
    }
}

tasks {
    register<Exec>("iosTest") {
        val device = project.findProperty("device")?.toString() ?: "iPhone 8"
        dependsOn("linkDebugTestIosX64")
        group = JavaBasePlugin.VERIFICATION_GROUP
        description = "Execute unit tests on ${device} simulator"
        val binary = kotlin.targets.getByName<KotlinNativeTarget>("iosX64").binaries.getTest("DEBUG")
        commandLine("xcrun", "simctl", "spawn", device, binary.outputFile)
    }
    register("test") {
        dependsOn("allTests")
    }
}
