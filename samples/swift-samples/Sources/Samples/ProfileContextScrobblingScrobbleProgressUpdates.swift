import Discovr
import Foundation

private func sample(client: DiscovrClient) async {
    // docs:start
    let tracker = client.trackPlayback(item)

    // Send the real starting position (e.g. 45 when resuming, never 0 on resume).
    tracker.start(progress: 0)

    // Safe to call every second while playing — throttled to 30s automatically.
    tracker.update(progress: 32.5)

    // Pause, resume, and seek send immediately and deduplicate repeat events.
    tracker.pause(progress: 42.0)
    tracker.resume(progress: 42.0)
    tracker.seek(progress: 60.0)

    // Terminal call: once-only, awaits delivery, and returns the ScrobbleResponse.
    let result = await tracker.stop(progress: 64.0) // or await tracker.finish() at 100%
    // docs:end
    _ = result
}
