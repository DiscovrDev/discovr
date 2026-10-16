package api.discovr.auth

/**
 * PKCE (RFC 7636) for the web sign-in flows: a random verifier the SDK keeps, and
 * the S256 challenge the server stores and later checks the verifier against.
 *
 * SHA-256 is implemented here, once, in plain Kotlin, rather than as an
 * `expect`/`actual` per platform. It is ~40 lines, runs identically on the JVM,
 * iOS and JS targets, and is pinned by the published test vectors in the test
 * file, which a platform wrapper around three different crypto APIs would not be.
 */
internal data class PkcePair(
    /** 32 random bytes, base64url: 43 characters, inside the 43-128 RFC 7636 allows. Never leaves the SDK until the code is redeemed. */
    val verifier: String,
    /** `base64url(SHA-256(verifier))`, 43 characters. */
    val challenge: String,
)

internal fun createPkcePair(): PkcePair {
    val verifier = base64Url(secureRandomBytes(32))
    return PkcePair(verifier, base64Url(sha256(verifier.encodeToByteArray())))
}

private const val BASE64_URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

/** Base64 with the URL-safe alphabet and no padding. */
internal fun base64Url(bytes: ByteArray): String {
    val out = StringBuilder((bytes.size * 4 + 2) / 3)
    var i = 0
    while (i < bytes.size) {
        val b0 = bytes[i].toInt() and 0xFF
        val b1 = if (i + 1 < bytes.size) bytes[i + 1].toInt() and 0xFF else -1
        val b2 = if (i + 2 < bytes.size) bytes[i + 2].toInt() and 0xFF else -1
        out.append(BASE64_URL[b0 shr 2])
        out.append(BASE64_URL[((b0 and 0x03) shl 4) or (if (b1 >= 0) b1 shr 4 else 0)])
        if (b1 >= 0) out.append(BASE64_URL[((b1 and 0x0F) shl 2) or (if (b2 >= 0) b2 shr 6 else 0)])
        if (b2 >= 0) out.append(BASE64_URL[b2 and 0x3F])
        i += 3
    }
    return out.toString()
}

private val SHA256_K = intArrayOf(
    0x428a2f98, 0x71374491, -0x4a3f0431, -0x164a245b, 0x3956c25b, 0x59f111f1, -0x6dc07d5c, -0x54e3a12b,
    -0x27f85568, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, -0x7f214e02, -0x6423f959, -0x3e640e8c,
    -0x1b64963f, -0x1041b87a, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    -0x67c1aeae, -0x57ce3993, -0x4ffcd838, -0x40a68039, -0x391ff40d, -0x2a586eb9, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, -0x7e3d36d2, -0x6d8dd37b,
    -0x5d40175f, -0x57e599b5, -0x3db47490, -0x3893ae5d, -0x2e6d17e7, -0x2966f9dc, -0xbf1ca7b, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, -0x7b3787ec, -0x7338fdf8, -0x6f410006, -0x5baf9315, -0x41065c09, -0x398e870e,
)

/** SHA-256 (FIPS 180-4) of [message]. */
internal fun sha256(message: ByteArray): ByteArray {
    val h = intArrayOf(
        0x6a09e667, -0x4498517b, 0x3c6ef372, -0x5ab00ac6, 0x510e527f, -0x64fa9774, 0x1f83d9ab, 0x5be0cd19,
    )
    val paddedLength = ((message.size + 9 + 63) / 64) * 64
    val padded = ByteArray(paddedLength)
    message.copyInto(padded)
    padded[message.size] = 0x80.toByte()
    val bitLength = message.size.toLong() * 8
    for (i in 0 until 8) padded[paddedLength - 1 - i] = (bitLength ushr (8 * i)).toByte()

    val w = IntArray(64)
    for (block in 0 until paddedLength step 64) {
        for (t in 0 until 16) {
            val o = block + t * 4
            w[t] = ((padded[o].toInt() and 0xFF) shl 24) or ((padded[o + 1].toInt() and 0xFF) shl 16) or
                ((padded[o + 2].toInt() and 0xFF) shl 8) or (padded[o + 3].toInt() and 0xFF)
        }
        for (t in 16 until 64) {
            val s0 = w[t - 15].rotateRight(7) xor w[t - 15].rotateRight(18) xor (w[t - 15] ushr 3)
            val s1 = w[t - 2].rotateRight(17) xor w[t - 2].rotateRight(19) xor (w[t - 2] ushr 10)
            w[t] = w[t - 16] + s0 + w[t - 7] + s1
        }
        var a = h[0]; var b = h[1]; var c = h[2]; var d = h[3]
        var e = h[4]; var f = h[5]; var g = h[6]; var hh = h[7]
        for (t in 0 until 64) {
            val s1 = e.rotateRight(6) xor e.rotateRight(11) xor e.rotateRight(25)
            val ch = (e and f) xor (e.inv() and g)
            val t1 = hh + s1 + ch + SHA256_K[t] + w[t]
            val s0 = a.rotateRight(2) xor a.rotateRight(13) xor a.rotateRight(22)
            val maj = (a and b) xor (a and c) xor (b and c)
            val t2 = s0 + maj
            hh = g; g = f; f = e; e = d + t1; d = c; c = b; b = a; a = t1 + t2
        }
        h[0] += a; h[1] += b; h[2] += c; h[3] += d; h[4] += e; h[5] += f; h[6] += g; h[7] += hh
    }

    val out = ByteArray(32)
    for (i in 0 until 8) for (j in 0 until 4) out[i * 4 + j] = (h[i] ushr (24 - 8 * j)).toByte()
    return out
}
