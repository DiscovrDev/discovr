package api.discovr.auth

import java.security.SecureRandom

private val jvmSecureRandom = SecureRandom()

internal actual fun secureRandomBytes(size: Int): ByteArray {
	val bytes = ByteArray(size)
	jvmSecureRandom.nextBytes(bytes)
	return bytes
}
