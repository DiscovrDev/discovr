// docs:start
import Discovr
// docs:end

private func sample() async {
    // docs:start
    // The initializer is async, so create the client inside a Task or .task.
    let client = await DiscovrClient(clientId: "YOUR_CLIENT_ID")
    // docs:end
    _ = client
}
