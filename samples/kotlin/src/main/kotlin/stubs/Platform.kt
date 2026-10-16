// Just enough of Android and Compose for the guides' platform snippets to
// compile on a plain JVM. These are not the real classes.

package android.content

class Context {
    fun startActivity(intent: Intent) {}
}

class Intent(action: String, uri: android.net.Uri) {
    companion object {
        const val ACTION_VIEW = "android.intent.action.VIEW"
    }
}
