import api.discovr.*
import api.discovr.auth.*
import api.discovr.models.*
import kotlinx.coroutines.*

private suspend fun sample(client: DiscovrClient) {
    // docs:start
    val tracker = client.trackPlayback(item)

    // Send the real starting position (e.g. 45.0 when resuming, never 0.0 on resume).
    tracker.start(0.0)

    // Safe to call every second while playing — throttled to 30s automatically.
    tracker.update(32.5)

    // Pause, resume, and seek send immediately and deduplicate repeat events.
    tracker.pause(42.0)
    tracker.resume(42.0)
    tracker.seek(60.0)

    // Terminal call: once-only, awaits delivery, and returns the ScrobbleResponse.
    val result = tracker.stop(64.0) // or tracker.finish() at 100%
    // docs:end
    println(result)
}
