import Discovr
import Foundation

private func sample(client: DiscovrClient) async {
    // docs:start
    let tracker = client.trackPlayback(
        item,
        onError: { err in print("Scrobble failed:", err) }
    )

    // Pass the current stream's (position, duration) in any matching unit (seconds or ms).
    // Calls with duration <= 0 are ignored instead of overwriting resume position with 0%.
    func onPlay(position: Double, duration: Double) {
        tracker.start(position: position, duration: duration)
    }
    func onTimeUpdate(position: Double, duration: Double) {
        tracker.update(position: position, duration: duration) // throttled to every 30s
    }
    func onPause(position: Double, duration: Double) {
        tracker.pause(position: position, duration: duration)
    }
    func onSeek(position: Double, duration: Double) {
        tracker.seek(position: position, duration: duration)
    }
    func onStop(position: Double, duration: Double) async {
        await tracker.stop(position: position, duration: duration)
    }
    // docs:end
    onPlay(position: 0, duration: 100)
    onTimeUpdate(position: 10, duration: 100)
    onPause(position: 20, duration: 100)
    onSeek(position: 30, duration: 100)
    await onStop(position: 40, duration: 100)
}
