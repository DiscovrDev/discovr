package api.discovr.auth

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertTrue

/** SHA-256 and the PKCE pair, pinned by the published vectors. */
class PkceTest {

    private fun hex(bytes: ByteArray) = bytes.joinToString("") { (it.toInt() and 0xFF).toString(16).padStart(2, '0') }
    private fun sha256Hex(text: String) = hex(sha256(text.encodeToByteArray()))

    @Test
    fun sha256MatchesTheFipsVectors() {
        assertEquals("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", sha256Hex(""))
        assertEquals("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad", sha256Hex("abc"))
        // Two blocks: the padding has to spill into a second one.
        assertEquals(
            "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
            sha256Hex("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"),
        )
        // The 55/56/63/64-byte boundaries where padding changes shape.
        assertEquals("9f4390f8d30c2dd92ec9f095b65e2b9ae9b0a925a5258e241c9f1e910f734318", sha256Hex("a".repeat(55)))
        assertEquals("b35439a4ac6f0948b6d6f9e3c6af0f5f590ce20f1bde7090ef7970686ec6738a", sha256Hex("a".repeat(56)))
        assertEquals("7d3e74a05d7db15bce4ad9ec0658ea98e3f06eeecf16b4c6fff2da457ddc2f34", sha256Hex("a".repeat(63)))
        assertEquals("ffe054fe7ae0cb6dc65c3af9b61d5209f439851db43d0ba5997337df154668eb", sha256Hex("a".repeat(64)))
    }

    @Test
    fun base64UrlUsesTheUrlSafeAlphabetWithoutPadding() {
        assertEquals("", base64Url(byteArrayOf()))
        assertEquals("Zg", base64Url("f".encodeToByteArray()))
        assertEquals("Zm8", base64Url("fo".encodeToByteArray()))
        assertEquals("Zm9v", base64Url("foo".encodeToByteArray()))
        assertEquals("Zm9vYg", base64Url("foob".encodeToByteArray()))
        // 0xFB 0xFF is "+/" in standard base64 and "-_" in the URL-safe one.
        assertEquals("-_8", base64Url(byteArrayOf(0xFB.toByte(), 0xFF.toByte())))
    }

    @Test
    fun theChallengeMatchesTheRfc7636AppendixBVector() {
        val verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"
        assertEquals("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM", base64Url(sha256(verifier.encodeToByteArray())))
    }

    @Test
    fun aPairIsAFortyThreeCharacterVerifierAndItsS256Challenge() {
        val pair = createPkcePair()

        assertEquals(43, pair.verifier.length)
        assertEquals(43, pair.challenge.length)
        assertTrue(pair.verifier.all { it.isLetterOrDigit() || it == '-' || it == '_' })
        assertEquals(base64Url(sha256(pair.verifier.encodeToByteArray())), pair.challenge)
    }

    @Test
    fun pairsNeverRepeat() {
        assertNotEquals(createPkcePair().verifier, createPkcePair().verifier)
    }
}
