package api.discovr.auth

import org.khronos.webgl.Uint8Array
import org.khronos.webgl.get

/**
 * `crypto` is a global in both targets `js { browser(); nodejs() }` compiles
 * for, but reached differently: `window.crypto`/bare `crypto` in a browser,
 * `require('crypto').webcrypto` under Node. Resolved dynamically so one
 * artifact works in either host.
 */
internal actual fun secureRandomBytes(size: Int): ByteArray {
	val array = Uint8Array(size)
	val webcrypto: dynamic =
		js(
			"(typeof crypto !== 'undefined' ? crypto : require('crypto').webcrypto)",
		)
	webcrypto.getRandomValues(array)
	return ByteArray(size) { array[it].toByte() }
}
