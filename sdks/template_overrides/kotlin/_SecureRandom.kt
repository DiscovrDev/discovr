package api.discovr.auth

/**
 * Fills a [size]-byte array with cryptographically secure random data.
 *
 * `kotlin.random.Random.Default` is not a CSPRNG on every target — on the JVM
 * it wraps `java.util.Random`, a linear congruential generator whose future
 * output is recoverable from a handful of observed outputs. That's fine for
 * jitter or sampling, but the CSRF `state` nonce this backs must be
 * unguessable, so each platform provides its own real CSPRNG below.
 */
internal expect fun secureRandomBytes(size: Int): ByteArray
