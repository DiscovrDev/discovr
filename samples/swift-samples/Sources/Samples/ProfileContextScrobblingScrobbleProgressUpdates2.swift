import Discovr
import Foundation

private func sample(client: DiscovrClient) async {
    // docs:start
    let ep5 = client.trackPlayback(
        item,
        tv: EpisodeRef(season: 1, episode: 5),
        onCompleted: { res in print("Completed seasons:", res.completedSeasons ?? []) }
    )
    ep5.start(progress: 0)
    await ep5.finish()

    // Next-episode autoplay: wait for ep5's final scrobble before ep6's start lands.
    let ep6 = client.trackPlayback(
        item,
        tv: EpisodeRef(season: 1, episode: 6),
        after: ep5
    )
    ep6.start(progress: 0)
    // docs:end
}
