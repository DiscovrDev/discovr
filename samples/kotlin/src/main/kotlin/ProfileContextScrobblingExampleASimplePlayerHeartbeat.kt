import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    val tracker = client.trackPlayback(
        item,
        onError = { err -> println("Scrobble failed: $err") },
    )

    // Pass the current stream's (position, duration) in any matching unit (seconds or ms).
    // Calls with duration <= 0 are ignored instead of overwriting resume position with 0%.
    fun onPlay(position: Double, duration: Double) = tracker.start(position, duration)
    fun onTimeUpdate(position: Double, duration: Double) = tracker.update(position, duration) // throttled to every 30s
    fun onPause(position: Double, duration: Double) = tracker.pause(position, duration)
    fun onSeek(position: Double, duration: Double) = tracker.seek(position, duration)
    suspend fun onStop(position: Double, duration: Double) = tracker.stop(position, duration)
    // docs:end
    onPlay(0.0, 100.0)
    onTimeUpdate(10.0, 100.0)
    onPause(20.0, 100.0)
    onSeek(30.0, 100.0)
    onStop(40.0, 100.0)
}
