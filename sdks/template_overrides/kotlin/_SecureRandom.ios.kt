package api.discovr.auth

import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.addressOf
import kotlinx.cinterop.convert
import kotlinx.cinterop.usePinned
import platform.Security.SecRandomCopyBytes
import platform.Security.kSecRandomDefault

@OptIn(ExperimentalForeignApi::class)
internal actual fun secureRandomBytes(size: Int): ByteArray {
	val bytes = UByteArray(size)
	val status = bytes.usePinned { pinned ->
		SecRandomCopyBytes(kSecRandomDefault, size.convert(), pinned.addressOf(0))
	}
	check(status == 0) { "SecRandomCopyBytes failed with status $status" }
	return ByteArray(size) { bytes[it].toByte() }
}
