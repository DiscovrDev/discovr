import Discovr

private func sample() async {
    // docs:start
    let client = await DiscovrClient(clientId: "YOUR_CLIENT_ID", demoMode: true)
    // docs:end
    _ = client
}
